<?php

namespace Yard\PageGuard\Admin;

use Yard\PageGuard\Foundation\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorScripts']);
	}

	public function enqueueEditorScripts(): void
	{
		$path = $this->plugin->resourcePath('editor.asset.php');
		$scriptAsset = file_exists($path) ? require $path : ['dependencies' => [], 'version' => round(microtime(true))];

		wp_enqueue_style(
			'ypg-editor-styles',
			$this->plugin->resourceUrl('style-editor.css'),
			[],
			$scriptAsset['version']
		);
	}
}
