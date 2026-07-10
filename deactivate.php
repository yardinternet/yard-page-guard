<?php

declare(strict_types=1);

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * Unschedule WP Cron Event(s) and strip the plugin's admin capability from the
 * roles it was granted to.
 */
if (! function_exists('ypg_deactivate')) {
	function ypg_deactivate(): void
	{
		$timestamp = wp_next_scheduled('ypg_site_cron');

		if (is_numeric($timestamp)) {
			wp_unschedule_event($timestamp, 'ypg_site_cron');
		}

		AdminCapability::removeFromRoles();
	}
}
