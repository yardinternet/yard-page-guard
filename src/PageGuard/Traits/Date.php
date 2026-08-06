<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;

trait Date
{
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
