<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

use InvalidArgumentException;

/**
 * The set of time units the metabox / settings UI is allowed to choose from
 * when scheduling review and reminder dates. Mirrors the options offered by
 * {@see \Yard\PageGuard\Traits\Text::getUnitOptions()}.
 */
final class DateUnit
{
	public const DAYS = 'days';
	public const WEEKS = 'weeks';
	public const MONTHS = 'months';

	private function __construct()
	{
	}

	/**
	 * @return string[]
	 */
	public static function cases(): array
	{
		return [self::DAYS, self::WEEKS, self::MONTHS];
	}

	public static function isValid(string $value): bool
	{
		return null !== self::tryFrom($value);
	}

	public static function tryFrom(string $value): ?string
	{
		return in_array($value, self::cases(), true) ? $value : null;
	}

	/**
	 * @throws InvalidArgumentException when $value is not a recognised unit.
	 */
	public static function from(string $value): string
	{
		$resolved = self::tryFrom($value);

		if (null === $resolved) {
			throw new InvalidArgumentException(sprintf(
				'Invalid date unit "%s". Expected one of: %s.',
				$value,
				implode(', ', self::cases())
			));
		}

		return $resolved;
	}
}
