<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Meta;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Meta\MetaFields;
use Yard\PageGuard\Tests\TestCase;

class MetaFieldsTest extends TestCase
{
	protected function setUp(): void
	{
		parent::setUp();

		\WP_Mock::setUp();
		\WP_Mock::userFunction('sanitize_text_field', [
			'return' => fn ($value) => trim(strip_tags((string) $value)),
		]);
	}

	protected function tearDown(): void
	{
		\WP_Mock::tearDown();

		parent::tearDown();
	}

	private function sanitize(string $key, $value)
	{
		return call_user_func(MetaFields::all()[$key]['sanitize_callback'], $value);
	}

	public function testOwnerIdIsAnIntegerSoOwnerLookupsKeepWorking(): void
	{
		$field = MetaFields::all()[PostMeta::POST_CONTENT_OWNER_ID];

		$this->assertSame('integer', $field['type']);
		$this->assertSame('absint', $field['sanitize_callback']);
	}

	public function testOwnerTypeAcceptsOnlyKnownTypes(): void
	{
		$this->assertSame(
			ContentOwnerType::USER,
			$this->sanitize(PostMeta::POST_CONTENT_OWNER_TYPE, ContentOwnerType::USER)
		);
		$this->assertSame(
			ContentOwnerType::EXTERNAL,
			$this->sanitize(PostMeta::POST_CONTENT_OWNER_TYPE, ContentOwnerType::EXTERNAL)
		);
	}

	/**
	 * A composite value like "user:1" must never survive into the owner type meta.
	 */
	public function testOwnerTypeRejectsUnknownValues(): void
	{
		$this->assertSame('', $this->sanitize(PostMeta::POST_CONTENT_OWNER_TYPE, 'user:1'));
		$this->assertSame('', $this->sanitize(PostMeta::POST_CONTENT_OWNER_TYPE, 'term'));
		$this->assertSame('', $this->sanitize(PostMeta::POST_CONTENT_OWNER_TYPE, '<b>term</b>'));
	}

	public function testDateTypeFallsBackToDefaultOnUnknownValues(): void
	{
		$this->assertSame(
			MetaFields::DATE_TYPE_CUSTOM,
			$this->sanitize(PostMeta::REVIEW_DATE_TYPE, 'custom')
		);
		$this->assertSame(
			MetaFields::DATE_TYPE_DEFAULT,
			$this->sanitize(PostMeta::REVIEW_DATE_TYPE, 'opt1')
		);
	}

	public function testTimeUnitRejectsUnknownUnits(): void
	{
		$this->assertSame('months', $this->sanitize(PostMeta::REMINDER_TIME_UNIT, 'months'));
		$this->assertSame('', $this->sanitize(PostMeta::REMINDER_TIME_UNIT, 'decades'));
	}

	public function testReviewDateKeepsValidDatesOnly(): void
	{
		$this->assertSame('2026-08-03', $this->sanitize(PostMeta::REVIEW_DATE, '2026-08-03'));
		$this->assertSame('', $this->sanitize(PostMeta::REVIEW_DATE, ''));
		$this->assertSame('', $this->sanitize(PostMeta::REVIEW_DATE, '03-08-2026'));
		$this->assertSame('', $this->sanitize(PostMeta::REVIEW_DATE, '2026-02-31'));
		$this->assertSame('', $this->sanitize(PostMeta::REVIEW_DATE, 'tomorrow'));
	}

	public function testEveryFieldDeclaresWhatRegistrationNeeds(): void
	{
		foreach (MetaFields::all() as $key => $field) {
			$this->assertArrayHasKey('type', $field, $key);
			$this->assertArrayHasKey('default', $field, $key);
			$this->assertArrayHasKey('sanitize_callback', $field, $key);
			// Either a closure, or the name of a WordPress function that is not loaded here.
			$this->assertTrue(
				is_callable($field['sanitize_callback']) || is_string($field['sanitize_callback']),
				$key
			);
		}
	}

	public function testOwnerValueEncodesTheSameCompositeTheSelectUses(): void
	{
		$this->assertSame('user:12', MetaFields::encodeOwnerValue(12, ContentOwnerType::USER));
		$this->assertSame('external:3', MetaFields::encodeOwnerValue(3, ContentOwnerType::EXTERNAL));
	}

	public function testOwnerValueEncodesNoOwnerAsAnEmptyString(): void
	{
		$this->assertSame('', MetaFields::encodeOwnerValue(0, ContentOwnerType::USER));
		$this->assertSame('', MetaFields::encodeOwnerValue(-1, ContentOwnerType::USER));
		$this->assertSame('', MetaFields::encodeOwnerValue(12, ''));
		$this->assertSame('', MetaFields::encodeOwnerValue(12, 'term'));
	}

	public function testOwnerValueDecodesIntoTheTwoMetaValues(): void
	{
		$this->assertSame(
			['id' => 12, 'type' => ContentOwnerType::USER],
			MetaFields::decodeOwnerValue('user:12')
		);
		$this->assertSame(
			['id' => 3, 'type' => ContentOwnerType::EXTERNAL],
			MetaFields::decodeOwnerValue('external:3')
		);
	}

	/**
	 * @dataProvider provideUnusableOwnerValues
	 *
	 * @param mixed $value
	 */
	public function testOwnerValueDecodesAnythingUnusableAsNoOwner($value): void
	{
		$this->assertSame(['id' => 0, 'type' => ''], MetaFields::decodeOwnerValue($value));
	}

	/**
	 * @return array<string, array<int, mixed>>
	 */
	public static function provideUnusableOwnerValues(): array
	{
		return [
			'empty' => [''],
			'null' => [null],
			'array' => [[]],
			'id only' => ['12'],
			'type only' => ['user'],
			'unknown type' => ['term:12'],
			'zero id' => ['user:0'],
			'non numeric id' => ['user:abc'],
		];
	}

	/**
	 * The classic metabox and the sidebar each split the composite value themselves,
	 * so a round trip must land on the same pair on both sides.
	 */
	public function testOwnerValueRoundTrips(): void
	{
		foreach ([ContentOwnerType::USER, ContentOwnerType::EXTERNAL] as $type) {
			$encoded = MetaFields::encodeOwnerValue(7, $type);

			$this->assertSame(['id' => 7, 'type' => $type], MetaFields::decodeOwnerValue($encoded));
		}
	}
}
