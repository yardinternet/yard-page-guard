<?php

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Support\Traits\Date;
use Yard\PageGuard\Support\Traits\Email;
use Yard\PageGuard\Support\Traits\Placeholder;

class ReminderNotification
{
    use Date;
    use Placeholder;
    use Email;

    public static function init(): void
    {
        (new self())->execute();
    }

    private function execute(): void
    {
        $items = $this->getItems();

        if ([] === $items) {
            return;
        }

        $this->handleNotifications(array_map(fn ($item) => new ReviewItem($item), $items));
    }

    /**
     * @return \WP_Post[]
     */
    private function getItems(): array
    {
        $args = [
            'post_type' => apply_filters('yard::page-guard/post-types-to-use', ['page']),
            'posts_per_page' => -1,
            'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
            'meta_query' => [
                'relation' => 'AND',
                [
                    'key' => 'ypg_post_content_owner_email',
                    'compare' => 'EXISTS',
                ],
                [
                    'key' => 'ypg_reminder_date',
                    'value' => date('Y-m-d'),
                    'compare' => '<=',
                    'type' => 'DATE',
                ],
            ],
            // Performance
            'no_found_rows' => true,
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
        ];

        $query = new WP_Query($args);

        return $query->posts;
    }

    /**
     * @param ReviewItem[] $items
     */
    private function handleNotifications(array $items): void
    {
        $groupedItems = $this->groupItemsByOwner($items);

        foreach ($groupedItems as $group) {
            $owner = $group['owner'];
            $ownerItems = $group['items'];

            $headers = $this->buildMailHeaders('ypg_reminder_email_bcc');

            if (! $this->sendEmail(
                $owner->email(),
                $this->formatSubject(__('Controle herinnering', 'yard-page-guard')),
                $this->getContent($ownerItems, $owner),
                $headers
            )) {
                error_log('Failed to send reminder notification email to ' . $owner->email());

                continue;
            }

            foreach ($ownerItems as $item) {
                $this->updateModuleMeta($item);
            }
        }
    }

    /**
     * @param ReviewItem[] $items
     */
    private function getContent(array $items, ContentOwner $owner): string
    {
        $content = wpautop(get_option('ypg_reminder_email_content', ''));
        $itemList = $this->buildItemListHtml($items, true);

        $values = [
            $owner->salutation(),
            $itemList,
            $this->getPeriodOptionString('ypg_reminder_time_period', 'ypg_reminder_time_unit'),
        ];

        $contentHtml = $this->replacePlaceholders($content, $values);

        return $this->wrapHtmlEmail($contentHtml);
    }

    private function updateModuleMeta(ReviewItem $item): void
    {
        $currentReminderDate = $item->reminderDate() ?: date('Y-m-d');
        $reminderPeriod = intval(get_option('ypg_reminder_time_period', 1));
        $reminderUnit = get_option('ypg_reminder_time_unit', 'weeks');

        update_post_meta($item->ID(), 'ypg_reminder_date', $this->addPeriodToBase($currentReminderDate, $reminderPeriod, $reminderUnit));
    }
}
