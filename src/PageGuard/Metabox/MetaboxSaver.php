<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Meta;
use Yard\PageGuard\Traits\Text;

/**
 * Persists the Page Guard metabox form on `save_post`.
 *
 * Responsible solely for writing post meta — rendering lives in
 * {@see MetaboxRenderer} and the third-party "internal data" sync lives in
 * {@see InternalDataSync}.
 */
final class MetaboxSaver
{
	use Date;
	use Text;
	use Meta;

	private MetaboxAccess $access;

	public function __construct(MetaboxAccess $access)
	{
		$this->access = $access;
	}

	public function saveMetaValues(int $postId): void
	{
		if (! $this->access->shouldSave($postId)) {
			return;
		}

		if (! isset($_POST['ypg_post_content_owner'])) {
			return;
		}

		$contentOwner = sanitize_text_field($_POST['ypg_post_content_owner']);

		if ('none' === $contentOwner) {
			$this->clearReviewMeta($postId);

			return;
		}

		$this->writeOwnerMeta($postId, $this->parseContentOwnerData($contentOwner));

		$wasPreviouslyVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
		$toBeVerified = isset($_POST['ypg_is_verified']);

		// Remove mail sent status if verified (date will update) OR post is manually being unverified
		if ($toBeVerified || ! $toBeVerified && $wasPreviouslyVerified) {
			delete_post_meta($postId, 'ypg_review_mail_sent');
			delete_post_meta($postId, 'ypg_last_reminder_date');
			delete_post_meta($postId, 'ypg_reminder_count');
		}

		if ('custom' === ($_POST['ypg_reminder_type'] ?? 'standard')) {
			update_post_meta($postId, 'ypg_reminder_time_period', $_POST['ypg_reminder_time_period']);
			update_post_meta($postId, 'ypg_reminder_time_unit', $_POST['ypg_reminder_time_unit']);
		} else {
			delete_post_meta($postId, 'ypg_reminder_time_period');
			delete_post_meta($postId, 'ypg_reminder_time_unit');
		}

		$reviewDate = $this->computeReviewDate($postId, $toBeVerified, $wasPreviouslyVerified);
		$reminderDate = $this->computeReminderDate($postId, $toBeVerified, $wasPreviouslyVerified, $reviewDate);

		$this->updateVerificationMeta($postId, $toBeVerified, $reviewDate, $reminderDate);
	}

	private function writeOwnerMeta(int $postId, ContentOwner $owner): void
	{
		update_post_meta($postId, 'ypg_post_content_owner_id', $owner->id());
		update_post_meta($postId, 'ypg_post_content_owner_name', $owner->name());
		update_post_meta($postId, 'ypg_post_content_owner_email', $owner->email());
		update_post_meta($postId, 'ypg_post_content_owner_type', $owner->type());
		update_post_meta($postId, 'ypg_post_content_owner_phone_number', $owner->phoneNumber());
	}

	private function updateVerificationMeta(int $postId, bool $isVerified, string $reviewDate, string $reminderDate): void
	{
		update_post_meta($postId, 'ypg_is_verified', (int) $isVerified);
		update_post_meta($postId, 'ypg_review_date', $reviewDate);
		update_post_meta($postId, 'ypg_reminder_date', $reminderDate);

		if ($isVerified) {
			update_post_meta($postId, 'ypg_last_review_date', date('Y-m-d'));
		}
	}
}
