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
            $date = new DateTime($date, new DateTimeZone(get_option('timezone_string')));
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
        mixed $currentMeta,
        int $toBeVerified,
        bool $wasPreviouslyVerified,
        string $fallbackBaseDate,
        string $periodOptionName,
        string $unitOptionName,
        int $defaultPeriod = 2,
        string $defaultUnit = 'weeks'
    ): string {
        // #1 Manual change via input (different from before)
        if (
            isset($_POST[$inputFieldName]) &&
            '' !== $_POST[$inputFieldName] &&
            sanitize_text_field($_POST[$inputFieldName]) !== $currentMeta
        ) {
            return sanitize_text_field($_POST[$inputFieldName]);
        }

        // #2 Keep current if not verified and current exists
        if (0 === $toBeVerified && $currentMeta) {
            return $currentMeta;
        }

        $period = (int) get_option($periodOptionName, $defaultPeriod);
        $unit = get_option($unitOptionName, $defaultUnit);

        // #3 Auto increase when post has just been verified (and input value same as before)
        if (
            1 === $toBeVerified &&
            ! $wasPreviouslyVerified &&
            isset($_POST[$inputFieldName]) &&
            sanitize_text_field($_POST[$inputFieldName]) === $currentMeta
        ) {
            $baseDate = $currentMeta ?: $fallbackBaseDate;

            return $this->addPeriodToBase($baseDate, $period, $unit);
        }

        // #4 Auto increase when no current value is set
        if (! $currentMeta) {
            $baseDate = $currentMeta ?: $fallbackBaseDate;

            return $this->addPeriodToBase($baseDate, $period, $unit);
        }

        // Fallback: return current meta
        return $currentMeta;
    }
}
