<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Traits;

use RuntimeException;
use WP_Mock;
use Yard\PageGuard\Tests\TestCase;
use Yard\PageGuard\Traits\Token;

class TokenTraitSubject
{
	use Token;
}

final class TokenTest extends TestCase
{
	private TokenTraitSubject $subject;

	protected function setUp(): void
	{
		parent::setUp();
		$this->subject = new TokenTraitSubject();

		$_GET = [];
		$_ENV['YPG_AUTH_SALT'] = 'unit-test-salt';

		WP_Mock::userFunction('sanitize_text_field')->andReturnUsing(static function ($value) {
			return is_string($value) ? trim($value) : '';
		});
	}

	protected function tearDown(): void
	{
		unset($_ENV['YPG_AUTH_SALT']);
		parent::tearDown();
	}

	public function testGenerateReviewTokenIsDeterministic(): void
	{
		$token1 = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');
		$token2 = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');

		$this->assertSame($token1, $token2);
	}

	public function testGenerateReviewTokenIsCaseInsensitive(): void
	{
		$lower = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');
		$upper = $this->subject->generateReviewToken(7, 'CAROL@EXAMPLE.COM', '2024-12-01');

		$this->assertSame($lower, $upper);
	}

	public function testGenerateReviewTokenIsUrlSafe(): void
	{
		$token = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');

		$this->assertMatchesRegularExpression('/^[A-Za-z0-9_\-]+$/', $token);
		$this->assertStringNotContainsString('=', $token);
	}

	public function testGenerateReviewTokenChangesWithAnyInput(): void
	{
		$base = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');

		$this->assertNotSame($base, $this->subject->generateReviewToken(8, 'carol@example.com', '2024-12-01'));
		$this->assertNotSame($base, $this->subject->generateReviewToken(7, 'dave@example.com', '2024-12-01'));
		$this->assertNotSame($base, $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-02'));
	}

	public function testGenerateReviewTokenRejectsMissingEmail(): void
	{
		$this->expectException(RuntimeException::class);
		$this->expectExceptionMessageMatches('/Missing review token parameter/');

		$this->subject->generateReviewToken(7, '', '2024-12-01');
	}

	public function testGenerateReviewTokenRejectsMissingReviewDate(): void
	{
		$this->expectException(RuntimeException::class);

		$this->subject->generateReviewToken(7, 'carol@example.com', '');
	}

	public function testGenerateReviewTokenRejectsMissingSalt(): void
	{
		unset($_ENV['YPG_AUTH_SALT']);

		$this->expectException(RuntimeException::class);
		$this->expectExceptionMessageMatches('/salt/');

		$this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');
	}

	public function testVerifyReviewTokenAcceptsMatchingToken(): void
	{
		$token = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');

		$this->assertTrue($this->subject->verifyReviewToken(7, 'carol@example.com', '2024-12-01', $token));
	}

	public function testVerifyReviewTokenRejectsTamperedToken(): void
	{
		$token = $this->subject->generateReviewToken(7, 'carol@example.com', '2024-12-01');

		$this->assertFalse($this->subject->verifyReviewToken(7, 'carol@example.com', '2024-12-01', $token . 'x'));
		$this->assertFalse($this->subject->verifyReviewToken(8, 'carol@example.com', '2024-12-01', $token));
	}

	public function testReadReviewTokenFromQueryRequiresIsset(): void
	{
		$this->assertNull($this->invokeMethod($this->subject, 'readReviewTokenFromQuery'));
	}

	public function testReadReviewTokenFromQueryRejectsEmptyString(): void
	{
		$_GET['ypg_review_token'] = '   ';

		$this->assertNull($this->invokeMethod($this->subject, 'readReviewTokenFromQuery'));
	}

	public function testReadReviewTokenFromQueryReturnsSanitisedToken(): void
	{
		$_GET['ypg_review_token'] = ' abc123 ';

		$this->assertSame('abc123', $this->invokeMethod($this->subject, 'readReviewTokenFromQuery'));
	}

	public function testReadReviewTokenFromQueryRejectsNonString(): void
	{
		$_GET['ypg_review_token'] = ['nested' => 'array'];

		$this->assertNull($this->invokeMethod($this->subject, 'readReviewTokenFromQuery'));
	}

	public function testReadExternalSourceFromQueryAcceptsWhitelistedValues(): void
	{
		$_GET['external'] = 'pdc';
		$this->assertSame('pdc', $this->invokeMethod($this->subject, 'readExternalSourceFromQuery'));

		$_GET['external'] = 'pub';
		$this->assertSame('pub', $this->invokeMethod($this->subject, 'readExternalSourceFromQuery'));
	}

	public function testReadExternalSourceFromQueryRejectsUnknownSources(): void
	{
		$_GET['external'] = 'other';
		$this->assertNull($this->invokeMethod($this->subject, 'readExternalSourceFromQuery'));
	}

	public function testReadExternalSourceFromQueryReturnsNullWhenMissing(): void
	{
		$this->assertNull($this->invokeMethod($this->subject, 'readExternalSourceFromQuery'));
	}

	public function testReadPostIdFromQueryReturnsPositiveInt(): void
	{
		$_GET['post_id'] = '42';
		$this->assertSame(42, $this->invokeMethod($this->subject, 'readPostIdFromQuery'));
	}

	public function testReadPostIdFromQueryRejectsNonNumeric(): void
	{
		$_GET['post_id'] = 'abc';
		$this->assertNull($this->invokeMethod($this->subject, 'readPostIdFromQuery'));
	}

	public function testReadPostIdFromQueryRejectsZero(): void
	{
		$_GET['post_id'] = '0';
		$this->assertNull($this->invokeMethod($this->subject, 'readPostIdFromQuery'));
	}

	public function testReadPostIdFromQueryReturnsNullWhenMissing(): void
	{
		$this->assertNull($this->invokeMethod($this->subject, 'readPostIdFromQuery'));
	}
}
