<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Enums\TimeUnit;

trait Date
{
	public function formatPeriod(int $period, string $unit): string
	{
		switch ($unit) {
			case TimeUnit::WEEKS:
				return sprintf(_n('%d week', '%d weeks', $period, 'yard-page-guard'), $period);
			case TimeUnit::MONTHS:
				return sprintf(_n('%d month', '%d months', $period, 'yard-page-guard'), $period);
			case TimeUnit::DAYS:
			default:
				return sprintf(_n('%d day', '%d days', $period, 'yard-page-guard'), $period);
		}
	}
}
