<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\ReminderTimeType;
use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Token;

class ReviewItem
{
	use Date;
	use Token;

	protected WP_Post $item;

	public function __construct(WP_Post $post)
	{
		$this->item = $post;
	}

	public function post(): WP_Post
	{
		return $this->item;
	}

	public function ID(): int
	{
		return $this->item->ID;
	}

	public function reviewDateType(): string
	{
		return get_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, true);
	}

	public function reminderTimeType(): string
	{
		return get_post_meta($this->ID(), Meta::REMINDER_TIME_TYPE, true);
	}

	public function reminderTimePeriod(): int
	{
		return (int) get_post_meta($this->ID(), Meta::REMINDER_TIME_PERIOD, true);
	}

	public function reminderTimeUnit(): ?string
	{
		return get_post_meta($this->ID(), Meta::REMINDER_TIME_UNIT, true);
	}

	public function reviewLink(): string
	{
		$permalink = get_permalink($this->ID());

		if (false === $permalink) {
			return '';
		}

		$originSite = get_home_url();
		$reviewToken = $this->generateToken($this, $originSite);
		$permalink = add_query_arg('ypg_review_token', rawurlencode($reviewToken), $permalink); //TODO: constantes voor query args

		$permalink = add_query_arg('ypg_modal_info_endpoint', get_rest_url(null, 'yard/page-guard/v2/modal-info'), $permalink);
		$permalink = add_query_arg('ypg_post_id', $this->ID(), $permalink);

		return $permalink;
	}

	public function isOverdue(): bool
	{
		$reviewDate = $this->reviewDate();

		if (null === $reviewDate) {
			return false;
		}

		return $reviewDate->format('Y-m-d') < (new \DateTime('now', wp_timezone()))->format('Y-m-d');
	}

	public function lastReviewDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::LAST_REVIEW_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function lastReviewDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->lastReviewDate(), $format);
	}

	public function reviewDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REVIEW_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reviewDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->reviewDate(), $format);
	}

	public function reminderDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REMINDER_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reminderDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->reminderDate(), $format);
	}

	/** @deprecated Use reminderMailSentDate() instead */
	public function lastReminderDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::LAST_REMINDER_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	/** @deprecated Use reminderMailSentDateFormatted() instead */
	public function lastReminderDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->lastReminderDate(), $format);
	}

	public function reminderMailSentDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REMINDER_MAIL_SENT_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reminderMailSentDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->reminderMailSentDate(), $format);
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

			return $user ? ContentOwner::fromUser($user) : null;
		} else {
			$term = get_term($id, ExternalOwnerTaxonomy::TAXONOMY);

			return is_a($term, \WP_Term::class) ? ContentOwner::fromTerm($term) : null;
		}
	}

	public function status(): string
	{
		if ($this->isOverdue()) {
			return sprintf(
				'<span style="color: #bd8600;"><span class="dashicons dashicons-warning" aria-hidden="true"></span> %s</span>',
				__('Achterstallig', 'yard-page-guard')
			);
		}
		if (null === $this->lastReviewDate()) {
			return __('Ingesteld', 'yard-page-guard');
		} else {
			return __('Gecontroleerd', 'yard-page-guard');
		}
	}

	public function reviewMailSentDate(): ?\DateTimeInterface
	{
		$date = get_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT_DATE, true);

		return \DateTime::createFromFormat('Y-m-d', $date, wp_timezone()) ?: null;
	}

	public function reviewMailSentDateFormatted(?string $format = null): string
	{
		return $this->formatDate($this->reviewMailSentDate(), $format);
	}

	public function resetSentEmails(): void
	{
		delete_post_meta($this->ID(), Meta::REMINDER_MAIL_SENT_DATE);
		delete_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT_DATE);
	}

	public function markAsReviewed(): bool
	{
		update_post_meta($this->ID(), Meta::LAST_REVIEW_DATE, current_time('Y-m-d'));
		update_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, ReviewDateType::DEFAULT);
		$this->setReviewDate();

		delete_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT_DATE);
		delete_post_meta($this->ID(), Meta::REMINDER_MAIL_SENT_DATE);
		delete_post_meta($this->ID(), Meta::REMINDER_DATE);

		// TODO: do a more comprehensive check to see if the post was actually updated, and return false if not
		return $this->lastReviewDate()->format('Y-m-d') === (new \DateTime('now', wp_timezone()))->format('Y-m-d');
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
		delete_post_meta($this->ID(), Meta::LAST_REVIEW_DATE);
		delete_post_meta($this->ID(), Meta::REVIEW_MAIL_SENT_DATE);
		delete_post_meta($this->ID(), Meta::REMINDER_MAIL_SENT_DATE);
	}

	public function setReminderMailSentDate(\DateTimeInterface $date): void
	{
		update_post_meta($this->ID(), Meta::REMINDER_MAIL_SENT_DATE, $date->format('Y-m-d'));
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
		if (ReviewDateType::DEFAULT === $type || null === $reviewDate) {
			$type = ReviewDateType::DEFAULT;
			$reviewDate = $this->defaultReviewDate();
		}

		update_post_meta($this->ID(), Meta::REVIEW_DATE_TYPE, $type);
		update_post_meta($this->ID(), Meta::REVIEW_DATE, $reviewDate->format('Y-m-d'));
	}

	public function ensureReviewDate(): void
	{
		if (null === $this->contentOwner() || null !== $this->reviewDate()) {
			return;
		}

		$this->setReviewDate($this->reviewDateType());
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

	protected function formatDate(?\DateTimeInterface $date, ?string $format = null): string
	{
		if (! $date) {
			return '&mdash;';
		}
		$format = $format ?? get_option('date_format', 'd-m-Y');

		return wp_date($format, $date->getTimestamp());
	}
}
