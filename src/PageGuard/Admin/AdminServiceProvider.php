<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

use Yard\PageGuard\Admin\Controllers\AdminColumnsController;
use Yard\PageGuard\Admin\Controllers\AdminOverviewController;
use Yard\PageGuard\Admin\Controllers\AdminSettingsController;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Foundation\Plugin;
use Yard\PageGuard\Foundation\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
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

		/**
		 * Enqueue admin scripts where necessary
		 */
		add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssetsPerHook']);

		/**
		 * Replace description column with email for external_content_owner taxonomy
		 */
		add_filter('manage_edit-ypg_external_content_owner_columns', [$this, 'manageExternalContentOwnerColumns']);

		/**
		 * Fill custom email column (see filter above) for external_content_owner taxonomy
		 */
		add_filter('manage_ypg_external_content_owner_custom_column', function (string $content, string $columnName, int $termId) {
			if ('email' === $columnName) {
				$content = get_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true);
			}

			if ('phone_number' === $columnName) {
				$content = get_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, true);
			}

			return $content;
		}, 10, 3);
	}

	public function enqueueAdminAssets(): void
	{
		wp_enqueue_style(
			'ypg-editor-styles',
			$this->plugin->resourceUrl('admin.css'),
			[],
			filemtime($this->plugin->resourcePath('admin.css')),
		);

		wp_enqueue_script(
			'ypg-editor-scripts',
			$this->plugin->resourceUrl('admin.js'),
			['wp-dom-ready'],
			filemtime($this->plugin->resourcePath('admin.js')),
		);
	}

	public function enqueueAdminAssetsPerHook(string $hook): void
	{
		// Settings & overview page
		if ('settings_page_page-guard-settings' === $hook || 'toplevel_page_ypg-overview' === $hook) {
			$this->enqueueAdminAssets();
		}

		// External content owner term list & detail page
		if (('edit-tags.php' === $hook || 'term.php' === $hook) && isset($_GET['taxonomy']) && 'ypg_external_content_owner' === $_GET['taxonomy']) {
			$this->enqueueAdminAssets();
		}

		// Edit post page
		if ('edit.php' === $hook && isset($_GET['post_type'])) {
			if (in_array($_GET['post_type'], apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
				$this->enqueueAdminAssets();
			}
		}
	}

	public function manageExternalContentOwnerColumns(array $columns): array
	{
		unset($columns['description']);
		unset($columns['slug']);
		unset($columns['posts']); // 'posts' is the key for the count column

		$orderedColumns = [];
		foreach ($columns as $key => $value) {
			$orderedColumns[$key] = $value;

			if ('name' === $key) {
				$orderedColumns['email'] = __('Email', 'yard-page-guard');
				$orderedColumns['phone_number'] = __('Telefoonnummer', 'yard-page-guard');
			}
		}

		return $orderedColumns;
	}
}
