<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers;

use WP_REST_Request;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;
use Yard\PageGuard\Traits\Token;

class VerifyPostController
{
	use Date;
	use Text;
	use Token;

	/**
	 * Updates a post's meta so it gets verified and receives its next review and reminder dates.
	 * Returns a HTML response since it gets handled by htmx on the frontend.
	 */
	public function handleRequest(WP_REST_Request $request): void
	{
		$postId = (int) $request->get_param('post_id');
		$newReviewDate = $this->computeReviewDate($postId);
		$newReminderDate = $this->computeReminderDate($postId);

		$updatedReviewDate = update_post_meta($postId, 'ypg_review_date', $newReviewDate);
		$updatedReminderDate = update_post_meta($postId, 'ypg_reminder_date', $newReminderDate);
		$updatedVerifiedStatus = update_post_meta($postId, 'ypg_is_verified', 1);
		$updatedLastReviewDate = update_post_meta($postId, 'ypg_last_review_date', date('Y-m-d'));

		header('Content-Type: text/html; charset=utf-8');
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, HX-Current-URL, HX-Request');

		if ($updatedReviewDate && $updatedReminderDate && $updatedVerifiedStatus && $updatedLastReviewDate) {
			http_response_code(200);
			echo self::getSuccessResponse();

			exit();
		}

		error_log("[yard-page-guard] Failed to process review for post ID: $postId");
		http_response_code(200); # HTML needs to be returned properly, so no 500.
		echo self::getErrorResponse();

		exit();
	}

	public static function getSuccessResponse(): string
	{
		$message = __('De pagina is succesvol gecontroleerd!', 'yard-page-guard');

		$html = <<<HTML
            <div class="ypg-alert ypg-success">
                <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="45.5" cy="45.5" r="45.5" fill="currentColor"/>
                    <path fill="#fff" d="M68.0508 32.2617C69.4473 33.5508 69.4473 35.8066 68.0508 37.0957L40.5508 64.5957C39.2617 65.9922 37.0059 65.9922 35.7168 64.5957L21.9668 50.8457C20.5703 49.5566 20.5703 47.3008 21.9668 46.0117C23.2559 44.6152 25.5117 44.6152 26.8008 46.0117L38.1875 57.291L63.2168 32.2617C64.5059 30.8652 66.7617 30.8652 68.0508 32.2617Z"/>
                </svg>

                <p>$message</p>
            </div>
        HTML;

		return self::minifyHtml($html);
	}

	public static function getErrorResponse(): string
	{
		$message = __('Er is iets misgegaan.', 'yard-page-guard');

		$html = <<<HTML
			<div class="ypg-alert ypg-error">
				<svg width="91" height="91" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 91 91">
					<circle cx="45.5" cy="45.5" r="45.5" fill="currentColor"/>
					<path fill="#fff" d="M61.738 35.096 50.46 46.375l11.28 11.387c1.396 1.289 1.396 3.545 0 4.834-1.29 1.396-3.546 1.396-4.835 0l-11.279-11.28-11.387 11.28c-1.289 1.396-3.545 1.396-4.834 0-1.396-1.29-1.396-3.545 0-4.834l11.28-11.387-11.28-11.28c-1.396-1.288-1.396-3.544 0-4.833 1.29-1.397 3.545-1.397 4.834 0L45.625 41.54l11.28-11.28c1.288-1.396 3.544-1.396 4.833 0 1.397 1.29 1.397 3.546 0 4.835"/>
				</svg>

				<p>$message</p>
			</div>
		HTML;

		return self::minifyHtml($html);
	}
}
