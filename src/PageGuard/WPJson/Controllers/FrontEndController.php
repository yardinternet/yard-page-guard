<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers;

use WP_REST_Controller;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;

class FrontEndController extends WP_REST_Controller
{
	protected $namespace = 'yard/page-guard/v2';

	public function register_routes(): void
	{
		register_rest_route($this->namespace, '/verify-post', [
			'methods' => \WP_REST_Server::CREATABLE,
			'validate_callback' => [$this, 'validateRequest'],
			'callback' => [$this, 'verifyPost'],
			'args' => $this->getArgs(),
			'permission_callback' => '__return_true',
		]);

		register_rest_route($this->namespace, '/modal-info', [
			'methods' => \WP_REST_Server::READABLE,
			'validate_callback' => [$this, 'validateRequest'],
			'callback' => [$this, 'modalInfo'],
			'args' => $this->getArgs(),
			'permission_callback' => '__return_true',
		]);
	}

	/** @return bool|\WP_Error */
	public function validateRequest(\WP_REST_Request $request)
	{
		$postId = (int) $request->get_param('post_id');
		$reviewToken = sanitize_text_field($request->get_param('token'));

		$post = get_post($postId);
		if (! $post instanceof \WP_Post) {
			return new \WP_Error(
				'ypg_post_not_found',
				__('Post niet gevonden.', 'yard-page-guard'),
				['status' => \WP_Http::NOT_FOUND]
			);
		}

		$reviewItem = new ReviewItem($post);
		if (! $reviewItem->verifyToken($reviewItem, home_url(), $reviewToken)) {
			return new \WP_Error(
				'ypg_invalid_token',
				__('Ongeldige review token.', 'yard-page-guard'),
				['status' => \WP_Http::CONFLICT]
			);
		}

		return true;
	}

	public function getArgs(): array
	{
		return [
			'post_id' => [
				'description' => 'The ID of the post to verify.',
				'type' => 'integer',
				'minimum' => 1,
				'required' => true,
			],
			'token' => [
				'description' => 'The review token for verifying the post.',
				'type' => 'string',
				'required' => true,
			],
		];
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function verifyPost(\WP_REST_Request $request)
	{
		$postId = (int) $request->get_param('post_id');
		$post = get_post($postId);
		$reviewItem = new ReviewItem($post);
		if (! $reviewItem->markAsReviewed()) {
			return new \WP_Error(
				'ypg_review_not_marked',
				__('De post kon niet gemarkeerd worden als gecontroleerd.', 'yard-page-guard'),
				['status' => \WP_Http::CONFLICT]
			);
		}

		return new \WP_REST_Response([
			'message' => __('Post gemarkeerd als gecontroleerd.', 'yard-page-guard'),
		], \WP_Http::OK);
	}

	public function modalInfo(\WP_REST_Request $request): \WP_REST_Response
	{
		$postId = (int) $request->get_param('post_id');
		$footer = trim(strip_tags(get_option(Settings::MODAL_FOOTER_CONTENT, ''))) !== '' ? wpautop(get_option(Settings::MODAL_FOOTER_CONTENT, '')) : null;

		return new \WP_REST_Response([
			'id' => $postId,
			'title' => get_the_title($postId),
			'footer' => $footer,
			'endpoint' => get_rest_url(null, $this->namespace . '/verify-post'),
		]);
	}
}
