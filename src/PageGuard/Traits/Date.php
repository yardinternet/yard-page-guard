<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Enums\TimeUnit;
use Yard\PageGuard\Settings\Settings;

trait Date
{
	public function formatPeriod(int $period, string $unit): string
	{
		switch ($unit) {
			case TimeUnit::WEEKS:
				return sprintf(_n('%d week', '%d weken', $period, 'yard-page-guard'), $period);
			case TimeUnit::MONTHS:
				return sprintf(_n('%d maand', '%d maanden', $period, 'yard-page-guard'), $period);
			case TimeUnit::DAYS:
			default:
				return sprintf(_n('%d dag', '%d dagen', $period, 'yard-page-guard'), $period);
		}
	}

	public function defaultReviewDate(): \DateTimeInterface
	{
		$period = get_option(Settings::REVIEW_TIME_PERIOD);
		$unit = get_option(Settings::REVIEW_TIME_UNIT);

		return (new \DateTime('now', wp_timezone()))
			->add(\DateInterval::createFromDateString("{$period} {$unit}"));
	}
}
