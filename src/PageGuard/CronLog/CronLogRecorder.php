<?php

declare(strict_types=1);

namespace Yard\PageGuard\CronLog;

use WP_Post;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\WPCron\Events\ReminderNotification;
use Yard\PageGuard\WPCron\Events\ReviewNotification;

/**
 * Writes a {@see CronLog::POST_TYPE} entry for every `ypg_site_cron` run.
 *
 * Brackets the run: the due-item snapshot happens before the notification
 * events fire (they mutate the very meta the due-queries match on, so a later
 * snapshot would see an empty list), mails are tallied via `ypg/email_sent`
 * while the events run, and the entry is persisted afterwards. Because the
 * snapshot is independent of sending, runs with mail sending disabled still
 * log what *would* have been mailed.
 */
final class CronLogRecorder
{
	/** @var array<int,array{id:int,title:string,date:string,reminder_count:int}> */
	private array $reviewDue = [];

	/** @var array<int,array{id:int,title:string,date:string,reminder_count:int}> */
	private array $reminderDue = [];

	private bool $emailsEnabled = true;

	private int $sent = 0;

	private int $failed = 0;

	public function register(): void
	{
		add_action('ypg_site_cron', [$this, 'start'], 1);
		add_action('ypg_site_cron', [$this, 'finish'], 999);
	}

	public function start(): void
	{
		$this->emailsEnabled = (bool) get_option('ypg_emails_enabled', true);
		$this->reviewDue = $this->mapItems(ReviewNotification::dueItems(), true);
		$this->reminderDue = $this->mapItems(ReminderNotification::dueItems(), false);
		$this->sent = 0;
		$this->failed = 0;

		// Only listen while the cron run is in flight so mails sent outside a
		// run (if any ever exist) don't leak into its tallies.
		add_action('ypg/email_sent', [$this, 'tally']);
	}

	public function tally(bool $sent): void
	{
		$sent ? $this->sent++ : $this->failed++;
	}

	public function finish(): void
	{
		remove_action('ypg/email_sent', [$this, 'tally']);

		wp_insert_post([
			'post_type' => CronLog::POST_TYPE,
			'post_status' => 'publish',
			'post_title' => sprintf('%s - %s', __('Controle', 'yard-page-guard'), current_time('d-m-Y H:i')),
			'meta_input' => [
				CronLog::META_EMAILS_ENABLED => $this->emailsEnabled ? 1 : 0,
				CronLog::META_REVIEW_DUE => $this->reviewDue,
				CronLog::META_REMINDER_DUE => $this->reminderDue,
				CronLog::META_MAILS_SENT => $this->sent,
				CronLog::META_MAILS_FAILED => $this->failed,
			],
		], true);
	}

	/**
	 * Flatten due posts into the shape stored on the log entry. The reminder
	 * count is read at snapshot time, i.e. before this run sends anything.
	 *
	 * @param WP_Post[] $posts
	 *
	 * @return array<int,array{id:int,title:string,date:string,reminder_count:int}>
	 */
	private function mapItems(array $posts, bool $useReviewDate): array
	{
		return array_map(static function (WP_Post $post) use ($useReviewDate): array {
			$item = new ReviewItem($post);

			return [
				'id' => $item->ID(),
				'title' => $item->title(),
				'date' => $useReviewDate ? $item->reviewDate() : $item->reminderDate(),
				'reminder_count' => (int) get_post_meta($item->ID(), 'ypg_reminder_count', true),
			];
		}, $posts);
	}
}
