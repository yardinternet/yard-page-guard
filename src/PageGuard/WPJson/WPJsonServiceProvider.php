<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson;

use RuntimeException;
use WP_Error;
use WP_REST_Request;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\Token;
use Yard\PageGuard\WPJson\Controllers\ModalInfoController;
use Yard\PageGuard\WPJson\Controllers\VerifyPostController;

class WPJsonServiceProvider extends ServiceProvider
{
	use Token;

	public function register(): void
	{
		add_action('rest_api_init', function () {
			register_rest_route('yard-page-guard/v1', '/verify-post', [
				'methods' => 'POST',
				'callback' => [new VerifyPostController(), 'handleRequest'],
				'args' => $this->getEndpointArgs(),
				'permission_callback' => '__return_true',
			]);

			register_rest_route('yard-page-guard/v1', '/modal-info', [
				'methods' => 'POST',
				'callback' => [new ModalInfoController(), 'handleRequest'],
				'args' => $this->getEndpointArgs(),
				'permission_callback' => '__return_true',
			]);

			// Allow all origins and HTMX headers
			// No type hinting for $served on purpose because the bool type in the documentation isn't always the case (null in admin dashboard sometimes).
			add_filter('rest_pre_serve_request', function ($served) {
				if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/yard-page-guard') !== false) {
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, HX-Current-URL, HX-Request');
				}

				return $served;
			});
		});
	}

	public function getEndpointArgs(): array
	{
		return [
			'post_id' => [
				'required' => true,
				'type' => 'integer',
				'validate_callback' => function (int $postId) {
					if (get_post_status($postId) === false) {
						return new WP_Error(
							'invalid_post_id',
							__('Ongeldige post ID', 'yard-page-guard')
						);
					}

					return true;
				},
			],
			'ypg_review_token' => [
				'required' => true,
				'type' => 'string',
				'validate_callback' => function (string $reviewToken, WP_REST_Request $request, string $param) {
					$postId = (int) $request->get_param('post_id');
					$contentOwnerEmail = get_post_meta($postId, 'ypg_post_content_owner_email', true) ?: '';
					$reviewDate = get_post_meta($postId, 'ypg_review_date', true) ?: '';
					if ('' === $contentOwnerEmail || '' === $reviewDate) {
						return false;
					}

					try {
						return $this->verifyReviewToken($postId, $contentOwnerEmail, $reviewDate, $reviewToken);
					} catch (RuntimeException $e) {
						return new WP_Error(
							'review_token_verification_error',
							__('Review token verification is not configured correctly.', 'yard-page-guard'),
							['status' => 500]
						);
					}
				},
			],
		];
	}
}
