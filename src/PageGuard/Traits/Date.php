<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;

trait Date
{

	public function formatPeriod(int $period, string $unit): string
	{
		if ('weeks' === $unit) {
			return sprintf(_n('%d week', '%d weken', $period, 'yard-page-guard'), $period);
		}

		if ('months' === $unit) {
			return sprintf(_n('%d maand', '%d maanden', $period, 'yard-page-guard'), $period);
		}

		return sprintf(_n('%d dag', '%d dagen', $period, 'yard-page-guard'), $period);
	}

	/**
	 * Adds a date period to a base date (provided as Y-m-d string)
	 */
	public function addPeriodToBase(string $base, int $period, string $unit): string
	{
		$date = new DateTime($base, new DateTimeZone(wp_timezone_string()));

		if ('weeks' === $unit) {
			$date->modify("+{$period} weeks");
		} elseif ('months' === $unit) {
			$date->modify("+{$period} months");
		} else {
			$date->modify("+{$period} days");
		}

		return $date->format('Y-m-d');
	}
}
