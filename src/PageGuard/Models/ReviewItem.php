<?php

namespace Yard\PageGuard\Models;

use DateTime;
use DateTimeZone;
use WP_Post;
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

        $ownerEmail = get_post_meta($this->ID(), 'ypg_post_content_owner_email', true) ?? '';
        $reviewDate = get_post_meta($this->ID(), 'ypg_review_date', true) ?? '';

        $permalink = add_query_arg('ypg_review_token', self::generateReviewToken($this->ID(), $ownerEmail, $reviewDate), $permalink);

        $home = home_url();

        if (strpos($home, 'pdc') !== false) {
            add_query_arg('type', 'pdc', $permalink);
            add_query_arg('post_id', $this->ID(), $permalink);
        } elseif (strpos($home, 'pub') !== false) {
            add_query_arg('type', 'pub', $permalink);
            add_query_arg('post_id', $this->ID(), $permalink);
        }

        return $permalink;
    }

    public function reviewDate(string $format = 'd-m-Y'): string
    {
        $date = get_post_meta($this->ID(), 'ypg_review_date', true);

        if (! $this->isValidDate($date)) {
            return __('Niet ingesteld', 'yard-page-guard');
        }

        $date = new DateTime($date, new DateTimeZone(get_option('timezone_string')));

        return $date->format($format);
    }

    public function reminderDate(string $format = 'd-m-Y'): string
    {
        $date = get_post_meta($this->ID(), 'ypg_reminder_date', true);
        $date = new DateTime($date, new DateTimeZone(get_option('timezone_string')));

        return $date->format($format);
    }

    public function contentOwner(): ?ContentOwner
    {
        $id = get_post_meta($this->ID(), 'ypg_post_content_owner_id', true);
        $name = get_post_meta($this->ID(), 'ypg_post_content_owner_name', true);
        $email = get_post_meta($this->ID(), 'ypg_post_content_owner_email', true);
        $type = get_post_meta($this->ID(), 'ypg_post_content_owner_type', true);

        if (false === $id || '' === $id) {
            return null;
        }

        return new ContentOwner($id, $name, $email, $type);
    }
}
