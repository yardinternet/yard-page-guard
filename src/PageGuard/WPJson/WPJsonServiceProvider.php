<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson;

use RuntimeException;
use WP_Error;
use WP_REST_Request;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\EditorPermissions;
use Yard\PageGuard\Traits\Token;
use Yard\PageGuard\WPJson\Controllers\Editor\ContentOwnersController;
use Yard\PageGuard\WPJson\Controllers\Editor\DefaultsController;
use Yard\PageGuard\WPJson\Controllers\Editor\MarkReviewedController;
use Yard\PageGuard\WPJson\Controllers\Editor\ReviewStatusController;
use Yard\PageGuard\WPJson\Controllers\ModalInfoController;
use Yard\PageGuard\WPJson\Controllers\VerifyPostController;

class WPJsonServiceProvider extends ServiceProvider
{
	use EditorPermissions;
	use Token;

	public const NAMESPACE = 'yard-page-guard/v1';

	/**
	 * Routes that are called from the frontend by htmx, on a possibly different
	 * origin, and are authenticated by review token instead of by cookie.
	 */
	private const PUBLIC_ROUTES = [
		'/verify-post',
		'/modal-info',
	];

	public function register(): void
	{
		add_action('rest_api_init', function () {
			$this->registerPublicRoutes();
			$this->registerEditorRoutes();
			$this->allowCrossOriginForPublicRoutes();
		});
	}

	private function registerPublicRoutes(): void
	{
		register_rest_route(self::NAMESPACE, '/verify-post', [
			'methods' => 'POST',
			'callback' => [new VerifyPostController(), 'handleRequest'],
			'args' => $this->getEndpointArgs(),
			'permission_callback' => '__return_true',
		]);

		register_rest_route(self::NAMESPACE, '/modal-info', [
			'methods' => 'POST',
			'callback' => [new ModalInfoController(), 'handleRequest'],
			'args' => $this->getEndpointArgs(),
			'permission_callback' => '__return_true',
		]);
	}

	/**
	 * Routes consumed by the block editor sidebar. Authenticated by capability,
	 * so they are same origin only (cookie + REST nonce).
	 */
	private function registerEditorRoutes(): void
	{
		register_rest_route(self::NAMESPACE, '/editor/content-owners', [
			'methods' => 'GET',
			'callback' => [new ContentOwnersController(), 'handleRequest'],
			'permission_callback' => fn () => $this->requireManage(),
		]);

		register_rest_route(self::NAMESPACE, '/editor/defaults', [
			'methods' => 'GET',
			'callback' => [new DefaultsController(), 'handleRequest'],
			'permission_callback' => fn () => $this->requireManage(),
		]);

		register_rest_route(self::NAMESPACE, '/editor/review-status/(?P<post_id>\d+)', [
			'methods' => 'GET',
			'callback' => [new ReviewStatusController(), 'handleRequest'],
			'args' => $this->getPostIdArg(),
			'permission_callback' => fn (WP_REST_Request $request) => $this->requirePostAccess($request),
		]);

		register_rest_route(self::NAMESPACE, '/editor/mark-reviewed/(?P<post_id>\d+)', [
			'methods' => 'POST',
			'callback' => [new MarkReviewedController(), 'handleRequest'],
			'args' => $this->getPostIdArg(),
			'permission_callback' => fn (WP_REST_Request $request) => $this->requirePostAccess($request),
		]);
	}

	/**
	 * @return true|WP_Error
	 */
	private function requireManage()
	{
		if ($this->canManage()) {
			return true;
		}

		return $this->forbidden();
	}

	/**
	 * @return true|WP_Error
	 */
	private function requirePostAccess(WP_REST_Request $request)
	{
		if ($this->canEditPost((int) $request->get_param('post_id'))) {
			return true;
		}

		return $this->forbidden();
	}

	private function forbidden(): WP_Error
	{
		return new WP_Error(
			'ypg_rest_forbidden',
			__('Je hebt geen rechten om de inhoudscontrole van deze pagina te bekijken of te wijzigen.', 'yard-page-guard'),
			['status' => rest_authorization_required_code()]
		);
	}

	private function getPostIdArg(): array
	{
		return [
			'post_id' => [
				'required' => true,
				'type' => 'integer',
				'validate_callback' => function ($postId) {
					if (get_post_status((int) $postId) === false) {
						return new WP_Error(
							'invalid_post_id',
							__('Ongeldige post ID', 'yard-page-guard')
						);
					}

					return true;
				},
			],
		];
	}

	/**
	 * Only the public routes are reachable cross origin. The editor routes rely on
	 * cookie authentication, so they must not be exposed to other origins.
	 */
	private function allowCrossOriginForPublicRoutes(): void
	{
		// No type hinting for $served on purpose because the bool type in the documentation isn't always the case (null in admin dashboard sometimes).
		add_filter('rest_pre_serve_request', function ($served) {
			if ($this->isPublicRouteRequest()) {
				header('Access-Control-Allow-Origin: *');
				header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, HX-Current-URL, HX-Request');
			}

			return $served;
		});
	}

	private function isPublicRouteRequest(): bool
	{
		$requestUri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';

		if ('' === $requestUri) {
			return false;
		}

		foreach (self::PUBLIC_ROUTES as $route) {
			if (strpos($requestUri, self::NAMESPACE . $route) !== false) {
				return true;
			}
		}

		return false;
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

					$reviewItem = new \Yard\PageGuard\Models\ReviewItem(get_post($postId));

					$contentOwnerEmail = $reviewItem->contentOwner() ? $reviewItem->contentOwner()->email() : '';
					$reviewDate = $reviewItem->reviewDate();
					if ('' === $contentOwnerEmail || null === $reviewDate) {
						return false;
					}

					try {
						return $this->verifyReviewToken($postId, $contentOwnerEmail, $reviewDate->format('Y-m-d'), $reviewToken);
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
