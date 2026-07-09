<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;
use Exception;

trait Date
{
	public function formatDate(string $date, string $format = 'd F Y'): string
	{
		try {
			$date = new DateTime($date . ' 12:00:00', new DateTimeZone(wp_timezone_string()));
		} catch (Exception $e) {
			return '';
		}

		return date_i18n($format, $date->getTimestamp());
	}

	/**
	 * Adds a date period to a base date (provided as Y-m-d string)
	 */
	public function addPeriodToBase(string $base, int $period, string $unit): string
	{
		$date = new DateTime($base, new DateTimeZone(wp_timezone_string()));

		if ('weeks' === $unit) {
			$date->modify("+{$period} weeks");
		} elseif ('months' === $unit) {
			$date->modify("+{$period} months");
		} else {
			$date->modify("+{$period} days");
		}

		return $date->format('Y-m-d');
	}

	/**
	 * Steps a Y-m-d date forward in whole $period/$unit jumps until it lands
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

	/**
	 * Computes the next date for a post's review / reminder meta
	 *
	 * @param string $inputFieldName The POST field to check for manual changes
	 * @param string|bool $baseValue The current value in the database for THIS field
	 * @param bool $toBeVerified
	 * @param bool $wasPreviouslyVerified
	 * @param int $period The time period to add
	 * @param string $unit The unit of time (days, weeks, months)
	 * @param string $baseAdditionDate (Optional) An explicit date to add the period to (e.g., adding reminder period to review date)
	 */
	public function computeDateMeta(
		string $inputFieldName,
		$baseValue,
		bool $toBeVerified,
		bool $wasPreviouslyVerified,
		int $period,
		string $unit,
		string $baseAdditionDate = ''
	): string {
		// #1 Manual change via metabox input (different from before)
		if (
			isset($_POST[$inputFieldName]) &&
			'' !== $_POST[$inputFieldName] &&
			sanitize_text_field($_POST[$inputFieldName]) !== $baseValue
		) {
			return sanitize_text_field($_POST[$inputFieldName]);
		}

		// #2 Keep current if not verified and current exists
		if (! $toBeVerified && $baseValue) {
			return (string) $baseValue;
		}

		$fallbackBaseDate = date('Y-m-d');

		// #3 Auto increase when post has just been verified or no current value is set
		if ($toBeVerified && ! $wasPreviouslyVerified || ! $baseValue) {
			// Prioritize the base addition date (like a review date) over the current meta value
			$baseDate = $baseAdditionDate ?: ($baseValue ?: $fallbackBaseDate);

			return $this->addPeriodToBase((string) $baseDate, $period, $unit);
		}

		// Fallback: return current meta
		return (string) $baseValue;
	}

	private function computeReviewDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
	{
		$datePeriod = (int) get_option('ypg_review_time_period', 1);
		$dateUnit = get_option('ypg_review_time_unit', 'weeks');

		// The stored value is the comparison baseline, so a form echoing it back
		// is not mistaken for a manual change. Recomputes run from today: a fresh
		// verification restarts the review cycle at the moment of checking.
		return $this->computeDateMeta(
			'ypg_review_date',
			get_post_meta($postId, 'ypg_review_date', true),
			$toBeVerified,
			$wasPreviouslyVerified,
			$datePeriod,
			$dateUnit,
			date('Y-m-d')
		);
	}

	private function computeReminderDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false, string $reviewDate = ''): string
	{
		// Get the current reminder date
		$currentReminderDate = get_post_meta($postId, 'ypg_reminder_date', true);

		// The review date this reminder must follow. Callers that compute a new
		// review date in the same request pass it in; reading it from POST/meta
		// here would race the not-yet-persisted value and base the reminder on a
		// stale date.
		if ('' === $reviewDate) {
			$reviewDateInput = isset($_POST['ypg_review_date']) ? sanitize_text_field($_POST['ypg_review_date']) : '';
			$reviewDate = '' !== $reviewDateInput ? $reviewDateInput : (string) get_post_meta($postId, 'ypg_review_date', true);
		}

		// A reminder is the follow-up nag after an unanswered review mail, so it
		// must land after its review date. An earlier/equal stored value is
		// corrupt state written by older versions — drop it so it gets
		// recalculated from $reviewDate below.
		if (! empty($currentReminderDate) && '' !== $reviewDate && $currentReminderDate <= $reviewDate) {
			$currentReminderDate = '';
		}

		$dateUnitOverride = get_post_meta($postId, 'ypg_reminder_time_unit', true);
		$datePeriodOverride = (int) get_post_meta($postId, 'ypg_reminder_time_period', true);

		$finalPeriod = ! empty($datePeriodOverride) ? $datePeriodOverride : (int) get_option('ypg_reminder_time_period', 1);
		$finalUnit = ! empty($dateUnitOverride) ? $dateUnitOverride : get_option('ypg_reminder_time_unit', 'weeks');

		return $this->computeDateMeta(
			'ypg_reminder_date',
			$currentReminderDate,
			$toBeVerified,
			$wasPreviouslyVerified,
			$finalPeriod,
			$finalUnit,
			$reviewDate
		);
	}

	public function isValidDate(string $date): bool
	{
		$d = DateTime::createFromFormat('Y-m-d', $date);

		return $d && $d->format('Y-m-d') === $date;
	}
}
