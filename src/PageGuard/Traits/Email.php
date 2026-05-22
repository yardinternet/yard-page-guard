<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Models\ReviewItem;

trait Email
{
	use Date;

	/**
	 * Group ReviewItems by ContentOwner email.
	 *
	 * @param ReviewItem[] $items
	 */
	private function groupItemsByOwner(array $items): array
	{
		$groupedItems = [];

		foreach ($items as $item) {
			$contentOwner = $item->contentOwner();

			if (! $contentOwner || ! $contentOwner->email()) {
				continue;
			}

			$email = $contentOwner->email();

			if (! isset($groupedItems[$email])) {
				$groupedItems[$email] = [
					'owner' => $contentOwner,
					'items' => [],
				];
			}

			$groupedItems[$email]['items'][] = $item;
		}

		return $groupedItems;
	}

	/**
	 * Build common mail headers.
	 */
	private function buildMailHeaders(string $bccOptionName = ''): array
	{
		$headers = ['Content-Type: text/html; charset=UTF-8'];

		$from_name = get_option('ypg_email_from_name', get_bloginfo('name'));
		$from_email = get_option('ypg_email_from_address', $_SERVER['HTTP_HOST']);

		if (! empty($from_name) && ! empty($from_email) && is_email($from_email)) {
			$headers[] = 'From: ' . sprintf('"%s" <%s>', $from_name, $from_email);
		}

		if ('' !== $bccOptionName) {
			$bcc = get_option($bccOptionName, '');
			if (sanitize_email($bcc) !== '') {
				$headers[] = 'Bcc: ' . $bcc;
			}
		}

		return $headers;
	}

	/**
	 * Build a simple unordered list of items.
	 *
	 * @param ReviewItem[] $items
	 */
	private function buildItemListHtml(array $items, bool $appendDate = false): string
	{
		$list = '<ul>';

		foreach ($items as $item) {
			$title = esc_html($item->title());
			$link = esc_url($item->reviewLink());
			$date = esc_html($item->reviewDate());

			$content = $appendDate
				? sprintf('<a href="%s">%s</a> — %s %s', $link, $title, __('gepland voor', 'yard-page-guard'), $date)
				: sprintf('<a href="%s">%s</a>', $link, $title);

			$list .= sprintf('<li>%s</li>', $content);
		}

		$list .= '</ul>';

		return $list;
	}

	/**
	 * Wrap given content inside a styled HTML email template.
	 */
	private function wrapHtmlEmail(string $contentHtml): string
	{
		return sprintf(
			'<html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .content { margin: 20px; }
                        .footer { margin: 20px; font-size: 0.9em; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="content">%s</div>
                    <div class="footer">
                        <small>%s <a href="%s">%s</a></small>
                    </div>
                </body>
            </html>',
			$contentHtml,
			__('Dit bericht is automatisch gegenereerd vanuit', 'yard-page-guard'),
			home_url(),
			get_bloginfo('name')
		);
	}

	private function formatSubject(string $title = 'Inhoudseigenarenmodule'): string
	{
		return sprintf(
			'%s - %s',
			$title,
			get_bloginfo('name')
		);
	}

	/**
	 * Send a generic HTML email.
	 *
	 * @param array<int,string>   $headers
	 * @param array<string,mixed> $context Optional metadata about what this mail
	 *                                     concerns (e.g. an `items` list for the
	 *                                     review/reminder events). Surfaces in the
	 *                                     `ypg_email_log` CPT entry so admins can
	 *                                     see which pages a mail covered.
	 */
	private function sendEmail(string $to, string $subject, string $message, array $headers, array $context = []): bool
	{
		$sent = wp_mail($to, $subject, $message, $headers);

		// EmailLogRecorder subscribes for admin-visible logging; ops can still
		// rely on trigger_error below for stderr alerts on failures.
		do_action('ypg/email_sent', $sent, $to, $subject, $message, $headers, $context);

		if (! $sent) {
			trigger_error(
				sprintf('[yard-page-guard] Email failed to %s — subject: %s', $to, $subject),
				E_USER_WARNING
			);
		}

		return $sent;
	}

	/**
	 * Flatten ReviewItems into the shape stored in the email log so the admin
	 * overview can link back to each post the mail concerned.
	 *
	 * @param ReviewItem[] $items
	 *
	 * @return array<int,array{id:int,title:string,link:string,review_date:string}>
	 */
	private function itemsForLog(array $items): array
	{
		return array_map(static fn (ReviewItem $item) => [
			'id' => $item->ID(),
			'title' => $item->title(),
			'link' => $item->reviewLink(),
			'review_date' => $item->reviewDate(),
		], $items);
	}
}
