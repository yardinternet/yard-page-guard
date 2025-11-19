<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson;

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
			$verifyPostController = new VerifyPostController();
			$modalInfoController = new ModalInfoController();

			register_rest_route('yard-page-guard/v1', '/verify-post', [
				'methods' => 'POST',
				'callback' => [$verifyPostController, 'handleRequest'],
				'args' => self::getEndpointArgs(),
				'permission_callback' => '__return_true',
			]);

			register_rest_route('yard-page-guard/v1', '/modal-info', [
				'methods' => 'POST',
				'callback' => [$modalInfoController, 'handleRequest'],
				'args' => self::getEndpointArgs(),
				'permission_callback' => '__return_true',
			]);

			// Allow all origins and HTMX headers
			add_filter('rest_pre_serve_request', function (bool $served) {
				if (strpos($_SERVER['REQUEST_URI'], '/wp-json/yard-page-guard') !== false) {
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, HX-Current-URL, HX-Request');
				}

				return $served;
			});
		});
	}

	public static function getEndpointArgs(): array
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
				'validate_callback' => function (string $reviewToken, WP_REST_Request $request): bool {
					$postId = (int) $request->get_param('post_id');
					$contentOwnerEmail = get_post_meta($postId, 'ypg_post_content_owner_email', true) ?? '';
					$reviewDate = get_post_meta($postId, 'ypg_review_date', true) ?? '';

					if ('' === $contentOwnerEmail || '' === $reviewDate) {
						return false;
					}

					return self::verifyReviewToken($postId, $contentOwnerEmail, $reviewDate, $reviewToken);
				},
			],
		];
	}
}
