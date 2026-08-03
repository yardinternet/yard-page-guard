<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use DateTime;
use DateTimeZone;
use RuntimeException;
use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Token;

class ReviewItem
{
	use Token;
	use Date;

	protected WP_Post $item;

	public function __construct(WP_Post $post)
	{
		$this->item = $post;
	}

	public function ID(): int
	{
		return $this->item->ID;
	}

	public function title(): string
	{
		return $this->item->post_title;
	}

	public function postAuthor(): string
	{
		return $this->item->post_author;
	}

	public function postType(): string
	{
		return $this->item->post_type;
	}

	public function reviewLink(): string
	{
		$permalink = get_permalink($this->ID());

		if (false === $permalink) {
			return '';
		}

		$ownerEmail = get_post_meta($this->ID(), PostMeta::POST_CONTENT_OWNER_EMAIL, true) ?? '';
		$reviewDate = get_post_meta($this->ID(), PostMeta::REVIEW_DATE, true) ?? '';

		try {
			$token = $this->generateReviewToken($this->ID(), $ownerEmail, $reviewDate);
		} catch (RuntimeException $e) {
			return $permalink;
		}

		$permalink = add_query_arg('ypg_review_token', $token, $permalink);

		$home = home_url();

		if (strpos($home, 'pdc') !== false) {
			$permalink = add_query_arg('external', 'pdc', $permalink);
			$permalink = add_query_arg('post_id', $this->ID(), $permalink);
		} elseif (strpos($home, 'pub') !== false) {
			$permalink = add_query_arg('external', 'pub', $permalink);
			$permalink = add_query_arg('post_id', $this->ID(), $permalink);
		}

		return $permalink;
	}

	public function reviewDate(string $format = 'd-m-Y'): string
	{
		$date = get_post_meta($this->ID(), PostMeta::REVIEW_DATE, true);

		if (! $this->isValidDate($date)) {
			return __('Niet ingesteld', 'yard-page-guard');
		}

		$date = new DateTime($date, new DateTimeZone(wp_timezone_string()));

		return $date->format($format);
	}

	public function reminderDate(string $format = 'd-m-Y'): string
	{
		$date = get_post_meta($this->ID(), PostMeta::REMINDER_DATE, true);

		if (! $this->isValidDate($date)) {
			return __('Niet ingesteld', 'yard-page-guard');
		}

		$date = new DateTime($date, new DateTimeZone(wp_timezone_string()));

		return $date->format($format);
	}

	public function contentOwner(): ?ContentOwner
	{
		$id = (int) get_post_meta($this->ID(), PostMeta::POST_CONTENT_OWNER_ID, true);
		if (0 === $id) {
			return null;
		}

		$type = get_post_meta($this->ID(), PostMeta::POST_CONTENT_OWNER_TYPE, true);
		if (ContentOwnerType::USER === $type) {
			$user = get_user_by('id',  $id);
			if ($user) {
				$name = $user->display_name;
				$email = $user->user_email;
			} else {
				$name = '';
				$email = '';
			}
		} else {
			$name = get_term_field('name', $id, 'ypg_external_content_owner');
			$email = get_term_meta($id, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true);
		}

		return new ContentOwner((int) $id, $name, $email, $type);
	}
}
