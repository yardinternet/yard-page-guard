<?php

declare(strict_types=1);

namespace Yard\PageGuard\EmailLog;

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * `ypg_email_log` custom post type backing the admin email overview.
 *
 * Entries are written by {@see EmailLogRecorder} every time the plugin sends a
 * mail. The post type is gated behind {@see AdminCapability::name()} so it only
 * appears for users who can already access the plugin's admin pages, and
 * "Add New" is disabled because entries are records, not editable content.
 */
final class EmailLog
{
	public const POST_TYPE = 'ypg_email_log';

	public const META_RECIPIENT = '_ypg_recipient';
	public const META_STATUS = '_ypg_status';
	public const META_HEADERS = '_ypg_headers';
	public const META_ITEMS = '_ypg_items';

	public const STATUS_SENT = 'sent';
	public const STATUS_FAILED = 'failed';

	public function register(): void
	{
		add_action('init', [$this, 'registerPostType']);
		add_filter('manage_' . self::POST_TYPE . '_posts_columns', [$this, 'columns']);
		add_action('manage_' . self::POST_TYPE . '_posts_custom_column', [$this, 'renderColumn'], 10, 2);
		add_action('add_meta_boxes_' . self::POST_TYPE, [$this, 'addBodyMetabox']);

		// Status dropdown above the list table + the query that applies it.
		add_action('restrict_manage_posts', [$this, 'renderStatusFilter']);
		add_action('pre_get_posts', [$this, 'filterByStatus']);

		// Hide row actions that would imply editability.
		add_filter('post_row_actions', [$this, 'filterRowActions'], 10, 2);
	}

	public function registerPostType(): void
	{
		register_post_type(self::POST_TYPE, [
			'labels' => [
				'name' => __('Email log', 'yard-page-guard'),
				'singular_name' => __('Email log', 'yard-page-guard'),
				'menu_name' => __('Email log', 'yard-page-guard'),
				'all_items' => __('Verstuurde mails', 'yard-page-guard'),
				'view_item' => __('Bekijk mail', 'yard-page-guard'),
				'search_items' => __('Zoek mails', 'yard-page-guard'),
				'not_found' => __('Geen mails gevonden', 'yard-page-guard'),
				'not_found_in_trash' => __('Geen mails in prullenbak', 'yard-page-guard'),
			],
			'public' => false,
			'show_ui' => true,
			'show_in_menu' => false, // surfaced as submenu under the overview
			'show_in_admin_bar' => false,
			'show_in_rest' => false,
			'supports' => ['title'],
			'capability_type' => 'post',
			'map_meta_cap' => true,
			'capabilities' => [
				// The singular meta caps (edit_post/read_post/delete_post) are
				// deliberately left at their stock defaults. WordPress reverse-
				// registers a post type's meta-cap *values* into the global
				// $post_type_meta_caps map, so pointing them at the shared gate
				// cap would hijack it: a bare current_user_can(gate-cap) — as
				// add_options_page(), add_menu_page() and MetaboxAccess all do —
				// would be rerouted through this post type's per-post meta logic
				// and resolve to 'do_not_allow' (no post in context). Gating only
				// the plural/primitive caps below keeps the gate cap a clean,
				// bare-checkable capability while still restricting this screen.
				'edit_posts' => AdminCapability::name(),
				'edit_others_posts' => AdminCapability::name(),
				'edit_published_posts' => AdminCapability::name(),
				'edit_private_posts' => AdminCapability::name(),
				'read_private_posts' => AdminCapability::name(),
				'delete_posts' => AdminCapability::name(),
				'delete_others_posts' => AdminCapability::name(),
				'delete_published_posts' => AdminCapability::name(),
				'delete_private_posts' => AdminCapability::name(),
				'publish_posts' => 'do_not_allow',
				'create_posts' => 'do_not_allow',
			],
		]);
	}

	/**
	 * @param array<string,string> $columns
	 *
	 * @return array<string,string>
	 */
	public function columns(array $columns): array
	{
		return [
			'cb' => $columns['cb'] ?? '<input type="checkbox" />',
			'title' => __('Titel', 'yard-page-guard'),
			'recipient' => __('Ontvanger', 'yard-page-guard'),
			'items' => __('Items', 'yard-page-guard'),
			'status' => __('Status', 'yard-page-guard'),
			'date' => __('Verstuurd op', 'yard-page-guard'),
		];
	}

	public function renderColumn(string $column, int $postId): void
	{
		if ('recipient' === $column) {
			echo esc_html((string) get_post_meta($postId, self::META_RECIPIENT, true));
		} elseif ('items' === $column) {
			$items = get_post_meta($postId, self::META_ITEMS, true);
			echo esc_html((string) (is_array($items) ? count($items) : 0));
		} elseif ('status' === $column) {
			echo $this->statusPillHtml((string) get_post_meta($postId, self::META_STATUS, true));
		}
	}

	/**
	 * Status pill markup shared by the overview column and the detail metabox so
	 * the `.ypg-status-pill--failed` styling (red) lands in both places.
	 */
	private function statusPillHtml(string $status): string
	{
		$label = self::STATUS_SENT === $status
			? __('Verstuurd', 'yard-page-guard')
			: __('Mislukt', 'yard-page-guard');

		return sprintf(
			'<span class="ypg-status-pill ypg-status-pill--%s">%s</span>',
			esc_attr($status),
			esc_html($label)
		);
	}

	public function addBodyMetabox(): void
	{
		add_meta_box(
			'ypg_email_log_body',
			__('Inhoud', 'yard-page-guard'),
			[$this, 'renderBodyMetabox'],
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	public function renderBodyMetabox(\WP_Post $post): void
	{
		$recipient = (string) get_post_meta($post->ID, self::META_RECIPIENT, true);
		$status = (string) get_post_meta($post->ID, self::META_STATUS, true);
		$items = get_post_meta($post->ID, self::META_ITEMS, true);

		printf(
			'<p><strong>%s:</strong> %s<br><strong>%s:</strong> %s<br><strong>%s:</strong> %s</p>',
			esc_html(__('Ontvanger', 'yard-page-guard')),
			esc_html($recipient),
			esc_html(__('Verstuurd op', 'yard-page-guard')),
			esc_html(get_the_date('d-m-Y', $post)),
			esc_html(__('Status', 'yard-page-guard')),
			$this->statusPillHtml($status)
		);

		if (is_array($items) && [] !== $items) {
			echo '<h4>' . esc_html(__('Items in deze mail', 'yard-page-guard')) . '</h4>';
			echo '<ul class="ypg-email-log-items">';
			foreach ($items as $item) {
				$id = (int) ($item['id'] ?? 0);
				$title = (string) ($item['title'] ?? '');
				$reviewDate = (string) ($item['review_date'] ?? '');
				$editLink = 0 < $id ? get_edit_post_link($id) : '';

				printf(
					'<li>%s%s</li>',
					'' !== $editLink
						? sprintf('<a href="%s">%s</a>', esc_url($editLink), esc_html($title))
						: esc_html($title),
					'' !== $reviewDate ? ' — <span class="ypg-email-log-item-date">' . esc_html($reviewDate) . '</span>' : ''
				);
			}
			echo '</ul>';
		}

		echo '<h4>' . esc_html(__('Mail inhoud', 'yard-page-guard')) . '</h4>';

		// Drop the template's <style> block: wp_kses_post strips the tag but
		// leaks its CSS text into the preview as plain content otherwise.
		$preview = preg_replace('#<style\b[^>]*>.*?</style>#is', '', (string) $post->post_content);
		echo '<div class="ypg-email-log-preview">' . wp_kses_post((string) $preview) . '</div>';
	}

	/**
	 * Render the status dropdown shown above the email log list table.
	 */
	public function renderStatusFilter(string $postType): void
	{
		if (self::POST_TYPE !== $postType) {
			return;
		}

		$current = sanitize_key((string) ($_GET['ypg_status'] ?? ''));

		$options = [
			self::STATUS_SENT => __('Verstuurd', 'yard-page-guard'),
			self::STATUS_FAILED => __('Mislukt', 'yard-page-guard'),
		];

		printf(
			'<select name="ypg_status"><option value="">%s</option>',
			esc_html(__('Alle statussen', 'yard-page-guard'))
		);

		foreach ($options as $value => $label) {
			printf(
				'<option value="%s"%s>%s</option>',
				esc_attr($value),
				selected($current, $value, false),
				esc_html($label)
			);
		}

		echo '</select>';
	}

	/**
	 * Constrain the list table to the selected status via the `_ypg_status` meta.
	 */
	public function filterByStatus(\WP_Query $query): void
	{
		if (! is_admin() || ! $query->is_main_query() || self::POST_TYPE !== $query->get('post_type')) {
			return;
		}

		$status = sanitize_key((string) ($_GET['ypg_status'] ?? ''));

		if (! in_array($status, [self::STATUS_SENT, self::STATUS_FAILED], true)) {
			return;
		}

		$query->set('meta_query', [
			[
				'key' => self::META_STATUS,
				'value' => $status,
				'compare' => '=',
			],
		]);
	}

	/**
	 * @param array<string,string> $actions
	 *
	 * @return array<string,string>
	 */
	public function filterRowActions(array $actions, \WP_Post $post): array
	{
		if (self::POST_TYPE !== $post->post_type) {
			return $actions;
		}

		unset($actions['inline hide-if-no-js'], $actions['edit']);

		// Replace "Edit" link with a "View" label since the screen is read-only.
		if (current_user_can('edit_post', $post->ID)) {
			$actions = ['view' => sprintf(
				'<a href="%s">%s</a>',
				esc_url(get_edit_post_link($post->ID)),
				esc_html__('Bekijken', 'yard-page-guard')
			)] + $actions;
		}

		return $actions;
	}
}
