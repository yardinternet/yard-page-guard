<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Email;
use Yard\PageGuard\Traits\Text;

class ReviewNotification extends Event
{
	use Date;
	use Text;
	use Email;

	protected function execute(): void
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

			$headers = $this->buildMailHeaders();

			if (! $this->sendEmail(
				$owner->email(),
				$this->formatSubject(__('Houdbaarheidscontrole', 'yard-page-guard')),
				$this->getContent($ownerItems, $owner),
				$headers
			)) {
				error_log('[yard-page-guard] Failed to send review notification email to ' . $owner->email());

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
		$content = wpautop(get_option('ypg_review_email_content', ''));
		$itemList = $this->buildItemListHtml($items);

		$values = [
			$owner->salutation(),
			$itemList,
		];

		$contentHtml = $this->replacePlaceholders($content, $values);

		return $this->wrapHtmlEmail($contentHtml);
	}

	private function updateModuleMeta(ReviewItem $item): void
	{
		update_post_meta($item->ID(), 'ypg_is_verified', '0');
		update_post_meta($item->ID(), 'ypg_review_mail_sent', '1');
	}
}
