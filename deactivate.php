<?php

declare(strict_types=1);

use Yard\PageGuard\WPCron\WPCronServiceProvider;

/**
 * Unschedule WP Cron Event(s)
 */
if (! function_exists('ypg_deactivate')) {
	function ypg_deactivate(): void
	{
		$timestamp = wp_next_scheduled(WPCronServiceProvider::CRON_HOOK);

		if (is_numeric($timestamp)) {
			wp_unschedule_event($timestamp, WPCronServiceProvider::CRON_HOOK);
		}
	}
}
