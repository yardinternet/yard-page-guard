<?php

declare(strict_types=1);

namespace Yard\PageGuard\CronLog;

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * `ypg_cron_log` custom post type backing the admin cron-run overview.
 *
 * Entries are written by {@see CronLogRecorder} every time the daily
 * `ypg_site_cron` run fires, summarising what the run found due and what it
 * sent. Same access model as the email log: gated behind
 * {@see AdminCapability::name()}, read-only, no "Add New".
 */
final class CronLog
{
	public const POST_TYPE = 'ypg_cron_log';

	public const META_EMAILS_ENABLED = '_ypg_emails_enabled';
	public const META_REVIEW_DUE = '_ypg_review_due';
	public const META_REMINDER_DUE = '_ypg_reminder_due';
	public const META_MAILS_SENT = '_ypg_mails_sent';
	public const META_MAILS_FAILED = '_ypg_mails_failed';

	public function register(): void
	{
		add_action('init', [$this, 'registerPostType']);
		add_filter('manage_' . self::POST_TYPE . '_posts_columns', [$this, 'columns']);
		add_action('manage_' . self::POST_TYPE . '_posts_custom_column', [$this, 'renderColumn'], 10, 2);
		add_action('add_meta_boxes_' . self::POST_TYPE, [$this, 'addSummaryMetabox']);

		// Hide row actions that would imply editability.
		add_filter('post_row_actions', [$this, 'filterRowActions'], 10, 2);
	}

	public function registerPostType(): void
	{
		register_post_type(self::POST_TYPE, [
			'labels' => [
				'name' => __('Controle log', 'yard-page-guard'),
				'singular_name' => __('Controle log', 'yard-page-guard'),
				'menu_name' => __('Controle log', 'yard-page-guard'),
				'all_items' => __('Uitgevoerde controles', 'yard-page-guard'),
				'view_item' => __('Bekijk controle', 'yard-page-guard'),
				'search_items' => __('Zoek controles', 'yard-page-guard'),
				'not_found' => __('Geen controles gevonden', 'yard-page-guard'),
				'not_found_in_trash' => __('Geen controles in prullenbak', 'yard-page-guard'),
			],
			'public' => false,
			'show_ui' => true,
			'show_in_menu' => false, // surfaced as submenu under the overview
			'show_in_admin_bar' => false,
			'show_in_rest' => false,
			'supports' => ['title'],
			'capability_type' => 'post',
			'map_meta_cap' => true,
			// Same capability layout as the email log CPT — see the note in
			// EmailLog::registerPostType() for why the singular meta caps stay
			// at their stock defaults.
			'capabilities' => [
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
			'review_due' => __('Toe aan herziening', 'yard-page-guard'),
			'reminder_due' => __('Toe aan herinnering', 'yard-page-guard'),
			'mails' => __('Mails', 'yard-page-guard'),
			'date' => __('Uitgevoerd op', 'yard-page-guard'),
		];
	}

	public function renderColumn(string $column, int $postId): void
	{
		if ('review_due' === $column) {
			echo esc_html((string) $this->itemCount($postId, self::META_REVIEW_DUE));
		} elseif ('reminder_due' === $column) {
			echo esc_html((string) $this->itemCount($postId, self::META_REMINDER_DUE));
		} elseif ('mails' === $column) {
			echo $this->mailsSummaryHtml($postId);
		}
	}

	private function itemCount(int $postId, string $metaKey): int
	{
		$items = get_post_meta($postId, $metaKey, true);

		return is_array($items) ? count($items) : 0;
	}

	/**
	 * "N verstuurd" plus a red "N mislukt" pill when a run had failures, or a
	 * red "uitgeschakeld" pill for runs while mail sending was disabled.
	 */
	private function mailsSummaryHtml(int $postId): string
	{
		if (! $this->emailsWereEnabled($postId)) {
			return sprintf(
				'<span class="ypg-status-pill ypg-status-pill--failed">%s</span>',
				esc_html(__('Uitgeschakeld', 'yard-page-guard'))
			);
		}

		$sent = (int) get_post_meta($postId, self::META_MAILS_SENT, true);
		$failed = (int) get_post_meta($postId, self::META_MAILS_FAILED, true);

		$html = esc_html(sprintf(__('%d verstuurd', 'yard-page-guard'), $sent));

		if (0 < $failed) {
			$html .= sprintf(
				' <span class="ypg-status-pill ypg-status-pill--failed">%s</span>',
				esc_html(sprintf(__('%d mislukt', 'yard-page-guard'), $failed))
			);
		}

		return $html;
	}

	private function emailsWereEnabled(int $postId): bool
	{
		return (bool) get_post_meta($postId, self::META_EMAILS_ENABLED, true);
	}

	public function addSummaryMetabox(): void
	{
		add_meta_box(
			'ypg_cron_log_summary',
			__('Samenvatting', 'yard-page-guard'),
			[$this, 'renderSummaryMetabox'],
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	public function renderSummaryMetabox(\WP_Post $post): void
	{
		$enabled = $this->emailsWereEnabled($post->ID);
		$sent = (int) get_post_meta($post->ID, self::META_MAILS_SENT, true);
		$failed = (int) get_post_meta($post->ID, self::META_MAILS_FAILED, true);

		printf(
			'<p><strong>%s:</strong> %s<br><strong>%s:</strong> <span class="ypg-status-pill ypg-status-pill--%s">%s</span><br><strong>%s:</strong> %s</p>',
			esc_html(__('Uitgevoerd op', 'yard-page-guard')),
			esc_html(get_the_date('d-m-Y H:i', $post)),
			esc_html(__('E-mails versturen', 'yard-page-guard')),
			$enabled ? 'sent' : 'failed',
			esc_html($enabled ? __('Ingeschakeld', 'yard-page-guard') : __('Uitgeschakeld', 'yard-page-guard')),
			esc_html(__('Mails', 'yard-page-guard')),
			esc_html(sprintf(__('%1$d verstuurd, %2$d mislukt', 'yard-page-guard'), $sent, $failed))
		);

		$this->renderItemList(
			$post->ID,
			self::META_REVIEW_DUE,
			__('Toe aan herziening', 'yard-page-guard'),
			__('herziening gepland', 'yard-page-guard')
		);
		$this->renderItemList(
			$post->ID,
			self::META_REMINDER_DUE,
			__('Toe aan herinnering', 'yard-page-guard'),
			__('herinnering gepland', 'yard-page-guard')
		);
	}

	/**
	 * List of items the run found due, each linking to the post with its
	 * scheduled date and the number of reminders it had received when the run
	 * started. Reuses the email log list styling.
	 */
	private function renderItemList(int $postId, string $metaKey, string $heading, string $dateLabel): void
	{
		$items = get_post_meta($postId, $metaKey, true);
		$items = is_array($items) ? $items : [];

		printf('<h4>%s (%d)</h4>', esc_html($heading), count($items));

		if ([] === $items) {
			printf('<p>%s</p>', esc_html(__('Geen items.', 'yard-page-guard')));

			return;
		}

		echo '<ul class="ypg-email-log-items">';
		foreach ($items as $item) {
			$id = (int) ($item['id'] ?? 0);
			$title = (string) ($item['title'] ?? '');
			$date = (string) ($item['date'] ?? '');
			$reminderCount = (int) ($item['reminder_count'] ?? 0);
			$editLink = 0 < $id ? get_edit_post_link($id) : '';

			printf(
				'<li>%s — <span class="ypg-email-log-item-date">%s: %s</span> — %s</li>',
				'' !== $editLink
					? sprintf('<a href="%s">%s</a>', esc_url($editLink), esc_html($title))
					: esc_html($title),
				esc_html($dateLabel),
				esc_html($date),
				esc_html(sprintf(__('herinneringen verstuurd: %d', 'yard-page-guard'), $reminderCount))
			);
		}
		echo '</ul>';
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
