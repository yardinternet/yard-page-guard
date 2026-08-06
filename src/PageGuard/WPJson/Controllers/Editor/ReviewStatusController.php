<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use DateTimeInterface;
use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Models\ReviewItem;
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
		$reviewItem = new ReviewItem(get_post($postId));

		return [
			'reviewDate' => $this->datePayload($reviewItem->reviewDate()),
			'reminderDate' => $this->datePayload($reviewItem->reminderDate()),
			'lastReviewDate' => $this->datePayload($reviewItem->lastReviewDate()),
			'isOverdue' => $reviewItem->isOverdue(),
			'reviewMailSent' => $reviewItem->reviewMailSent(),
		];
	}

	/**
	 * @return array{date: ?string, formatted: ?string}
	 */
	private function datePayload(?DateTimeInterface $date): array
	{
		return [
			'date' => $date ? $date->format('Y-m-d') : null,
			'formatted' => $date ? wp_date(get_option('date_format', 'd-m-Y'), $date->getTimestamp()) : null,
		];
	}
}
