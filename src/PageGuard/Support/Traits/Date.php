<?php

namespace Yard\PageGuard\Support\Traits;

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

    public function getReviewPeriodString(): string
    {
        $period = get_option('ypg_review_time_period', 2);
        $unit = get_option('ypg_review_time_unit', 'weeks');
        $units = [
            'days' => __('dagen', 'yard-page-guard'),
            'weeks' => __('weken', 'yard-page-guard'),
            'months' => __('maanden', 'yard-page-guard'),
        ];
        $unitLabel = $units[$unit] ?? $unit;

        return $period . ' ' . $unitLabel;
    }
}
