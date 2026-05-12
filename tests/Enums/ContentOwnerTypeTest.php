<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Enums;

use InvalidArgumentException;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Tests\TestCase;

final class ContentOwnerTypeTest extends TestCase
{
	public function testCasesContainsOnlyKnownValues(): void
	{
		$this->assertSame(['user', 'external'], ContentOwnerType::cases());
	}

	public function testIsValidAcceptsAllCases(): void
	{
		foreach (ContentOwnerType::cases() as $case) {
			$this->assertTrue(ContentOwnerType::isValid($case));
		}
	}

	public function testIsValidRejectsUnknownValues(): void
	{
		$this->assertFalse(ContentOwnerType::isValid(''));
		$this->assertFalse(ContentOwnerType::isValid('admin'));
		$this->assertFalse(ContentOwnerType::isValid('USER'));
	}

	public function testTryFromReturnsValueForKnownCase(): void
	{
		$this->assertSame('user', ContentOwnerType::tryFrom('user'));
		$this->assertSame('external', ContentOwnerType::tryFrom('external'));
	}

	public function testTryFromReturnsNullForUnknownCase(): void
	{
		$this->assertNull(ContentOwnerType::tryFrom('admin'));
		$this->assertNull(ContentOwnerType::tryFrom(''));
	}

	public function testFromReturnsValueForKnownCase(): void
	{
		$this->assertSame('user', ContentOwnerType::from('user'));
	}

	public function testFromThrowsForUnknownCase(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/Invalid content owner type "admin"/');

		ContentOwnerType::from('admin');
	}
}
