<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Enums\PostMeta;

trait Meta
{
	public function clearReviewMeta(int $postId): void
	{
		$keys = [
			PostMeta::POST_CONTENT_OWNER_ID,
			PostMeta::POST_CONTENT_OWNER_NAME,
			PostMeta::POST_CONTENT_OWNER_EMAIL,
			PostMeta::POST_CONTENT_OWNER_TYPE,
			PostMeta::POST_CONTENT_OWNER_PHONE_NUMBER,
			PostMeta::REVIEW_DATE,
			PostMeta::REMINDER_DATE,
			PostMeta::IS_VERIFIED,
			PostMeta::REMINDER_TIME_PERIOD,
			PostMeta::REMINDER_TIME_UNIT,
			PostMeta::REVIEW_MAIL_SENT,
			PostMeta::LAST_REVIEW_DATE,
			PostMeta::LAST_REMINDER_DATE,
		];

		foreach ($keys as $key) {
			delete_post_meta($postId, $key);
		}
	}
}
