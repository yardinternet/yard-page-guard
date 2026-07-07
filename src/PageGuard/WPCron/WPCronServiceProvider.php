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

	private const LAST_RUN_OPTION = 'ypg_cron_last_run';

	private const DEFAULT_TIME = '06:00';

	public function register(): void
	{
		// Recorded first so the settings page can show a "last run" even when a
		// notification later in the chain errors out.
		add_action(self::HOOK, [$this, 'recordLastRun']);
		add_action(self::HOOK, [ReviewNotification::class, 'init']);
		add_action(self::HOOK, [ReminderNotification::class, 'init']);

		// Re-align the schedule whenever the admin changes the send time.
		add_action('update_option_' . self::TIME_OPTION, [$this, 'ensureScheduled']);

		$this->ensureScheduled();
	}

	/**
	 * Guarantee a daily event is queued at the configured send time. Reschedules
	 * when nothing is queued, or when the queued run lands on a different clock
	 * moment than `ypg_cron_send_time` (e.g. after the send time changed). An
	 * overdue run already at the right time is left alone so WP-Cron still fires
	 * it on the next request rather than skipping a day.
	 */
	public function ensureScheduled(): void
	{
		$scheduled = wp_next_scheduled(self::HOOK);

		if (false !== $scheduled && wp_date('H:i', $scheduled) === self::sendTime()) {
			return;
		}

		if (false !== $scheduled) {
			wp_unschedule_event($scheduled, self::HOOK);
		}

		wp_schedule_event(self::timeToExecute(), 'daily', self::HOOK);
	}

	public function recordLastRun(): void
	{
		update_option(self::LAST_RUN_OPTION, time());
	}

	/**
	 * Unix timestamp of the last cron execution, or null when it has never run.
	 */
	public static function lastRun(): ?int
	{
		$value = get_option(self::LAST_RUN_OPTION);

		return is_numeric($value) ? (int) $value : null;
	}

	/**
	 * Unix timestamp of the next run, derived from the configured send time so
	 * the value always lands on `ypg_cron_send_time` — even when WP-Cron's own
	 * schedule has drifted or stalled (it only fires on site traffic).
	 */
	public static function nextRun(): int
	{
		return self::timeToExecute();
	}

	/**
	 * The configured send time as a validated `HH:MM` string, falling back to
	 * {@see self::DEFAULT_TIME} when the option is unset or malformed.
	 */
	public static function sendTime(): string
	{
		$raw = (string) get_option(self::TIME_OPTION, self::DEFAULT_TIME);

		return 1 === preg_match('/^\d{2}:\d{2}$/', $raw) ? $raw : self::DEFAULT_TIME;
	}

	/**
	 * Next occurrence of the configured send time (site timezone).
	 */
	public static function timeToExecute(): int
	{
		[$hours, $minutes] = array_map('intval', explode(':', self::sendTime()));

		$now = new DateTime('now', new DateTimeZone(wp_timezone_string()));
		$target = clone $now;
		$target->setTime($hours, $minutes, 0);

		if ($now >= $target) {
			$target->modify('+1 day');
		}

		return $target->getTimestamp();
	}
}
