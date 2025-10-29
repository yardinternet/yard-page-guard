<?php

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;

trait Email
{
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
                ? sprintf('<a href="%s">%s</a> — %s', $link, $title, $date)
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

    private function formatSubject(string $title = 'Houdbaarheidsmodule'): string
    {
        return sprintf(
            '%s - %s',
            $title,
            get_bloginfo('name')
        );
    }

    /**
     * Send a generic HTML email.
     */
    private function sendEmail(string $to, string $subject, string $message, array $headers): bool
    {
        return wp_mail($to, $subject, $message, $headers);
    }
}
