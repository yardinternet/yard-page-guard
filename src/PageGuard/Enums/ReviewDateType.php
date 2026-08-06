<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

class ReviewDateType
{
	public const DEFAULT = 'default';
	public const CUSTOM = 'custom';

	public static function cases(): array
	{
		return [
			self::DEFAULT,
			self::CUSTOM,
		];
	}
}
