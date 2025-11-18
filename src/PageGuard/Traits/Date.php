<?php

namespace Yard\PageGuard\Traits;

use DateTime;
use DateTimeZone;
use Exception;

trait Date
{
    public function formatDate(string $date, string $format = 'd F Y'): string
    {
        try {
            $date = new DateTime($date . ' 12:00:00', new DateTimeZone(get_option('timezone_string', 'Europe/Amsterdam')));
        } catch (Exception $e) {
            return '';
        }

        return date_i18n($format, $date->getTimestamp());
    }

    public function getDatePeriodLabel(string $periodKey, string $unitKey, bool $hideOnSingle = true, ?int $postId = null): string
    {
        $dateUnitOverride = get_post_meta($postId, $unitKey, true);
        $datePeriodOverride = (int) get_post_meta($postId, $periodKey, true);
        $finalPeriod = ! empty($dateUnitOverride) ? $dateUnitOverride : get_option($unitKey, 'weeks');
        $finalUnit = ! empty($datePeriodOverride) ? $datePeriodOverride : (int) get_option($periodKey, 1);

        $units = [
            'days' => 1 === $finalPeriod ? __('dag', 'yard-page-guard') : __('dagen', 'yard-page-guard'),
            'weeks' => 1 === $finalPeriod ? __('week', 'yard-page-guard') : __('weken', 'yard-page-guard'),
            'months' => 1 === $finalPeriod ? __('maand', 'yard-page-guard') : __('maanden', 'yard-page-guard'),
        ];
        $unitLabel = $units[$finalUnit] ?? $finalUnit;

        return (1 === $finalPeriod && $hideOnSingle ? '' : $finalPeriod . ' ') . $unitLabel;
    }

    /**
     * Adds a date period to a base date (provided as Y-m-d string)
     */
    public function addPeriodToBase(string $base, int $period, string $unit): string
    {
        $date = new DateTime($base);

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
     * $toBeVerified and $wasPreviouslyVerified are used
     * because saving a post regardless of changing the yard-page-guard metabox values
     * will be hooked into using 'save_post'.
     */
    public function computeDateMeta(
        string $inputFieldName,
        mixed $baseValue,
        bool $toBeVerified,
        bool $wasPreviouslyVerified,
        int $period,
        string $unit
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
            return $baseValue;
        }

        $fallbackBaseDate = date('Y-m-d');

        // #3 Auto increase when post has just been verified or no current value is set
        if ($toBeVerified && ! $wasPreviouslyVerified || ! $baseValue) {
            $baseDate = $baseValue ?: $fallbackBaseDate;

            return $this->addPeriodToBase($baseDate, $period, $unit);
        }

        // Fallback: return current meta
        return $baseValue;
    }

    private function computeReviewDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
    {
        $currentReviewDate = get_post_meta($postId, 'ypg_review_date', true);
        $datePeriod = (int) get_option('ypg_review_time_period', 1);
        $dateUnit = get_option('ypg_review_time_unit', 'weeks');

        return $this->computeDateMeta(
            'ypg_review_date',
            $currentReviewDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            $datePeriod,
            $dateUnit,
        );
    }

    private function computeReminderDate(int $postId, bool $toBeVerified = true, bool $wasPreviouslyVerified = false): string
    {
        $currentReviewDate = get_post_meta($postId, 'ypg_review_date', true);
        $dateUnitOverride = get_post_meta($postId, 'ypg_reminder_time_unit', true);
        $datePeriodOverride = (int) get_post_meta($postId, 'ypg_reminder_time_period', true);
        $finalPeriod = ! empty($datePeriodOverride) ? $datePeriodOverride : (int) get_option('ypg_reminder_time_period', 1);
        $finalUnit = ! empty($dateUnitOverride) ? $dateUnitOverride : get_option('ypg_reminder_time_unit', 'weeks');

        $reminderDate = $this->computeDateMeta(
            'ypg_reminder_date',
            $currentReviewDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            $finalPeriod,
            $finalUnit,
        );

        return $reminderDate;
    }

    public function isValidDate(string $date): bool
    {
        $d = DateTime::createFromFormat('Y-m-d', $date);

        return $d && $d->format('Y-m-d') === $date;
    }
}
