<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Meta;

/**
 * Single owner of a post's review scheduling.
 *
 * The editors only record intent (the *_TYPE fields plus any override), because
 * resolving a default needs the site options and sibling fields, which a per-field
 * REST schema cannot see. This turns that intent into the dates the cron events query,
 * after either editor has saved.
 */
class ReviewScheduler
{
	use Date;
	use Meta;

	public function syncForPost(int $postId): void
	{
		if (0 === (int) get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_ID, true)) {
			$this->clearReviewMeta($postId);

			return;
		}

		$this->syncReviewDate($postId);
		$this->syncReminderPeriod($postId);
	}

	/**
	 * Records a completed review and starts the next cycle. Shared by the editor
	 * sidebar, the frontend review link and the overview's bulk action.
	 */
	public function markReviewed(int $postId): void
	{
		// A custom review date is a one-off, so the next cycle returns to the site default.
		update_post_meta($postId, PostMeta::REVIEW_DATE_TYPE, MetaFields::DATE_TYPE_DEFAULT);
		update_post_meta($postId, PostMeta::REVIEW_DATE, $this->computeReviewDate($postId));
		update_post_meta($postId, PostMeta::LAST_REVIEW_DATE, current_time('Y-m-d'));

		// Deprecated, but the overview columns still read it.
		update_post_meta($postId, PostMeta::IS_VERIFIED, '1');

		delete_post_meta($postId, PostMeta::REVIEW_MAIL_SENT);
		delete_post_meta($postId, PostMeta::LAST_REMINDER_DATE);
		delete_post_meta($postId, PostMeta::REMINDER_DATE);

		do_action('yard::page-guard/after-post-reviewed', $postId);
	}

	/**
	 * `computeReviewDate()` keeps an existing date rather than recomputing it, so saving
	 * a page does not push the review date forward. The editors clear REVIEW_DATE when
	 * the user switches back to the default, which is what triggers a recompute.
	 */
	private function syncReviewDate(int $postId): void
	{
		$type = (string) get_post_meta($postId, PostMeta::REVIEW_DATE_TYPE, true);
		$date = (string) get_post_meta($postId, PostMeta::REVIEW_DATE, true);

		if (MetaFields::DATE_TYPE_CUSTOM === $type && '' !== $date) {
			return;
		}

		if (MetaFields::DATE_TYPE_CUSTOM === $type) {
			update_post_meta($postId, PostMeta::REVIEW_DATE_TYPE, MetaFields::DATE_TYPE_DEFAULT);
		}

		update_post_meta($postId, PostMeta::REVIEW_DATE, $this->computeReviewDate($postId, false, false));
	}

	/**
	 * Deleting an unusable override makes `computeReminderDate()`'s "both overrides
	 * non-empty" check fall back to the site options, so defaults resolve in one place.
	 * "Custom implies a period of at least one" cannot be expressed per field, so it is enforced here.
	 */
	private function syncReminderPeriod(int $postId): void
	{
		$type = (string) get_post_meta($postId, PostMeta::REMINDER_TIME_TYPE, true);
		$period = (int) get_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD, true);
		$unit = (string) get_post_meta($postId, PostMeta::REMINDER_TIME_UNIT, true);

		$isUsableOverride = MetaFields::DATE_TYPE_CUSTOM === $type
			&& 1 <= $period
			&& in_array($unit, MetaFields::TIME_UNITS, true);

		if ($isUsableOverride) {
			return;
		}

		if (MetaFields::DATE_TYPE_CUSTOM === $type) {
			update_post_meta($postId, PostMeta::REMINDER_TIME_TYPE, MetaFields::DATE_TYPE_DEFAULT);
		}

		delete_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD);
		delete_post_meta($postId, PostMeta::REMINDER_TIME_UNIT);
	}
}
