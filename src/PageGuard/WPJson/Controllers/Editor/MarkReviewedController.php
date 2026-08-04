<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Meta\ReviewScheduler;

/**
 * Marks a post as reviewed from within the editor and returns the resulting
 * review state. Mirrors the frontend verify flow, but is authenticated by
 * capability instead of a review token.
 */
class MarkReviewedController
{
	private ReviewStatusController $reviewStatusController;
	private ReviewScheduler $scheduler;

	public function __construct(
		?ReviewStatusController $reviewStatusController = null,
		?ReviewScheduler $scheduler = null
	) {
		$this->reviewStatusController = $reviewStatusController ?? new ReviewStatusController();
		$this->scheduler = $scheduler ?? new ReviewScheduler();
	}

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$postId = (int) $request->get_param('post_id');

		$this->scheduler->markReviewed($postId);

		return new WP_REST_Response($this->reviewStatusController->getStatus($postId));
	}
}
