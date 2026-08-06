<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

final class ContentOwnerType
{
	public const USER = 'user';
	public const EXTERNAL = 'external';

	public static function cases(): array
	{
		return [
			self::USER,
			self::EXTERNAL,
		];
	}

	/** @deprecated Use cases() instead */
	public static function isValid(string $value): bool
	{
		return in_array($value, [
			self::USER,
			self::EXTERNAL,
		], true);
	}
}
