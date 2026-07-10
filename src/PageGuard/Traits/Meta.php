<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait Meta
{
	public function clearReviewMeta(int $postId): void
	{
		$keys = [
			'ypg_post_content_owner_id',
			'ypg_post_content_owner_name',
			'ypg_post_content_owner_email',
			'ypg_post_content_owner_type',
			'ypg_post_content_owner_phone_number',
			'ypg_review_date',
			'ypg_reminder_date',
			'ypg_is_verified',
			'ypg_reminder_time_period',
			'ypg_reminder_time_unit',
			'ypg_review_mail_sent',
			'ypg_last_review_date',
			'ypg_last_reminder_date',
			'ypg_reminder_count',
		];

		foreach ($keys as $key) {
			delete_post_meta($postId, $key);
		}
	}
}
