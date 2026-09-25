<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\Email;
use Yard\PageGuard\Traits\Text;

class ReviewNotification extends Event
{
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
					'key' => Meta::POST_CONTENT_OWNER_ID,
					'compare' => 'EXISTS',
				],
				[
					'key' => Meta::REVIEW_DATE,
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE',
				],
				[
					'key' => Meta::REVIEW_MAIL_SENT,
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
				$this->formatSubject(get_option(Settings::REVIEW_EMAIL_SUBJECT, __('Controleer jouw webpagina(\'s)', 'yard-page-guard'))),
				$this->getContent($ownerItems, $owner),
				$headers
			)) {
				trigger_error('[yard-page-guard] Failed to send review notification email to ' . $owner->email(), E_USER_WARNING);

				continue;
			}
			/** @var ReviewItem $item */
			foreach ($ownerItems as $item) {
				$item->setReviewMailSent();
				$item->setReminderDate();
			}
		}
	}

	/**
	 * @param ReviewItem[] $items
	 */
	private function getContent(array $items, ContentOwner $owner): string
	{
		$content = wpautop(get_option(Settings::REVIEW_EMAIL_CONTENT, ''));
		$itemList = $this->buildItemListHtml($items);

		$values = [
			$owner->salutation(),
			$itemList,
		];

		$contentHtml = $this->replacePlaceholders($content, $values);

		return $this->wrapHtmlEmail($contentHtml);
	}
}
