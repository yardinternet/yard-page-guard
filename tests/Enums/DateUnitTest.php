<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Enums;

use InvalidArgumentException;
use Yard\PageGuard\Enums\DateUnit;
use Yard\PageGuard\Tests\TestCase;

final class DateUnitTest extends TestCase
{
	public function testCasesContainsOnlyKnownValues(): void
	{
		$this->assertSame(['days', 'weeks', 'months'], DateUnit::cases());
	}

	public function testIsValidAcceptsAllCases(): void
	{
		foreach (DateUnit::cases() as $case) {
			$this->assertTrue(DateUnit::isValid($case));
		}
	}

	public function testIsValidRejectsUnknownValues(): void
	{
		$this->assertFalse(DateUnit::isValid('year'));
		$this->assertFalse(DateUnit::isValid('Weeks'));
		$this->assertFalse(DateUnit::isValid(''));
	}

	public function testTryFromReturnsValueForKnownCase(): void
	{
		$this->assertSame('weeks', DateUnit::tryFrom('weeks'));
		$this->assertSame('months', DateUnit::tryFrom('months'));
		$this->assertSame('days', DateUnit::tryFrom('days'));
	}

	public function testTryFromReturnsNullForUnknownCase(): void
	{
		$this->assertNull(DateUnit::tryFrom('year'));
	}

	public function testFromReturnsValueForKnownCase(): void
	{
		$this->assertSame('weeks', DateUnit::from('weeks'));
	}

	public function testFromThrowsForUnknownCase(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/Invalid date unit "year"/');

		DateUnit::from('year');
	}
}
