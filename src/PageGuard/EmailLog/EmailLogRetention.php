<?php

declare(strict_types=1);

namespace Yard\PageGuard\EmailLog;

use WP_Query;

/**
 * Sweeps {@see EmailLog::POST_TYPE} entries older than the retention window so
 * the table doesn't grow unbounded. Runs on the same daily `ypg_site_cron`
 * hook that drives review/reminder mails — adding another schedule for a
 * cheap delete would just be extra moving parts.
 *
 * Retention window is filterable via `yard::page-guard/email-log-retention-days`.
 */
final class EmailLogRetention
{
	public const DEFAULT_RETENTION_DAYS = 60;

	public function register(): void
	{
		add_action('ypg_site_cron', [$this, 'purge']);
	}

	public function purge(): void
	{
		$days = (int) apply_filters(
			'yard::page-guard/email-log-retention-days',
			self::DEFAULT_RETENTION_DAYS
		);

		if (0 >= $days) {
			return;
		}

		$cutoff = gmdate('Y-m-d H:i:s', time() - ($days * DAY_IN_SECONDS));

		$query = new WP_Query([
			'post_type' => EmailLog::POST_TYPE,
			'post_status' => 'any',
			'posts_per_page' => -1,
			'fields' => 'ids',
			'no_found_rows' => true,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
			'date_query' => [[
				'column' => 'post_date_gmt',
				'before' => $cutoff,
				'inclusive' => true,
			]],
		]);

		foreach ($query->posts as $postId) {
			// Force delete — log entries don't belong in the trash, and skipping
			// it avoids a follow-up sweep for trashed-then-expired posts.
			wp_delete_post((int) $postId, true);
		}
	}
}
