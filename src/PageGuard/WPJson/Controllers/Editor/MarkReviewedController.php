<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Models\ReviewItem;

/**
 * Marks a post as reviewed from within the editor and returns the resulting
 * review state. Mirrors the frontend verify flow, but is authenticated by
 * capability instead of a review token.
 */
class MarkReviewedController
{
	private ReviewStatusController $reviewStatusController;

	public function __construct(
		?ReviewStatusController $reviewStatusController = null
	) {
		$this->reviewStatusController = $reviewStatusController ?? new ReviewStatusController();
	}

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$postId = (int) $request->get_param('post_id');

		$reviewItem = new ReviewItem(get_post($postId));
		$reviewItem->markAsReviewed();

		return new WP_REST_Response($this->reviewStatusController->getStatus($postId));
	}
}
