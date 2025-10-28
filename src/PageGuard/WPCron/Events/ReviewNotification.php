<?php

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Support\Traits\Date;
use Yard\PageGuard\Support\Traits\Placeholder;

class ReviewNotification
{
    use Date;
    use Placeholder;

    public static function init(): void
    {
        (new self())->execute();
    }

    private function execute(): void
    {
        error_log('ReviewNotification execute started.');
        $items = $this->itemsToReview();

        if (empty($items)) {
            return;
        }

        error_log('ReviewNotification found ' . count($items) . ' items to process.');

        $this->handleNotifications($this->prepareItems($items));
    }

    /**
     * Fetch items that are scheduled for review or are already due.
     *
     * This function retrieves all posts of specified post types that have a content owner
     * and a review date that is today or in the past. The post types and statuses to be
     * considered can be modified using the 'yard::page-guard/post-types-to-use' and
     * 'yard::page-guard/post-statusses-to-use' filters respectively.
     */
    private function itemsToReview(): array
    {
        $args = [
            'post_type' => apply_filters('yard::page-guard/post-types-to-use', ['page']),
            'posts_per_page' => -1,
            'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
            'meta_query' => [
                'relation' => 'AND',
                [
                    'key' => 'ypg_post_content_owner_id',
                    'compare' => 'EXISTS',
                ],
                [
                    'key' => 'ypg_review_date',
                    'value' => date('Y-m-d'),
                    'compare' => '<=',
                    'type' => 'DATE',
                ],
                [
                    'key' => 'ypg_review_mail_sent',
                    'compare' => 'NOT EXISTS',
                ],
            ],
        ];

        $query = new WP_Query($args);

        error_log(json_encode($args));
        error_log('ReviewNotification itemsToReview found ' . count($query->posts) . ' items.');

        return $query->posts;
    }

    private function prepareItems(array $items): array
    {
        $preparedItems = [];

        foreach ($items as $item) {
            $preparedItems[] = new ReviewItem($item);
        }

        return $preparedItems;
    }

    private function handleNotifications(array $items): void
    {
        foreach ($items as $item) {
            $contentOwner = $item->contentOwner();

            if (! $contentOwner) {
                continue;
            }

            if (! $this->sendNotification($item, $contentOwner)) {
                continue;
            }

            $this->updateModuleMeta($item);
        }
    }

    private function sendNotification(ReviewItem $item, ContentOwner $contentOwner): bool
    {
        return wp_mail(
            $contentOwner->email(),
            $this->formatSubject(),
            $this->notificationMessage($item, $contentOwner),
            ['Content-Type: text/html; charset=UTF-8']
        );
    }

    private function formatSubject(): string
    {
        return sprintf(
            '%s - %s',
            __('Houdbaarheidsmodule', 'yard-page-guard'),
            get_bloginfo('name')
        );
    }

    private function notificationMessage(ReviewItem $item, ContentOwner $contentOwner): string
    {
        $content = wpautop(get_option('ypg_review_email_content', ''));

        $values = [
            $contentOwner->salutation(),
            sprintf('<a href="%s">%s</a>', $item->editLink(), $item->title()),
            $item->reviewDate(),
            $this->getPeriodOptionString('ypg_review_time_period', 'ypg_review_time_unit'),
            sprintf('<a href="%s">%s</a>', $item->editLink(), __("Gecontroleerd en akkoord", 'yard-page-guard')),
        ];

        $contentHtml = $this->replacePlaceholders($content, $values);

        return sprintf(
            '<html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .content { margin: 20px; }
                        .footer { margin: 20px; font-size: 0.9em; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="content">%s</div>
                    <div class="footer">
                        <small>%s <a href="%s">%s</a></small>
                    </div>
                </body>
            </html>',
            $contentHtml,
            __('Dit bericht is automatisch gegenereerd vanuit', 'yard-page-guard'),
            get_site_url(),
            get_bloginfo('name')
        );
    }

    /**
     * Reset module settings for current page.
     * This ensures the notification is sent only once
     */
    private function updateModuleMeta(ReviewItem $item): void
    {
        delete_post_meta($item->ID(), 'ypg_is_verified');
        update_post_meta($item->ID(), 'ypg_review_mail_sent', 1);
    }
}
