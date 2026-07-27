<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Admin\Controllers\AdminOverviewController;
use Yard\PageGuard\Admin\Controllers\AdminSettingsController;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Foundation\Plugin;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\Date;

class AdminServiceProvider extends ServiceProvider
{
	use Date;

	private AdminSettingsController $adminSettingsController;
	private AdminOverviewController $adminOverviewController;

	public function __construct(Plugin $plugin)
	{
		parent::__construct($plugin);

		$this->adminSettingsController = new AdminSettingsController();
		$this->adminOverviewController = new AdminOverviewController();
	}

	public function register(): void
	{
		$this->adminSettingsController->init();
		$this->adminOverviewController->init();

		add_action('enqueue_block_editor_assets', [$this, 'enqueueAdminAssets']);

		/**
		 * Enqueue admin scripts where necessary
		 */
		add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssetsPerHook']);

		/**
		 * Add post type overview columns
		 */
		foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
			add_filter("manage_{$postType}_posts_columns", [$this, 'manageCustomColumns']);
			add_action("manage_{$postType}_posts_custom_column", [$this, 'fillCustomColumns'], 10, 2);
			add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
		}

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

		/**
		 * Handle custom column sorting
		 */
		add_action('pre_get_posts', [$this, 'sortCustomColumns']);
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

	public function manageCustomColumns(array $columns): array
	{
		$columns['ypg_post_content_owner'] = __('Eigenaar', 'yard-page-guard');
		$columns['ypg_is_verified'] = __('Status', 'yard-page-guard');
		$columns['ypg_review_date'] = __('Volgende herzieningsdatum', 'yard-page-guard');

		return $columns;
	}

	public function fillCustomColumns(string $column, int $postId): void
	{
		if ('ypg_post_content_owner' === $column) {
			$contentOwner = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, true);

			if (false === $contentOwner || '' === $contentOwner) {
				echo __('Niet ingesteld', 'yard-page-guard');
			} else {
				echo $contentOwner . (get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_TYPE, true) === ContentOwnerType::EXTERNAL ? ' (' . __('Extern', 'yard-page-guard') . ')' : '');
			}
		}

		$reviewDate = get_post_meta($postId, PostMeta::REVIEW_DATE, true);

		if ('ypg_is_verified' === $column) {
			$isVerified = (bool) get_post_meta($postId, PostMeta::IS_VERIFIED, true);
			echo $isVerified ? __('Gecontroleerd', 'yard-page-guard') : ($reviewDate && date('Y-m-d') > $reviewDate ? __('Achterstallig', 'yard-page-guard') : __('N.v.t.', 'yard-page-guard'));
		}

		if ('ypg_review_date' === $column) {
			echo $reviewDate ? "<span class='review-date-wrapper' data-date='$reviewDate'>{$this->formatDate($reviewDate)}</span>" : __('Niet ingesteld', 'yard-page-guard');
		}
	}

	public function makeCustomColumnsSortable(array $columns): array
	{
		$columns['ypg_is_verified'] = PostMeta::IS_VERIFIED;
		$columns['ypg_review_date'] = PostMeta::REVIEW_DATE;

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
					'key' => PostMeta::IS_VERIFIED,
					'compare' => 'EXISTS',
				],
				[
					'key' => PostMeta::IS_VERIFIED,
					'compare' => 'NOT EXISTS',
				],
			]);
			$query->set('orderby', [
				'meta_value' => $order,
				'date' => 'DESC',
			]);
		}

		if ('ypg_review_date' === $orderby) {
			$query->set('meta_query', [
				'relation' => 'OR',
				[
					'key' => PostMeta::REVIEW_DATE,
					'compare' => 'EXISTS',
					'type' => 'DATE',
				],
				[
					'key' => PostMeta::REVIEW_DATE,
					'compare' => 'NOT EXISTS',
					'type' => 'DATE',
				],
			]);
			$query->set('orderby', [
				'meta_value' => $order,
				'date' => 'DESC',
			]);
		}
	}
}
