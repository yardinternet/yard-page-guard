<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Meta;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Meta\MetaFields;
use Yard\PageGuard\Meta\ReviewScheduler;
use Yard\PageGuard\Tests\TestCase;

class ReviewSchedulerTest extends TestCase
{
	private const POST_ID = 42;
	private const TODAY = '2026-08-04';

	/** @var array<string, mixed> */
	private array $meta = [];

	/** @var array<string, mixed> */
	private array $options = [];

	private ReviewScheduler $scheduler;

	protected function setUp(): void
	{
		parent::setUp();

		\WP_Mock::setUp();

		$this->meta = [
			PostMeta::POST_CONTENT_OWNER_ID => 7,
			PostMeta::POST_CONTENT_OWNER_TYPE => ContentOwnerType::USER,
		];

		$this->options = [
			Options::REVIEW_TIME_PERIOD => 1,
			Options::REVIEW_TIME_UNIT => 'weeks',
			Options::REMINDER_TIME_PERIOD => 2,
			Options::REMINDER_TIME_UNIT => 'days',
		];

		\WP_Mock::userFunction('wp_timezone_string', ['return' => 'Europe/Amsterdam']);
		\WP_Mock::userFunction('current_time', ['return' => self::TODAY]);
		\WP_Mock::userFunction('do_action', ['return' => null]);
		\WP_Mock::userFunction('sanitize_text_field', [
			'return' => fn ($value) => trim(strip_tags((string) $value)),
		]);

		\WP_Mock::userFunction('get_option', [
			'return' => fn ($name, $default = false) => $this->options[$name] ?? $default,
		]);

		\WP_Mock::userFunction('get_post_meta', [
			'return' => fn ($postId, $key, $single = false) => $this->meta[$key] ?? '',
		]);

		\WP_Mock::userFunction('update_post_meta', [
			'return' => function ($postId, $key, $value) {
				$this->meta[$key] = $value;

				return true;
			},
		]);

		\WP_Mock::userFunction('delete_post_meta', [
			'return' => function ($postId, $key) {
				unset($this->meta[$key]);

				return true;
			},
		]);

		$this->scheduler = new ReviewScheduler();
	}

	protected function tearDown(): void
	{
		\WP_Mock::tearDown();

		parent::tearDown();
	}

	public function testWithoutAnOwnerTheReviewMetaIsCleared(): void
	{
		$this->meta[PostMeta::POST_CONTENT_OWNER_ID] = 0;
		$this->meta[PostMeta::REVIEW_DATE] = '2026-09-01';
		$this->meta[PostMeta::REMINDER_DATE] = '2026-09-08';
		$this->meta[PostMeta::LAST_REVIEW_DATE] = '2026-07-01';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertArrayNotHasKey(PostMeta::REVIEW_DATE, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_DATE, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::LAST_REVIEW_DATE, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::POST_CONTENT_OWNER_TYPE, $this->meta);
	}

	public function testDefaultTypeResolvesTheReviewDateFromTheSiteOptions(): void
	{
		$this->meta[PostMeta::REVIEW_DATE_TYPE] = MetaFields::DATE_TYPE_DEFAULT;
		$this->meta[PostMeta::REVIEW_DATE] = '';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame('2026-08-11', $this->meta[PostMeta::REVIEW_DATE]);
	}

	/**
	 * Saving a page must not push the review date forward on every save.
	 */
	public function testDefaultTypeKeepsAnAlreadyResolvedReviewDate(): void
	{
		$this->meta[PostMeta::REVIEW_DATE_TYPE] = MetaFields::DATE_TYPE_DEFAULT;
		$this->meta[PostMeta::REVIEW_DATE] = '2026-10-01';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame('2026-10-01', $this->meta[PostMeta::REVIEW_DATE]);
	}

	public function testCustomTypePreservesTheChosenDate(): void
	{
		$this->meta[PostMeta::REVIEW_DATE_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REVIEW_DATE] = '2026-12-24';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame('2026-12-24', $this->meta[PostMeta::REVIEW_DATE]);
		$this->assertSame(MetaFields::DATE_TYPE_CUSTOM, $this->meta[PostMeta::REVIEW_DATE_TYPE]);
	}

	public function testCustomTypeWithoutADateFallsBackToTheSiteDefault(): void
	{
		$this->meta[PostMeta::REVIEW_DATE_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REVIEW_DATE] = '';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame(MetaFields::DATE_TYPE_DEFAULT, $this->meta[PostMeta::REVIEW_DATE_TYPE]);
		$this->assertSame('2026-08-11', $this->meta[PostMeta::REVIEW_DATE]);
	}

	public function testAUsableReminderOverrideIsKept(): void
	{
		$this->meta[PostMeta::REMINDER_TIME_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REMINDER_TIME_PERIOD] = 3;
		$this->meta[PostMeta::REMINDER_TIME_UNIT] = 'weeks';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame(MetaFields::DATE_TYPE_CUSTOM, $this->meta[PostMeta::REMINDER_TIME_TYPE]);
		$this->assertSame(3, $this->meta[PostMeta::REMINDER_TIME_PERIOD]);
		$this->assertSame('weeks', $this->meta[PostMeta::REMINDER_TIME_UNIT]);
	}

	/**
	 * A per-field schema cannot express "custom implies a period of at least one",
	 * so the scheduler drops the override and lets the site options apply.
	 */
	public function testAReminderOverrideOfZeroFallsBackToTheSiteDefault(): void
	{
		$this->meta[PostMeta::REMINDER_TIME_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REMINDER_TIME_PERIOD] = 0;
		$this->meta[PostMeta::REMINDER_TIME_UNIT] = 'weeks';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame(MetaFields::DATE_TYPE_DEFAULT, $this->meta[PostMeta::REMINDER_TIME_TYPE]);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_TIME_PERIOD, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_TIME_UNIT, $this->meta);
	}

	public function testAReminderOverrideWithoutAUnitFallsBackToTheSiteDefault(): void
	{
		$this->meta[PostMeta::REMINDER_TIME_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REMINDER_TIME_PERIOD] = 3;
		$this->meta[PostMeta::REMINDER_TIME_UNIT] = '';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertSame(MetaFields::DATE_TYPE_DEFAULT, $this->meta[PostMeta::REMINDER_TIME_TYPE]);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_TIME_PERIOD, $this->meta);
	}

	public function testDefaultReminderTypeDropsAnyLeftoverOverride(): void
	{
		$this->meta[PostMeta::REMINDER_TIME_TYPE] = MetaFields::DATE_TYPE_DEFAULT;
		$this->meta[PostMeta::REMINDER_TIME_PERIOD] = 9;
		$this->meta[PostMeta::REMINDER_TIME_UNIT] = 'months';

		$this->scheduler->syncForPost(self::POST_ID);

		$this->assertArrayNotHasKey(PostMeta::REMINDER_TIME_PERIOD, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_TIME_UNIT, $this->meta);
	}

	public function testMarkReviewedRecordsTodayAndStartsTheNextCycle(): void
	{
		$this->meta[PostMeta::REVIEW_DATE] = '2026-08-01';
		$this->meta[PostMeta::REVIEW_MAIL_SENT] = '1';
		$this->meta[PostMeta::LAST_REMINDER_DATE] = '2026-08-02';
		$this->meta[PostMeta::REMINDER_DATE] = '2026-08-03';

		$this->scheduler->markReviewed(self::POST_ID);

		$this->assertSame(self::TODAY, $this->meta[PostMeta::LAST_REVIEW_DATE]);
		$this->assertSame('2026-08-11', $this->meta[PostMeta::REVIEW_DATE]);
		$this->assertSame('1', $this->meta[PostMeta::IS_VERIFIED]);
		$this->assertArrayNotHasKey(PostMeta::REVIEW_MAIL_SENT, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::LAST_REMINDER_DATE, $this->meta);
		$this->assertArrayNotHasKey(PostMeta::REMINDER_DATE, $this->meta);
	}

	/**
	 * "Kies eenmalig een afwijkende datum" is a one-off, so a completed review hands
	 * the next cycle back to the site default.
	 */
	public function testMarkReviewedReturnsACustomDateToTheSiteDefault(): void
	{
		$this->meta[PostMeta::REVIEW_DATE_TYPE] = MetaFields::DATE_TYPE_CUSTOM;
		$this->meta[PostMeta::REVIEW_DATE] = '2026-12-24';

		$this->scheduler->markReviewed(self::POST_ID);

		$this->assertSame(MetaFields::DATE_TYPE_DEFAULT, $this->meta[PostMeta::REVIEW_DATE_TYPE]);
		$this->assertSame('2026-08-11', $this->meta[PostMeta::REVIEW_DATE]);
	}
}
