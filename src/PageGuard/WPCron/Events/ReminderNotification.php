<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPCron\Events;

use WP_Query;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Email;
use Yard\PageGuard\Traits\PostStatusses;
use Yard\PageGuard\Traits\PostTypes;
use Yard\PageGuard\Traits\Text;

class ReminderNotification extends Event
{
	use Date;
	use Text;
	use Email;
	use PostTypes;
	use PostStatusses;

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
			'post_type' => $this->getPostTypes(),
			'posts_per_page' => -1,
			'post_status' => $this->postStatussesToUse(),
			'meta_query' => [
				'relation' => 'AND',
				[
					'key' => Meta::POST_CONTENT_OWNER_ID,
					'compare' => 'EXISTS',
				],
				[
					'key' => Meta::REMINDER_DATE,
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE',
				],
				// A reminder only makes sense after an unanswered review mail; the
				// flag is set when that mail goes out and cleared on verification.
				// This keeps a wrongly-early reminder date from mailing before the
				// review mail.
				[
					'key' => Meta::REVIEW_MAIL_SENT_DATE,
					'compare' => 'EXISTS',
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

			$headers = $this->buildMailHeaders(Settings::REMINDER_EMAIL_BCC);

			if (! $this->sendEmail(
				$owner->email(),
				$this->formatSubject(get_option(Settings::REMINDER_EMAIL_SUBJECT, __('Herinnering controle webpagina(\'s)', 'yard-page-guard'))),
				$this->getContent($ownerItems, $owner),
				$headers
			)) {
				trigger_error('[yard-page-guard] Failed to send reminder notification email to ' . $owner->email(), E_USER_WARNING);

				continue;
			}

			if (! defined('WP_CLI') || ! WP_CLI) {
				/** @var ReviewItem $item */
				foreach ($ownerItems as $item) {
					$item->setReminderMailSentDate(new \DateTime('now', wp_timezone()));
					$item->setReminderDate();
				}
			}
		}
	}

	/**
	 * @param ReviewItem[] $items
	 */
	private function getContent(array $items, ContentOwner $owner): string
	{
		$content = wpautop(get_option(Settings::REMINDER_EMAIL_CONTENT, ''));
		$itemList = $this->buildItemListHtml($items, true);

		$values = [
			$owner->name(),
			$itemList,
		];

		$contentHtml = $this->replacePlaceholders($content, $values);

		return $this->wrapHtmlEmail($contentHtml);
	}
}
