<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

use InvalidArgumentException;

final class ContentOwnerType
{
	public const USER = 'user';
	public const EXTERNAL = 'external';

	private function __construct()
	{
	}

	/**
	 * @return string[]
	 */
	public static function cases(): array
	{
		return [self::USER, self::EXTERNAL];
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
	 * @throws InvalidArgumentException when $value is not a recognised content owner type.
	 */
	public static function from(string $value): string
	{
		$resolved = self::tryFrom($value);

		if (null === $resolved) {
			throw new InvalidArgumentException(sprintf(
				'Invalid content owner type "%s". Expected one of: %s.',
				$value,
				implode(', ', self::cases())
			));
		}

		return $resolved;
	}
}
