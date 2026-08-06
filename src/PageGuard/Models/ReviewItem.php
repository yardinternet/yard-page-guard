<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\ReminderTimeType;
use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\Token;

class ReviewItem
{
	use Token;

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

	public function reviewDateType(): string
	{
		return get_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, true) ?: ReviewDateType::DEFAULT;
	}

	public function reminderTimeType(): string
	{
		return get_post_meta($this->ID(), Meta::REMINDER_TIME_TYPE, true) ?: ReminderTimeType::DEFAULT;
	}

	public function reminderTimePeriod(): ?int
	{
		$period = get_post_meta($this->ID(), Meta::REMINDER_TIME_PERIOD, true);

		return '' !== $period ? (int) $period : null;
	}

	public function reminderTimeUnit(): ?string
	{
		return get_post_meta($this->ID(), Meta::REMINDER_TIME_UNIT, true) ?: null;
	}

	public function reviewLink(): string
	{
		$permalink = get_permalink($this->ID());

		if (false === $permalink) {
			return '';
		}

		$ownerEmail = $this->contentOwner() ? $this->contentOwner()->email() : '';
		$reviewDate = $this->reviewDateFormatted('Y-m-d');

		try {
			$token = $this->generateReviewToken($this->ID(), $ownerEmail, $reviewDate);
		} catch (\RuntimeException $e) {
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

	public function lastReviewDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::LAST_REVIEW_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function lastReviewDateFormatted(?string $format = null): string
	{
		if (! $this->lastReviewDate()) {
			return '&mdash;';
		}
		$format = $format ?? get_option('date_format', 'd-m-Y');

		return wp_date($format, $this->lastReviewDate()->getTimestamp());
	}

	public function reviewDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REVIEW_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reviewDateFormatted(?string $format = null): string
	{
		if ($this->reviewDate() === null) {
			return '&mdash;';
		}
		$format = $format ?? get_option('date_format', 'd-m-Y');

		return wp_date($format, $this->reviewDate()->getTimestamp());
	}

	public function reminderDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REMINDER_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reminderDateFormatted(?string $format = null): string
	{
		if (! $this->reminderDate()) {
			return '&mdash;';
		}
		$format = $format ?? get_option('date_format', 'd-m-Y');

		return wp_date($format, $this->reminderDate()->getTimestamp());
	}

	public function contentOwner(): ?ContentOwner
	{
		$id = (int) get_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_ID, true);
		if (0 === $id) {
			return null;
		}

		$type = get_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_TYPE, true);
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

	public function status(): string
	{
		$date = get_post_meta($this->ID(), Meta::REVIEW_DATE, true);
		$date = \DateTime::createFromFormat('Y-m-d', $date, wp_timezone());
		if (false === $date) {
			return '&mdash;';
		}
		if ($date->format('Y-m-d') < (new \DateTime('now', wp_timezone()))->format('Y-m-d')) {
			return sprintf(
				'<span style="color: #bd8600;"><span class="dashicons dashicons-warning" aria-hidden="true"></span> %s</span>',
				__('Achterstallig', 'yard-page-guard')
			);
		} else {
			return __('Gecontroleerd', 'yard-page-guard');
		}
	}

	public function setReviewMailSent(): void
	{
		update_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT, '1');
	}

	public function markAsReviewed(): void
	{
		update_post_meta($this->ID(), Meta::LAST_REVIEW_DATE, current_time('Y-m-d'));
		update_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, ReviewDateType::DEFAULT);
		$this->setReviewDate();

		delete_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT);
		delete_post_meta($this->ID(), Meta::LAST_REMINDER_DATE);
		delete_post_meta($this->ID(), Meta::REMINDER_DATE);
	}

	public function removeMetaData(): void
	{
		delete_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_ID);
		delete_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_TYPE);
		delete_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE);
		delete_post_meta($this->ID(), Meta::REVIEW_DATE);
		delete_post_meta($this->ID(), Meta::REMINDER_TIME_TYPE);
		delete_post_meta($this->ID(), Meta::REMINDER_TIME_PERIOD);
		delete_post_meta($this->ID(), Meta::REMINDER_TIME_UNIT);
		delete_post_meta($this->ID(), Meta::REMINDER_DATE);
		delete_post_meta($this->ID(), Meta::LAST_REMINDER_DATE);
		delete_post_meta($this->ID(), Meta::LAST_REVIEW_DATE);
		delete_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT);
	}

	public function setLastReminderDate(\DateTimeInterface $date): void
	{
		update_post_meta($this->ID(), Meta::LAST_REMINDER_DATE, $date->format('Y-m-d'));
	}

	public function setReminderDate(): void
	{
		if (ReminderTimeType::CUSTOM === $this->reminderTimeType()) {
			$reminderPeriod = $this->reminderTimePeriod();
			$reminderUnit = $this->reminderTimeUnit();
		} else {
			$reminderPeriod = get_option(Settings::REMINDER_TIME_PERIOD, 1);
			$reminderUnit = get_option(Settings::REMINDER_TIME_UNIT, 'weeks');
		}
		$reminderInterval = \DateInterval::createFromDateString("{$reminderPeriod} {$reminderUnit}");
		$date = (new \DateTime('now', wp_timezone()))->add($reminderInterval);
		update_post_meta($this->ID(), Meta::REMINDER_DATE, $date->format('Y-m-d'));
	}

	public function setReviewDate(string $type = ReviewDateType::DEFAULT, ?\DateTimeInterface $reviewDate = null): void
	{
		update_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, $type);
		if (ReviewDateType::DEFAULT === $type) {
			$reviewTimePeriod = get_option(Settings::REVIEW_TIME_PERIOD, 1);
			$reviewTimeUnit = get_option(Settings::REVIEW_TIME_UNIT, 'weeks');

			$dateTimePeriod = \DateInterval::createFromDateString("{$reviewTimePeriod} {$reviewTimeUnit}");
			$reviewDate = (new \DateTime('now', wp_timezone()))->add($dateTimePeriod);
		}
		update_post_meta($this->ID(), Meta::REVIEW_DATE, $reviewDate->format('Y-m-d'));
	}

	public function setContentOwner(int $id, string $type): void
	{
		update_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_ID, $id);
		update_post_meta($this->ID(), Meta::POST_CONTENT_OWNER_TYPE, $type);
	}

	public function setReminderTime(string $type, ?int $period, ?string $unit): void
	{
		update_post_meta($this->ID(), Meta::REMINDER_TIME_TYPE, $type);
		if (ReminderTimeType::DEFAULT === $type) {
			delete_post_meta($this->ID(), Meta::REMINDER_TIME_PERIOD);
			delete_post_meta($this->ID(), Meta::REMINDER_TIME_UNIT);
		} else {
			update_post_meta($this->ID(), Meta::REMINDER_TIME_PERIOD, $period);
			update_post_meta($this->ID(), Meta::REMINDER_TIME_UNIT, $unit);
		}
	}
}
