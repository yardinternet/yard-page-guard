<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Traits;

use InvalidArgumentException;
use WP_Mock;
use Yard\PageGuard\Enums\DateUnit;
use Yard\PageGuard\Tests\TestCase;
use Yard\PageGuard\Traits\Date;

/**
 * Fixture exposing the trait under test so reflection-based helpers
 * can invoke its private/protected methods directly.
 */
class DateTraitSubject
{
	use Date;
}

final class DateTest extends TestCase
{
	private DateTraitSubject $subject;

	protected function setUp(): void
	{
		parent::setUp();
		$this->subject = new DateTraitSubject();

		$_POST = [];

		WP_Mock::userFunction('wp_timezone_string')->andReturn('UTC');
		WP_Mock::userFunction('sanitize_text_field')->andReturnUsing(static function ($value) {
			return is_string($value) ? trim($value) : '';
		});
	}

	public function testIsValidDateAcceptsCanonicalYmd(): void
	{
		$this->assertTrue($this->subject->isValidDate('2024-12-01'));
	}

	public function testIsValidDateRejectsWrongFormat(): void
	{
		$this->assertFalse($this->subject->isValidDate('01-12-2024'));
		$this->assertFalse($this->subject->isValidDate('2024/12/01'));
		$this->assertFalse($this->subject->isValidDate(''));
	}

	public function testIsValidDateRejectsImpossibleDate(): void
	{
		$this->assertFalse($this->subject->isValidDate('2024-02-30'));
	}

	public function testFormatDateUsesWordPressLocalisation(): void
	{
		WP_Mock::userFunction('date_i18n')
			->andReturnUsing(static function (string $format, int $timestamp): string {
				return date($format, $timestamp);
			});

		$this->assertSame('01 December 2024', $this->subject->formatDate('2024-12-01'));
	}

	public function testFormatDateReturnsEmptyStringOnInvalidInput(): void
	{
		// date_i18n should never be called when DateTime construction throws.
		$this->assertSame('', $this->subject->formatDate('not-a-date'));
	}

	public function testAddPeriodToBaseAddsDays(): void
	{
		$this->assertSame('2024-12-04', $this->subject->addPeriodToBase('2024-12-01', 3, DateUnit::DAYS));
	}

	public function testAddPeriodToBaseAddsWeeks(): void
	{
		$this->assertSame('2024-12-15', $this->subject->addPeriodToBase('2024-12-01', 2, DateUnit::WEEKS));
	}

	public function testAddPeriodToBaseAddsMonths(): void
	{
		$this->assertSame('2025-03-01', $this->subject->addPeriodToBase('2024-12-01', 3, DateUnit::MONTHS));
	}

	public function testAddPeriodToBaseRejectsUnknownUnit(): void
	{
		$this->expectException(InvalidArgumentException::class);
		$this->subject->addPeriodToBase('2024-12-01', 1, 'year');
	}

	public function testAdvanceToFutureStepsOnceWhenDueToday(): void
	{
		$today = date('Y-m-d');
		$expected = date('Y-m-d', strtotime('+1 week', strtotime($today)));

		$this->assertSame($expected, $this->subject->advanceToFuture($today, 1, DateUnit::WEEKS));
	}

	public function testAdvanceToFutureCollapsesMissedPeriodsIntoOneJump(): void
	{
		// Three weekly periods overdue collapses to the single next slot, not
		// three separate advances.
		$base = date('Y-m-d', strtotime('-3 weeks'));
		$expected = date('Y-m-d', strtotime('+1 week'));

		$this->assertSame($expected, $this->subject->advanceToFuture($base, 1, DateUnit::WEEKS));
	}

	public function testAdvanceToFutureLeavesAFutureDateUnchanged(): void
	{
		// Re-running on an already-advanced date is a no-op: this is what keeps
		// repeated same-day cron runs idempotent.
		$future = date('Y-m-d', strtotime('+2 weeks'));

		$this->assertSame($future, $this->subject->advanceToFuture($future, 1, DateUnit::WEEKS));
	}

	public function testAdvanceToFutureClampsNonPositivePeriod(): void
	{
		$today = date('Y-m-d');
		$expected = date('Y-m-d', strtotime('+1 day', strtotime($today)));

		$this->assertSame($expected, $this->subject->advanceToFuture($today, 0, DateUnit::DAYS));
	}

	public function testComputeDateMetaPrefersManualOverride(): void
	{
		$_POST = ['ypg_review_date' => '2025-01-15'];

		$result = $this->subject->computeDateMeta(
			'ypg_review_date',
			'2024-12-01',
			true,
			true,
			1,
			DateUnit::WEEKS
		);

		$this->assertSame('2025-01-15', $result);
	}

	public function testComputeDateMetaIgnoresOverrideEqualToCurrent(): void
	{
		$_POST = ['ypg_review_date' => '2024-12-01'];

		$result = $this->subject->computeDateMeta(
			'ypg_review_date',
			'2024-12-01',
			true,
			true,
			1,
			DateUnit::WEEKS
		);

		// No just-verified transition and value exists → keep current.
		$this->assertSame('2024-12-01', $result);
	}

	public function testComputeDateMetaKeepsCurrentWhenNotVerified(): void
	{
		$result = $this->subject->computeDateMeta(
			'ypg_review_date',
			'2024-12-01',
			false,
			false,
			1,
			DateUnit::WEEKS
		);

		$this->assertSame('2024-12-01', $result);
	}

	public function testComputeDateMetaRecomputesWhenJustVerified(): void
	{
		$result = $this->subject->computeDateMeta(
			'ypg_review_date',
			'2024-12-01',
			true,
			false,
			2,
			DateUnit::WEEKS
		);

		// Just-verified: add 2 weeks to current value.
		$this->assertSame('2024-12-15', $result);
	}

	public function testComputeDateMetaPrioritisesBaseAdditionDateWhenRecomputing(): void
	{
		$result = $this->subject->computeDateMeta(
			'ypg_reminder_date',
			'2024-12-01',
			true,
			false,
			1,
			DateUnit::WEEKS,
			'2025-01-01'
		);

		// Just-verified: base addition date wins over current value.
		$this->assertSame('2025-01-08', $result);
	}

	public function testComputeDateMetaFallsBackToTodayWhenNothingStored(): void
	{
		$today = date('Y-m-d');
		$expected = date('Y-m-d', strtotime('+1 week', strtotime($today)));

		$result = $this->subject->computeDateMeta(
			'ypg_review_date',
			null,
			true,
			false,
			1,
			DateUnit::WEEKS
		);

		$this->assertSame($expected, $result);
	}

	public function testComputeReviewDateUsesSiteOptions(): void
	{
		WP_Mock::userFunction('get_option')
			->with('ypg_review_time_period', 1)
			->andReturn(2);
		WP_Mock::userFunction('get_option')
			->with('ypg_review_time_unit', DateUnit::WEEKS)
			->andReturn(DateUnit::MONTHS);

		$today = date('Y-m-d');
		$expected = date('Y-m-d', strtotime('+2 months', strtotime($today)));

		$result = $this->invokeMethod($this->subject, 'computeReviewDate', [true, false]);

		$this->assertSame($expected, $result);
	}

	public function testComputeReviewDateFallsBackToWeeksOnTamperedUnit(): void
	{
		WP_Mock::userFunction('get_option')
			->with('ypg_review_time_period', 1)
			->andReturn(1);
		WP_Mock::userFunction('get_option')
			->with('ypg_review_time_unit', DateUnit::WEEKS)
			->andReturn('year'); // tampered

		$today = date('Y-m-d');
		$expected = date('Y-m-d', strtotime('+1 week', strtotime($today)));

		$result = $this->invokeMethod($this->subject, 'computeReviewDate', [true, false]);

		$this->assertSame($expected, $result);
	}

	public function testComputeReminderDateUsesPerPostOverridesWhenSet(): void
	{
		$postId = 42;

		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_date', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_review_date', true)
			->andReturn('2024-12-01');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_period', true)
			->andReturn('3');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_unit', true)
			->andReturn(DateUnit::DAYS);

		$result = $this->invokeMethod($this->subject, 'computeReminderDate', [$postId, true, false]);

		$this->assertSame('2024-12-04', $result);
	}

	public function testComputeReminderDateFallsBackToSiteOptionsWhenNoOverride(): void
	{
		$postId = 42;

		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_date', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_review_date', true)
			->andReturn('2024-12-01');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_period', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_unit', true)
			->andReturn('');

		WP_Mock::userFunction('get_option')
			->with('ypg_reminder_time_period', 1)
			->andReturn(1);
		WP_Mock::userFunction('get_option')
			->with('ypg_reminder_time_unit', DateUnit::WEEKS)
			->andReturn(DateUnit::WEEKS);

		$result = $this->invokeMethod($this->subject, 'computeReminderDate', [$postId, true, false]);

		$this->assertSame('2024-12-08', $result);
	}

	public function testComputeReminderDatePrefersSubmittedReviewDateOverStored(): void
	{
		$postId = 42;
		$_POST = ['ypg_review_date' => '2025-01-01'];

		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_date', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_review_date', true)
			->andReturn('2024-12-01');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_period', true)
			->andReturn('1');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_reminder_time_unit', true)
			->andReturn(DateUnit::WEEKS);

		$result = $this->invokeMethod($this->subject, 'computeReminderDate', [$postId, true, false]);

		$this->assertSame('2025-01-08', $result);
	}
}
