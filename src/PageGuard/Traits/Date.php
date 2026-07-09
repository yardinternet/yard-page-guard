<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;
use Exception;
use Yard\PageGuard\Enums\DateUnit;

trait Date
{
	/**
	 * Format a Y-m-d date string for display in the site timezone. Returns ''
	 * when the input cannot be parsed.
	 */
	public function formatDate(string $date, string $format = 'd F Y'): string
	{
		try {
			$dateTime = new DateTime($date . ' 12:00:00', $this->siteTimezone());
		} catch (Exception $e) {
			return '';
		}

		return wp_date($format, $dateTime->getTimestamp(), $this->siteTimezone());
	}

	/**
	 * Add a number of {@see DateUnit} periods to a Y-m-d base date and return
	 * the resulting date as Y-m-d.
	 *
	 * @throws \InvalidArgumentException when $unit is not a recognised DateUnit.
	 */
	public function addPeriodToBase(string $base, int $period, string $unit): string
	{
		$normalised = DateUnit::from($unit);

		$date = new DateTime($base, $this->siteTimezone());
		$date->modify(sprintf('+%d %s', $period, $normalised));

		return $date->format('Y-m-d');
	}

	/**
	 * Step a Y-m-d date forward in whole $period/$unit jumps until it lands
	 * strictly after today, returning the new Y-m-d.
	 *
	 * Used to roll a recurring reminder onto its next slot: it collapses any
	 * missed periods into a single jump (one nudge instead of a backlog) and,
	 * because the result is always in the future, leaves callers that select on
	 * `<= today` idempotent — repeated (manual) cron runs the same day can't
	 * advance the date again or resend.
	 */
	public function advanceToFuture(string $base, int $period, string $unit): string
	{
		// A non-positive period would never clear today; clamp so the loop always
		// makes forward progress (the UI enforces a minimum of 1 anyway).
		$period = max(1, $period);
		$today = date('Y-m-d');

		$next = $base;
		while ($next <= $today) {
			$next = $this->addPeriodToBase($next, $period, $unit);
		}

		return $next;
	}

	public function isValidDate(string $date): bool
	{
		$parsed = DateTime::createFromFormat('Y-m-d', $date);

		return $parsed && $parsed->format('Y-m-d') === $date;
	}

	/**
	 * Compute the next stored value for a review/reminder date meta field.
	 *
	 * Resolution order (first match wins):
	 *   1. A manual change submitted in $_POST[$inputFieldName] that differs from $currentValue.
	 *   2. Post staying unverified with a non-empty stored value → keep it as-is.
	 *   3. Post just-verified (or no value stored yet) → add $period $unit to the
	 *      first available of: $baseAdditionDate, the stored value, today.
	 *   4. Otherwise (still verified, value stored) → keep the stored value.
	 *
	 * @param string|bool|null $currentValue Mixed accepted for back-compat with `get_post_meta(...)`
	 *                                       which returns '' or false when no value is stored.
	 */
	public function computeDateMeta(
		string $inputFieldName,
		$currentValue,
		bool $toBeVerified,
		bool $wasPreviouslyVerified,
		int $period,
		string $unit,
		string $baseAdditionDate = ''
	): string {
		$current = $this->coerceDateString($currentValue);

		$manualOverride = $this->readSubmittedDate($inputFieldName);
		if (null !== $manualOverride && $manualOverride !== $current) {
			return $manualOverride;
		}

		$hasCurrent = '' !== $current;
		$justVerified = $toBeVerified && ! $wasPreviouslyVerified;
		$shouldRecompute = $justVerified || ! $hasCurrent;

		if (! $toBeVerified && $hasCurrent) {
			return $current;
		}

		if ($shouldRecompute) {
			$baseDate = '' !== $baseAdditionDate
				? $baseAdditionDate
				: ($hasCurrent ? $current : date('Y-m-d'));

			return $this->addPeriodToBase($baseDate, $period, $unit);
		}

		return $current;
	}

	private function computeReviewDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
	{
		// The stored value is the comparison baseline, so a form echoing it back
		// is not mistaken for a manual change. Recomputes run from today: a fresh
		// verification restarts the review cycle at the moment of checking.
		return $this->computeDateMeta(
			'ypg_review_date',
			$this->readMetaString($postId, 'ypg_review_date'),
			$toBeVerified,
			$wasPreviouslyVerified,
			(int) get_option('ypg_review_time_period', 1),
			$this->resolveUnit(get_option('ypg_review_time_unit', DateUnit::WEEKS)),
			date('Y-m-d')
		);
	}

	private function computeReminderDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false, string $reviewDate = ''): string
	{
		// The review date this reminder must follow. Callers that compute a new
		// review date in the same request pass it in; deriving it from POST/meta
		// here would race the not-yet-persisted value and base the reminder on a
		// stale date.
		if ('' === $reviewDate) {
			$reviewDate = $this->effectiveReviewDate($postId);
		}

		$current = $this->readMetaString($postId, 'ypg_reminder_date');

		// A reminder is the follow-up nag after an unanswered review mail, so it
		// must land after its review date. An earlier/equal stored value is
		// corrupt state written by versions before 2.3.x — drop it so it gets
		// recalculated from $reviewDate below.
		if (null !== $current && '' !== $reviewDate && $current <= $reviewDate) {
			$current = null;
		}

		[$period, $unit] = $this->effectiveReminderPeriod($postId);

		return $this->computeDateMeta(
			'ypg_reminder_date',
			$current,
			$toBeVerified,
			$wasPreviouslyVerified,
			$period,
			$unit,
			$reviewDate
		);
	}

	/**
	 * The review date in effect for the post during the current request — a
	 * fresh POST submission wins over the value stored in meta.
	 */
	private function effectiveReviewDate(int $postId): string
	{
		$submitted = $this->readSubmittedDate('ypg_review_date');

		if (null !== $submitted) {
			return $submitted;
		}

		return $this->readMetaString($postId, 'ypg_review_date') ?? '';
	}

	/**
	 * Post-level period/unit override beats the site option. An override of
	 * 0/empty is treated as "no override".
	 *
	 * @return array{0:int,1:string}
	 */
	private function effectiveReminderPeriod(int $postId): array
	{
		$periodOverride = (int) get_post_meta($postId, 'ypg_reminder_time_period', true);
		$unitOverride = $this->readMetaString($postId, 'ypg_reminder_time_unit');

		$period = 0 < $periodOverride ? $periodOverride : (int) get_option('ypg_reminder_time_period', 1);
		$unit = $this->resolveUnit($unitOverride ?? get_option('ypg_reminder_time_unit', DateUnit::WEEKS));

		return [$period, $unit];
	}

	/**
	 * Coerce a value coming from stored meta or a site option into a valid
	 * {@see DateUnit}. Unknown/tampered values fall back to weeks, the default
	 * the rest of the UI ships with.
	 *
	 * @param mixed $value
	 */
	private function resolveUnit($value): string
	{
		if (is_string($value)) {
			$resolved = DateUnit::tryFrom($value);
			if (null !== $resolved) {
				return $resolved;
			}
		}

		return DateUnit::WEEKS;
	}

	private function readSubmittedDate(string $inputFieldName): ?string
	{
		if (! isset($_POST[$inputFieldName])) {
			return null;
		}

		$submitted = sanitize_text_field($_POST[$inputFieldName]);

		return '' === $submitted ? null : $submitted;
	}

	private function readMetaString(int $postId, string $key): ?string
	{
		$value = get_post_meta($postId, $key, true);

		return is_string($value) && '' !== $value ? $value : null;
	}

	/**
	 * @param string|bool|int|null $value
	 */
	private function coerceDateString($value): string
	{
		if (is_string($value) && '' !== $value) {
			return $value;
		}

		return '';
	}

	private function siteTimezone(): DateTimeZone
	{
		return new DateTimeZone(wp_timezone_string());
	}
}
