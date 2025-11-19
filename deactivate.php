<?php

declare(strict_types=1);

/**
 * Unschedule WP Cron Event(s)
 */
if (! function_exists('ypg_deactivate')) {
	function ypg_deactivate(): void
	{
		$timestamp = wp_next_scheduled('ypg_site_cron');

		if (is_numeric($timestamp)) {
			wp_unschedule_event($timestamp, 'ypg_site_cron');
		}
	}
}
