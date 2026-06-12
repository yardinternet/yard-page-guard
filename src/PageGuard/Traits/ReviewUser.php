<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait ReviewUser
{
	protected function resolveReviewUserLogin(): string
	{
		return sanitize_user(trim((string) apply_filters('yard::page-guard/review-user-login', 'ypg_review_user')), true);
	}
}
