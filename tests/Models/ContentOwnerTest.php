<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Models;

use InvalidArgumentException;
use WP_Mock;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Tests\TestCase;

final class ContentOwnerTest extends TestCase
{
	public function testConstructorAcceptsValidPayload(): void
	{
		$owner = new ContentOwner(42, 'Alice Anderson', 'alice@example.com', ContentOwnerType::USER, '+31612345678');

		$this->assertSame(42, $owner->id());
		$this->assertSame('Alice Anderson', $owner->name());
		$this->assertSame('alice@example.com', $owner->email());
		$this->assertSame(ContentOwnerType::USER, $owner->type());
		$this->assertSame('+31612345678', $owner->phoneNumber());
	}

	public function testConstructorTrimsStringFields(): void
	{
		$owner = new ContentOwner(1, '  Bob  ', '  bob@example.com  ', ContentOwnerType::EXTERNAL, '  +31 6 1234  ');

		$this->assertSame('Bob', $owner->name());
		$this->assertSame('bob@example.com', $owner->email());
		$this->assertSame('+31 6 1234', $owner->phoneNumber());
	}

	public function testConstructorDefaultsPhoneToEmptyString(): void
	{
		$owner = new ContentOwner(1, 'Bob', 'bob@example.com', ContentOwnerType::USER);

		$this->assertSame('', $owner->phoneNumber());
	}

	public function testConstructorRejectsZeroId(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/id must be positive/');

		new ContentOwner(0, 'Bob', 'bob@example.com', ContentOwnerType::USER);
	}

	public function testConstructorRejectsNegativeId(): void
	{
		$this->expectException(InvalidArgumentException::class);

		new ContentOwner(-1, 'Bob', 'bob@example.com', ContentOwnerType::USER);
	}

	public function testConstructorRejectsEmptyName(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/name must not be empty/');

		new ContentOwner(1, '   ', 'bob@example.com', ContentOwnerType::USER);
	}

	public function testConstructorRejectsEmptyEmail(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/email must not be empty/');

		new ContentOwner(1, 'Bob', '', ContentOwnerType::USER);
	}

	public function testConstructorRejectsUnknownType(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/Invalid content owner type/');

		new ContentOwner(1, 'Bob', 'bob@example.com', 'admin');
	}

	public function testIsUserAndIsExternalReflectType(): void
	{
		$user = new ContentOwner(1, 'Bob', 'bob@example.com', ContentOwnerType::USER);
		$ext = new ContentOwner(1, 'Bob', 'bob@example.com', ContentOwnerType::EXTERNAL);

		$this->assertTrue($user->isUser());
		$this->assertFalse($user->isExternal());

		$this->assertTrue($ext->isExternal());
		$this->assertFalse($ext->isUser());
	}

	public function testFirstNameReturnsFirstSpaceSeparatedPart(): void
	{
		$owner = new ContentOwner(1, 'Alice Margaret Anderson', 'a@example.com', ContentOwnerType::USER);

		$this->assertSame('Alice', $owner->firstName());
	}

	public function testSalutationCapitalisesNameParts(): void
	{
		$owner = new ContentOwner(1, 'alice anderson', 'a@example.com', ContentOwnerType::USER);

		$this->assertSame('Alice', $owner->salutation());
	}

	public function testSalutationFallsBackToFullNameWhenFirstNameMissing(): void
	{
		// firstName() returns '' when explode yields no parts. With explode(' ', 'x')
		// you always get at least one item, so this primarily exercises the ucfirst path.
		$owner = new ContentOwner(1, 'alice', 'a@example.com', ContentOwnerType::USER);

		$this->assertSame('Alice', $owner->salutation());
	}

	public function testFromStringParsesFiveFieldPayload(): void
	{
		$owner = ContentOwner::fromString('7|Carol|carol@example.com|user|+31612345678');

		$this->assertSame(7, $owner->id());
		$this->assertSame('Carol', $owner->name());
		$this->assertSame('carol@example.com', $owner->email());
		$this->assertSame(ContentOwnerType::USER, $owner->type());
		$this->assertSame('+31612345678', $owner->phoneNumber());
	}

	public function testFromStringParsesFourFieldPayloadAndDefaultsPhone(): void
	{
		$owner = ContentOwner::fromString('7|Carol|carol@example.com|external');

		$this->assertSame('', $owner->phoneNumber());
		$this->assertSame(ContentOwnerType::EXTERNAL, $owner->type());
	}

	public function testFromStringRejectsTooFewFields(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessageMatches('/Invalid content owner data format/');

		ContentOwner::fromString('7|Carol|carol@example.com');
	}

	public function testFromStringPropagatesValidationErrors(): void
	{
		$this->expectException(InvalidArgumentException::class);

		ContentOwner::fromString('0|Carol|carol@example.com|user');
	}

	public function testFromPostMetaReturnsNullWhenIdMissing(): void
	{
		$postId = 123;
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_name', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_email', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_phone_number', true)
			->andReturn('');

		$this->assertNull(ContentOwner::fromPostMeta($postId));
	}

	public function testFromPostMetaReturnsNullWhenStoredValuesInvalid(): void
	{
		$postId = 123;
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_name', true)
			->andReturn('Carol');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_email', true)
			->andReturn('carol@example.com');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn('admin'); // invalid type
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_phone_number', true)
			->andReturn('');

		$this->assertNull(ContentOwner::fromPostMeta($postId));
	}

	public function testFromPostMetaReconstructsValidOwner(): void
	{
		$postId = 123;
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_name', true)
			->andReturn('Carol');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_email', true)
			->andReturn('carol@example.com');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::EXTERNAL);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_phone_number', true)
			->andReturn('+31612345678');

		$owner = ContentOwner::fromPostMeta($postId);

		$this->assertNotNull($owner);
		$this->assertSame(5, $owner->id());
		$this->assertSame('Carol', $owner->name());
		$this->assertSame('carol@example.com', $owner->email());
		$this->assertSame(ContentOwnerType::EXTERNAL, $owner->type());
		$this->assertSame('+31612345678', $owner->phoneNumber());
	}
}
