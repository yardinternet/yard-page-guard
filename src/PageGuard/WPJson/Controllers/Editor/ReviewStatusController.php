<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Traits\Date;

/**
 * Returns the derived review state of a post: values the editor should show but
 * never write itself, since they are computed from meta and the site settings.
 */
class ReviewStatusController
{
	use Date;

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		return new WP_REST_Response($this->getStatus((int) $request->get_param('post_id')));
	}

	/**
	 * @return array<string, mixed>
	 */
	public function getStatus(int $postId): array
	{
		$reviewDate = (string) (get_post_meta($postId, PostMeta::REVIEW_DATE, true) ?: '');
		$reminderDate = (string) (get_post_meta($postId, PostMeta::REMINDER_DATE, true) ?: '');
		$lastReviewDate = (string) (get_post_meta($postId, PostMeta::LAST_REVIEW_DATE, true) ?: '');

		return [
			'reviewDate' => $this->datePayload($reviewDate),
			'reminderDate' => $this->datePayload($reminderDate),
			'lastReviewDate' => $this->datePayload($lastReviewDate),
			'isOverdue' => '' !== $reviewDate && current_time('Y-m-d') > $reviewDate,
			'reviewMailSent' => (bool) get_post_meta($postId, PostMeta::REVIEW_MAIL_SENT, true),
		];
	}

	/**
	 * @return array{date: ?string, formatted: ?string}
	 */
	private function datePayload(string $date): array
	{
		$isValid = '' !== $date && $this->isValidDate($date);

		return [
			'date' => $isValid ? $date : null,
			'formatted' => $isValid ? $this->formatDate($date) : null,
		];
	}
}
