<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

use Yard\PageGuard\Admin\Controllers\AdminColumnsController;
use Yard\PageGuard\Admin\Controllers\AdminOverviewController;
use Yard\PageGuard\Admin\Controllers\AdminSettingsController;
use Yard\PageGuard\Foundation\Plugin;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\PostTypes;

class AdminServiceProvider extends ServiceProvider
{
	use PostTypes;

	private AdminSettingsController $adminSettingsController;
	private AdminOverviewController $adminOverviewController;
	private AdminColumnsController $adminColumnsController;

	public function __construct(Plugin $plugin)
	{
		parent::__construct($plugin);

		$this->adminSettingsController = new AdminSettingsController();
		$this->adminOverviewController = new AdminOverviewController();
		$this->adminColumnsController = new AdminColumnsController();
	}

	public function register(): void
	{
		$this->adminSettingsController->init();
		$this->adminOverviewController->init();
		$this->adminColumnsController->init();

		add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorSidebarAssets']);
	}

	public function enqueueEditorSidebarAssets(): void
	{
		if (! $this->isEditorForEnabledPostType()) {
			return;
		}

		$handle = 'ypg-editor-sidebar';

		wp_enqueue_style(
			$handle,
			$this->plugin->resourceUrl('editor-sidebar.css'),
			[],
			filemtime($this->plugin->resourcePath('editor-sidebar.css')),
		);

		wp_enqueue_script(
			$handle,
			$this->plugin->resourceUrl('editor-sidebar.js'),
			$this->getEditorScriptDependencies(),
			filemtime($this->plugin->resourcePath('editor-sidebar.js')),
			['in_footer' => true],
		);

		wp_set_script_translations($handle, 'yard-page-guard', $this->plugin->rootPath . '/languages');
	}

	private function getEditorScriptDependencies(): array
	{
		$path = $this->plugin->resourcePath('editor.deps.json', 'assets');
		$deps = file_exists($path) ? json_decode(file_get_contents($path), true) : [];

		return array_values(array_unique(array_merge(['wp-element'], is_array($deps) ? $deps : [])));
	}

	private function isEditorForEnabledPostType(): bool
	{
		if (! function_exists('get_current_screen')) {
			return false;
		}

		$screen = get_current_screen();

		if (! $screen instanceof \WP_Screen || ! $screen->is_block_editor()) {
			return false;
		}

		return in_array($screen->post_type, $this->getPostTypes(), true);
	}
}
