<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;
use Exception;
use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Enums\PostMeta;

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
		$datePeriod = (int) get_option(Options::REVIEW_TIME_PERIOD, 1);
		$dateUnit = get_option(Options::REVIEW_TIME_UNIT, 'weeks');

		// The stored value is the comparison baseline, so a form echoing it back
		// is not mistaken for a manual change. Recomputes run from today: a fresh
		// verification restarts the review cycle at the moment of checking.
		return $this->computeDateMeta(
			'ypg_review_date',
			get_post_meta($postId, PostMeta::REVIEW_DATE, true),
			$toBeVerified,
			$wasPreviouslyVerified,
			$datePeriod,
			$dateUnit,
			date('Y-m-d')
		);
	}

	private function computeReminderDate(int $postId, string $reviewDate = ''): string
	{
		$dateUnitOverride = get_post_meta($postId, PostMeta::REMINDER_TIME_UNIT, true);
		$datePeriodOverride = (int) get_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD, true);

		if (! empty($dateUnitOverride) && ! empty($datePeriodOverride)) {
			$finalPeriod = $datePeriodOverride;
			$finalUnit = $dateUnitOverride;
		} else {
			$finalPeriod = (int) get_option(Options::REMINDER_TIME_PERIOD, 1);
			$finalUnit = get_option(Options::REMINDER_TIME_UNIT, 'weeks');
		}

		return $this->addPeriodToBase(
			$reviewDate ?: date('Y-m-d'),
			$finalPeriod,
			$finalUnit
		);
	}

	public function isValidDate(string $date): bool
	{
		$d = DateTime::createFromFormat('Y-m-d', $date);

		return $d && $d->format('Y-m-d') === $date;
	}
}
