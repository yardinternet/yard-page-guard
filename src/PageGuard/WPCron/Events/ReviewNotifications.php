<?php

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;

class ReviewNotifications
{
    public static function init(): void
    {
        (new self())->execute();
    }

    private function execute(): void
    {
        $items = $this->itemsToReview();

        if (empty($items)) {
            return;
        }

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
                    'key' => 'ypg_post_content_owner',
                    'compare' => 'EXISTS',
                ],
                [
                    'key' => 'ypg_review_date',
                    'value' => date('Y-m-d'),
                    'compare' => '<=',
                    'type' => 'DATE',
                ],
            ],
        ];

        $query = new WP_Query($args);

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

            $this->resetModuleSettings($item);
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
        return sprintf(
            __(
                '<html>
					<head>
						<style>
							body { font-family: Arial, sans-serif; }
							.content { margin: 20px; }
							.footer { margin: 20px; font-size: 0.9em; color: #666; }
						</style>
					</head>
					<body>
						<div class="content">
							<p>Beste %s,</p>
							<p>U bent de contenteigenaar van de pagina <a href="%s">%s</a>, die ingesteld staat/stond om gecontroleerd te worden op %s.</p>
							<p>De instellingen van de Houdbaarheidsmodule van deze pagina zijn gereset bij het versturen van deze notificatie. De volgende notificatie wordt pas verstuurd nadat u de instellingen opnieuw hebt ingesteld.</p>
						</div>
						<div class="footer">
							<small>Dit bericht is automatisch gegenereerd vanuit <a href="%s">%s</a></small>
						</div>
					</body>
				</html>',
                'yard-page-guard'
            ),
            $contentOwner->salutation(),
            $item->editLink(),
            $item->title(),
            $item->reviewDate(),
            get_site_url(),
            get_bloginfo('name')
        );
    }

    /**
     * Reset module settings for current page.
     * This ensures the notificatoin is send only once
     */
    private function resetModuleSettings(ReviewItem $item): void
    {
        delete_post_meta($item->ID(), 'ypg_is_verified');
        delete_post_meta($item->ID(), 'ypg_review_date');
    }
}
