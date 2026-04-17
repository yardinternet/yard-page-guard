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

	private function computeReviewDate(bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
	{
		$datePeriod = (int) get_option('ypg_review_time_period', 1);
		$dateUnit = get_option('ypg_review_time_unit', 'weeks');

		return $this->computeDateMeta(
			'ypg_review_date',
			false,
			$toBeVerified,
			$wasPreviouslyVerified,
			$datePeriod,
			$dateUnit
		);
	}

	private function computeReminderDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
	{
		// Get the current reminder date
		$currentReminderDate = get_post_meta($postId, 'ypg_reminder_date', true);

		// Get the review date (checking POST first for manual updates)
		$reviewDateInput = isset($_POST['ypg_review_date']) ? sanitize_text_field($_POST['ypg_review_date']) : '';
		$currentReviewDate = ! empty($reviewDateInput) ? $reviewDateInput : get_post_meta($postId, 'ypg_review_date', true);

		// Fix bugged posts with a reminder date before the review date
		if (! empty($currentReminderDate) && ! empty($currentReviewDate) && $currentReminderDate <= $currentReviewDate) {
			$currentReminderDate = '';
		}

		$dateUnitOverride = get_post_meta($postId, 'ypg_reminder_time_unit', true);
		$datePeriodOverride = (int) get_post_meta($postId, 'ypg_reminder_time_period', true);

		$finalPeriod = ! empty($datePeriodOverride) ? $datePeriodOverride : (int) get_option('ypg_reminder_time_period', 1);
		$finalUnit = ! empty($dateUnitOverride) ? $dateUnitOverride : get_option('ypg_reminder_time_unit', 'weeks');

		return $this->computeDateMeta(
			'ypg_reminder_date',
			$currentReminderDate, // If it was bugged, this passes as '' and forces a recalculation
			$toBeVerified,
			$wasPreviouslyVerified,
			$finalPeriod,
			$finalUnit,
			$currentReviewDate
		);
	}

	public function isValidDate(string $date): bool
	{
		$d = DateTime::createFromFormat('Y-m-d', $date);

		return $d && $d->format('Y-m-d') === $date;
	}
}
