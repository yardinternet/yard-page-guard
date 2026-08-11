<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers;

use DateTimeInterface;
use WP_REST_Controller;
use WP_REST_Response;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\ContentOwners;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\EditorPermissions;

class EditorController extends WP_REST_Controller
{
	use Date;
	use EditorPermissions;
	use ContentOwners;

	protected $namespace = 'yard/page-guard/v2';

	protected string $base = 'editor';

	public function register_routes(): void
	{
		register_rest_route($this->namespace, '/' . $this->base . '/content-owners', [
			'methods' => \WP_REST_Server::READABLE,
			'callback' => [$this, 'contentOwners'],
			'permission_callback' => [$this, 'canView'],
		]);

		register_rest_route($this->namespace, '/' . $this->base . '/defaults', [
			'methods' => \WP_REST_Server::READABLE,
			'callback' => [$this, 'defaults'],
			'permission_callback' => [$this, 'canView'],
		]);

		register_rest_route($this->namespace, '/' . $this->base . '/review-status/(?P<post_id>\d+)', [
			'methods' => \WP_REST_Server::READABLE,
			'callback' => [$this, 'reviewStatus'],
			'permission_callback' => [$this, 'canEditPost'],
			'args' => [
				'post_id' => [
					'description' => __('The ID of the post to get the review status for.', 'yard-page-guard'),
					'type' => 'integer',
					'required' => true,
				],
			],
		]);

		register_rest_route($this->namespace, '/' . $this->base . '/mark-reviewed/(?P<post_id>\d+)', [
			'methods' => \WP_REST_Server::CREATABLE,
			'callback' => [$this, 'markAsReviewed'],
			'permission_callback' => [$this, 'canEditPost'],
			'args' => [
				'post_id' => [
					'description' => __('The ID of the post to mark as reviewed.', 'yard-page-guard'),
					'type' => 'integer',
					'required' => true,
				],
			],
		]);
	}

	public function canView(): bool
	{
		return current_user_can($this->adminCapability());
	}

	public function canEditPost(\WP_REST_Request $request): bool
	{
		$postId = (int) $request->get_param('post_id');

		return $this->canView() && current_user_can('edit_post', $postId);
	}

	public function contentOwners(): WP_REST_Response
	{
		$owners = array_map(
			fn (ContentOwner $owner): array => ['value' => sprintf('%s:%d', $owner->type(), $owner->id()), 'label' => $owner->displayName()],
			$this->getContentOwners()
		);

		return new WP_REST_Response($owners);
	}

	public function defaults(): WP_REST_Response
	{
		return new WP_REST_Response([
			'review' => $this->period(
				(int) get_option(Settings::REVIEW_TIME_PERIOD),
				(string) get_option(Settings::REVIEW_TIME_UNIT)
			),
			'reminder' => $this->period(
				(int) get_option(Settings::REMINDER_TIME_PERIOD),
				(string) get_option(Settings::REMINDER_TIME_UNIT)
			),
		]);
	}
	/**
	 * @return array<string, mixed>
	 */
	private function period(int $period, string $unit): array
	{
		$reminderInterval = \DateInterval::createFromDateString("{$period} {$unit}");
		$date = (new \DateTime('now', wp_timezone()))->add($reminderInterval);

		//TODO: wat wordt hiervan echt gebruikt? label, date, formatted?
		return [
			'period' => $period,
			'unit' => $unit,
			'label' => $this->formatPeriod($period, $unit),
			'date' => $date->format('Y-m-d'),
			'formatted' => wp_date(get_option('date_format', 'd-m-Y'),  $date->getTimestamp()),
		];
	}

	public function reviewStatus(\WP_REST_Request $request)
	{
		$postId = (int) $request->get_param('post_id');
		$post = get_post($postId);
		if (! $post instanceof \WP_Post) {
			return new \WP_Error(
				'ypg_post_not_found',
				__('Post niet gevonden.', 'yard-page-guard'),
				['status' => \WP_Http::NOT_FOUND]
			);
		}

		$reviewItem = new ReviewItem($post);

		return [
			'reviewDate' => $this->datePayload($reviewItem->reviewDate()),
			'reminderDate' => $this->datePayload($reviewItem->reminderDate()),
			'lastReviewDate' => $this->datePayload($reviewItem->lastReviewDate()),
			'isOverdue' => $reviewItem->isOverdue(),
			'reviewMailSent' => $reviewItem->reviewMailSent(),
		];
	}

	private function datePayload(?DateTimeInterface $date): array
	{
		return [
			'date' => $date ? $date->format('Y-m-d') : null,
			'formatted' => $date ? wp_date(get_option('date_format', 'd-m-Y'), $date->getTimestamp()) : null,
		];
	}

	public function markAsReviewed(\WP_REST_Request $request)
	{
		$postId = (int) $request->get_param('post_id');

		$reviewItem = new ReviewItem(get_post($postId));
		if (! $reviewItem->markAsReviewed()) {
			return new \WP_Error(
				'ypg_review_not_marked',
				__('De post kon niet gemarkeerd worden als gecontroleerd.', 'yard-page-guard'),
				['status' => \WP_Http::CONFLICT]
			);
		}

		return $this->reviewStatus($request);
	}
}
