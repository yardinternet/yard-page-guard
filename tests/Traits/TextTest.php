<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Traits;

use InvalidArgumentException;
use WP_Mock;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Tests\TestCase;
use Yard\PageGuard\Traits\Text;

class TextTraitSubject
{
	use Text;
}

final class TextTest extends TestCase
{
	private TextTraitSubject $subject;

	protected function setUp(): void
	{
		parent::setUp();
		$this->subject = new TextTraitSubject();

		// __() is used by getUnitOptions(); make it identity-passthrough.
		WP_Mock::userFunction('__')->andReturnUsing(static function ($text) {
			return $text;
		});
	}

	public function testReplacePlaceholdersSubstitutesNumberedTokens(): void
	{
		$result = $this->invokeMethod($this->subject, 'replacePlaceholders', [
			'Hi {1}, you have {2} pages.',
			['Alice', '3'],
		]);

		$this->assertSame('Hi Alice, you have 3 pages.', $result);
	}

	public function testReplacePlaceholdersLeavesUnknownTokensIntact(): void
	{
		$result = $this->invokeMethod($this->subject, 'replacePlaceholders', [
			'Hi {1} and {3}.',
			['Alice'],
		]);

		$this->assertSame('Hi Alice and {3}.', $result);
	}

	public function testMinifyHtmlCollapsesWhitespaceAndTagGaps(): void
	{
		$reflection = new \ReflectionClass(TextTraitSubject::class);
		$method = $reflection->getMethod('minifyHtml');
		if (\PHP_VERSION_ID < 80100) {
			$method->setAccessible(true);
		}

		$result = $method->invoke(null, "<div>\n\t  hello   world\n</div>\n<p>  next  </p>");

		$this->assertSame('<div> hello world </div><p> next </p>', $result);
	}

	public function testGetUnitOptionsListsThreeUnits(): void
	{
		$reflection = new \ReflectionClass(TextTraitSubject::class);
		$method = $reflection->getMethod('getUnitOptions');
		if (\PHP_VERSION_ID < 80100) {
			$method->setAccessible(true);
		}

		$options = $method->invoke(null);

		$this->assertSame(['days', 'weeks', 'months'], array_keys($options));
	}

	public function testParseContentOwnerDataReturnsValidatedContentOwner(): void
	{
		$owner = $this->invokeMethod($this->subject, 'parseContentOwnerData', ['7|Carol|carol@example.com|user|+31612345678']);

		$this->assertSame(7, $owner->id());
		$this->assertSame('Carol', $owner->name());
		$this->assertSame(ContentOwnerType::USER, $owner->type());
		$this->assertSame('+31612345678', $owner->phoneNumber());
	}

	public function testParseContentOwnerDataRejectsMalformedPayload(): void
	{
		$this->expectException(InvalidArgumentException::class);

		$this->invokeMethod($this->subject, 'parseContentOwnerData', ['7|Carol|carol@example.com']);
	}
}
