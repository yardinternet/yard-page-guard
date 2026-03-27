<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPCron;

use DateTime;
use DateTimeZone;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\WPCron\Events\ReminderNotification;
use Yard\PageGuard\WPCron\Events\ReviewNotification;

class WPCronServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		add_action('ypg_site_cron', [ReviewNotification::class, 'init']);
		add_action('ypg_site_cron', [ReminderNotification::class, 'init']);

		if (! wp_next_scheduled('ypg_site_cron')) {
			wp_schedule_event($this->timeToExecute(), 'daily', 'ypg_site_cron');
		}
	}

	/**
	 * Notifications will be sent at 6am on the next day.
	 */
	protected function timeToExecute(): int
	{
		$now = new DateTime('now', new DateTimeZone(wp_timezone_string()));
		$target = clone $now;
		$target->setTime(6, 0, 0);

		// If 6am today has already passed, move to tomorrow
		if ($now >= $target) {
			$target->modify('+1 day');
		}

		return $target->getTimestamp();
	}
}
