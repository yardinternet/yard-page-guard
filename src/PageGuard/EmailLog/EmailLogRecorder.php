<?php

declare(strict_types=1);

namespace Yard\PageGuard\EmailLog;

/**
 * Creates a {@see EmailLog::POST_TYPE} entry for every mail the plugin sends.
 *
 * Decoupled from {@see \Yard\PageGuard\Traits\Email} via the `ypg/email_sent`
 * action — the trait fires the event, this recorder subscribes. Lets other
 * code disable logging by removing the hook, and keeps the trait free of
 * persistence concerns.
 */
final class EmailLogRecorder
{
	public function register(): void
	{
		add_action('ypg/email_sent', [$this, 'record'], 10, 6);
	}

	/**
	 * @param array<int,string>   $headers
	 * @param array<string,mixed> $context Optional metadata — currently looks for
	 *                                     an `items` key with the list of review
	 *                                     items the mail concerned.
	 */
	public function record(bool $sent, string $to, string $subject, string $message, array $headers, array $context = []): void
	{
		$meta = [
			EmailLog::META_RECIPIENT => $to,
			EmailLog::META_STATUS => $sent ? EmailLog::STATUS_SENT : EmailLog::STATUS_FAILED,
			EmailLog::META_HEADERS => $headers,
		];

		if (! empty($context['items']) && is_array($context['items'])) {
			$meta[EmailLog::META_ITEMS] = $context['items'];
		}

		wp_insert_post([
			'post_type' => EmailLog::POST_TYPE,
			'post_status' => 'publish',
			'post_title' => '' !== $subject ? $subject : __('(geen onderwerp)', 'yard-page-guard'),
			'post_content' => $message,
			'meta_input' => $meta,
		], true);
	}
}
