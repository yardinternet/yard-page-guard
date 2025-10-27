<?php

namespace Yard\PageGuard\Models;

use DateTime;
use DateTimeZone;
use WP_Post;
use Yard\PageGuard\Support\Traits\EditPostLink;

class ReviewItem
{
    use EditPostLink;

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

    public function editLink(): string
    {
        return $this->editPostLink($this->ID(), $this->postType());
    }

    public function reviewDate(string $format = 'd-m-Y'): string
    {
        $date = get_post_meta($this->ID(), 'ypg_review_date', true);
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
