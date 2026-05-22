<?php

declare(strict_types=1);

namespace Yard\PageGuard\EmailLog;

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * `ypg_email_log` custom post type backing the admin email overview.
 *
 * Entries are written by {@see EmailLogRecorder} every time the plugin sends a
 * mail. The post type is gated behind {@see AdminCapability::NAME} so it only
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
				'edit_post' => AdminCapability::NAME,
				'read_post' => AdminCapability::NAME,
				'delete_post' => AdminCapability::NAME,
				'edit_posts' => AdminCapability::NAME,
				'edit_others_posts' => AdminCapability::NAME,
				'delete_posts' => AdminCapability::NAME,
				'delete_others_posts' => AdminCapability::NAME,
				'read_private_posts' => AdminCapability::NAME,
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
			'title' => __('Onderwerp', 'yard-page-guard'),
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

			return;
		}

		if ('items' === $column) {
			$items = get_post_meta($postId, self::META_ITEMS, true);
			echo esc_html((string) (is_array($items) ? count($items) : 0));

			return;
		}

		if ('status' === $column) {
			$status = (string) get_post_meta($postId, self::META_STATUS, true);
			$label = self::STATUS_SENT === $status
				? __('Verstuurd', 'yard-page-guard')
				: __('Mislukt', 'yard-page-guard');

			printf(
				'<span class="ypg-status-pill ypg-status-pill--%s">%s</span>',
				esc_attr($status),
				esc_html($label)
			);
		}
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
			'<p><strong>%s:</strong> %s<br><strong>%s:</strong> %s</p>',
			esc_html(__('Ontvanger', 'yard-page-guard')),
			esc_html($recipient),
			esc_html(__('Status', 'yard-page-guard')),
			esc_html(self::STATUS_SENT === $status ? __('Verstuurd', 'yard-page-guard') : __('Mislukt', 'yard-page-guard'))
		);

		if (is_array($items) && [] !== $items) {
			echo '<h4>' . esc_html(__('Items in deze mail', 'yard-page-guard')) . '</h4>';
			echo '<ul class="ypg-email-log-items">';
			foreach ($items as $item) {
				$id = isset($item['id']) ? (int) $item['id'] : 0;
				$title = isset($item['title']) ? (string) $item['title'] : '';
				$reviewDate = isset($item['review_date']) ? (string) $item['review_date'] : '';
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
		echo '<div class="ypg-email-log-preview">' . wp_kses_post($post->post_content) . '</div>';
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
