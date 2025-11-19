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
			'ypg_review_date',
			'ypg_reminder_date',
			'ypg_review_mail_sent',
		];

		foreach ($keys as $key) {
			delete_post_meta($postId, $key);
		}
	}
}
