<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Foundation\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorScripts']);

		foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
			add_filter("manage_{$postType}_posts_columns", [$this, 'manageCustomColumns']);
			add_action("manage_{$postType}_posts_custom_column", [$this, 'fillCustomColumns'], 10, 2);
			add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
		}

		add_action('pre_get_posts', [$this, 'sortCustomColumns']);
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

	public function manageCustomColumns(array $columns): array
	{
		$columns['ypg_is_verified'] = __('Gecontroleerd?', 'yard-page-guard');

		return $columns;
	}

	public function fillCustomColumns(string $column, int $postID): void
	{
		if ('ypg_is_verified' !== $column) {
			return;
		}

		$isVerified = get_post_meta($postID, 'ypg_is_verified', true);
		echo '1' === $isVerified ? __('Ja', 'yard-page-guard') : __('Nee', 'yard-page-guard');
	}

	public function makeCustomColumnsSortable(array $columns): array
	{
		$columns['ypg_is_verified'] = 'ypg_is_verified';

		return $columns;
	}

	public function sortCustomColumns(WP_Query $query): void
	{
		if (! is_admin() || ! $query->is_main_query()) {
			return;
		}

		$orderby = $query->get('orderby');
		$order = $query->get('order');

		if ('ypg_is_verified' === $orderby) {
			$query->set('meta_query', [
				'relation' => 'OR',
				[
					'key' => 'ypg_is_verified',
					'compare' => 'EXISTS',
				],
				[
					'key' => 'ypg_is_verified',
					'compare' => 'NOT EXISTS',
				],
			]);
			$query->set('orderby', [
				'meta_value' => $order,
				'date' => 'DESC',
			]);
		}
	}
}
