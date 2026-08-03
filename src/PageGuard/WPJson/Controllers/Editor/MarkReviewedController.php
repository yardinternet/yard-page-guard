<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Traits\Date;

/**
 * Marks a post as reviewed from within the editor and returns the resulting
 * review state. Mirrors the frontend verify flow, but is authenticated by
 * capability instead of a review token.
 */
class MarkReviewedController
{
	use Date;

	private ReviewStatusController $reviewStatusController;

	public function __construct(?ReviewStatusController $reviewStatusController = null)
	{
		$this->reviewStatusController = $reviewStatusController ?? new ReviewStatusController();
	}

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$postId = (int) $request->get_param('post_id');

		update_post_meta($postId, PostMeta::REVIEW_DATE, $this->computeReviewDate($postId));
		update_post_meta($postId, PostMeta::LAST_REVIEW_DATE, current_time('Y-m-d'));

		// Deprecated, but the overview columns still read it. Kept in sync with the frontend verify flow.
		update_post_meta($postId, PostMeta::IS_VERIFIED, '1');

		delete_post_meta($postId, PostMeta::REVIEW_MAIL_SENT);
		delete_post_meta($postId, PostMeta::LAST_REMINDER_DATE);

		return new WP_REST_Response($this->reviewStatusController->getStatus($postId));
	}
}
