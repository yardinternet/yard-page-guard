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
}
