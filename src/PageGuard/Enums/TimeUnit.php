<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

class TimeUnit
{
	public const DAYS = 'days';
	public const WEEKS = 'weeks';
	public const MONTHS = 'months';

	public static function options(): array
	{
		return [
			self::DAYS => __('Dagen', 'yard-page-guard'),
			self::WEEKS => __('Weken', 'yard-page-guard'),
			self::MONTHS => __('Maanden', 'yard-page-guard'),
		];
	}
}
