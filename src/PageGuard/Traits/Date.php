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

    public function getPeriodOptionString(string $periodKey, string $unitKey, bool $hideOnSingle = true): string
    {
        $period = intval(get_option($periodKey, 2));
        $unit = get_option($unitKey, 'weeks');
        $units = [
            'days' => 1 === $period ? __('dag', 'yard-page-guard') : __('dagen', 'yard-page-guard'),
            'weeks' => 1 === $period ? __('week', 'yard-page-guard') : __('weken', 'yard-page-guard'),
            'months' => 1 === $period ? __('maand', 'yard-page-guard') : __('maanden', 'yard-page-guard'),
        ];
        $unitLabel = $units[$unit] ?? $unit;

        return (1 === $period && $hideOnSingle ? '' : $period . ' ') . $unitLabel;
    }

    public function addPeriodToBase(string $base, int $period, string $unit): string
    {
        $date = new \DateTime($base);

        if ('weeks' === $unit) {
            $date->modify("+{$period} weeks");
        } elseif ('months' === $unit) {
            $date->modify("+{$period} months");
        } else {
            $date->modify("+{$period} days");
        }

        return $date->format('Y-m-d');
    }

    public function computeDateMeta(
        string $inputFieldName,
        mixed $currentValue,
        bool $toBeVerified,
        bool $wasPreviouslyVerified,
        string $periodOptionName,
        string $unitOptionName,
        ?string $fallbackBaseDate = null
    ): string {
        // #1 Manual change via metabox input (different from before)
        if (
            isset($_POST[$inputFieldName]) &&
            '' !== $_POST[$inputFieldName] &&
            sanitize_text_field($_POST[$inputFieldName]) !== $currentValue
        ) {
            return sanitize_text_field($_POST[$inputFieldName]);
        }

        // #2 Keep current if not verified and current exists
        if (! $toBeVerified && $currentValue) {
            return $currentValue;
        }

        $period = (int) get_option($periodOptionName, 1);
        $unit = get_option($unitOptionName, 'weeks');
        $fallbackBaseDate = $fallbackBaseDate ?? date('Y-m-d');

        // #3 Auto increase when post has just been verified or no current value is set
        if ($toBeVerified && ! $wasPreviouslyVerified || ! $currentValue) {
            $baseDate = $currentValue ?: $fallbackBaseDate;

            return $this->addPeriodToBase($baseDate, $period, $unit);
        }

        // Fallback: return current meta
        return $currentValue;
    }

    private function computeReviewDate(int $postID, bool $toBeVerified, bool $wasPreviouslyVerified): string
    {
        $currentReviewDate = get_post_meta($postID, 'ypg_review_date', true);

        return $this->computeDateMeta(
            'ypg_review_date',
            $currentReviewDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            'ypg_review_time_period',
            'ypg_review_time_unit',
        );
    }

    private function computeReminderDate(int $postID, string $reviewDate, bool $toBeVerified, bool $wasPreviouslyVerified): string
    {
        $currentReminderDate = get_post_meta($postID, 'ypg_reminder_date', true);

        $reminderDate = $this->computeDateMeta(
            'ypg_reminder_date',
            $currentReminderDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            'ypg_reminder_time_period',
            'ypg_reminder_time_unit',
            $reviewDate
        );

        if (strtotime($reminderDate) <= strtotime($reviewDate)) {
            $reminderDate = $this->setReminderAfterReview($reviewDate);
        }

        return $reminderDate;
    }

    public function setReminderAfterReview(string $reviewDate): string
    {
        $period = (int) get_option('ypg_reminder_time_period', 1);
        $unit = get_option('ypg_reminder_time_unit', 'weeks');

        $computed = $this->addPeriodToBase($reviewDate, $period, $unit);

        if (strtotime($computed) <= strtotime($reviewDate)) {
            $date = new \DateTime($reviewDate);
            $date->modify('+1 day');
            $computed = $date->format('Y-m-d');
        }

        return $computed;
    }

    public function isValidDate(string $date): bool
    {
        $d = DateTime::createFromFormat('Y-m-d', $date);

        return $d && $d->format('Y-m-d') === $date;
    }
}
