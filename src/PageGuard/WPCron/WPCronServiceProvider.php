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
	private const HOOK = 'ypg_site_cron';

	private const TIME_OPTION = 'ypg_cron_send_time';

	private const DEFAULT_TIME = '06:00';

	public function register(): void
	{
		add_action(self::HOOK, [ReviewNotification::class, 'init']);
		add_action(self::HOOK, [ReminderNotification::class, 'init']);

		// When the admin changes the send time, drop the existing schedule so the
		// register() call on the next request picks up the new clock moment.
		add_action('update_option_' . self::TIME_OPTION, [$this, 'rescheduleOnTimeChange']);

		if (! wp_next_scheduled(self::HOOK)) {
			wp_schedule_event($this->timeToExecute(), 'daily', self::HOOK);
		}
	}

	public function rescheduleOnTimeChange(): void
	{
		$timestamp = wp_next_scheduled(self::HOOK);
		if (is_numeric($timestamp)) {
			wp_unschedule_event($timestamp, self::HOOK);
		}

		wp_schedule_event($this->timeToExecute(), 'daily', self::HOOK);
	}

	/**
	 * Next occurrence of the configured `ypg_cron_send_time` (HH:MM, site tz).
	 * Falls back to {@see self::DEFAULT_TIME} when the option is unset or malformed.
	 */
	protected function timeToExecute(): int
	{
		$raw = (string) get_option(self::TIME_OPTION, self::DEFAULT_TIME);
		if (! preg_match('/^(\d{2}):(\d{2})$/', $raw, $m)) {
			[, $m[1], $m[2]] = explode(':', self::DEFAULT_TIME, 2);
			$m = ['', (int) explode(':', self::DEFAULT_TIME)[0], (int) explode(':', self::DEFAULT_TIME)[1]];
		}

		$now = new DateTime('now', new DateTimeZone(wp_timezone_string()));
		$target = clone $now;
		$target->setTime((int) $m[1], (int) $m[2], 0);

		if ($now >= $target) {
			$target->modify('+1 day');
		}

		return $target->getTimestamp();
	}
}
