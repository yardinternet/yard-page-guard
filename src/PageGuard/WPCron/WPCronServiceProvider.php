<?php

namespace Yard\PageGuard\WPCron;

use DateTime;
use DateTimeZone;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\WPCron\Events\ReviewNotifications;

class WPCronServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        add_action('ypg_site_cron', [ReviewNotifications::class, 'init']);

        if (! wp_next_scheduled('ypg_site_cron')) {
            wp_schedule_event($this->timeToExecute(), 'daily', 'ypg_site_cron');
        }
    }

    /**
     * Notifications will be sent at 6am on the next day.
     */
    protected function timeToExecute(): int
    {
        $currentDateTime = new DateTime('now', new DateTimeZone(wp_timezone_string()));
        $tomorrowDateTime = $currentDateTime->modify('+1 day');
        $tomorrowDateTime->setTime(6, 0, 0);

        return $tomorrowDateTime->getTimestamp();
    }
}
