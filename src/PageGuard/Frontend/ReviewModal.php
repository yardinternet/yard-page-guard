<?php

namespace Yard\PageGuard\Frontend;

use Yard\PageGuard\Traits\Date;

class ReviewModal
{
    use Date;

    public function render(): void
    {

        $reviewToken = isset($_GET['ypg_review_token']) ? sanitize_text_field($_GET['ypg_review_token']) : '';

        if ('' === $reviewToken || ! defined('AUTH_SALT')) {
            return;
        }

        if (! in_array(get_post_type(), apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
            return;
        }

        global $post;

        if (! isset($post) || ! is_a($post, 'WP_Post')) {
            return;
        }

        $contentOwnerEmail = get_post_meta($post->ID, 'ypg_post_content_owner_email', true) ?? '';
        $reviewDate = get_post_meta($post->ID, 'ypg_review_date', true) ?? '';

        if ('' === $contentOwnerEmail || '' === $reviewDate) {
            return;
        }

        $rawHash = hash_hmac('sha256', strtolower(trim("{$post->ID}|$contentOwnerEmail|$reviewDate")), AUTH_SALT, true);
        $expectedToken = rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '='); // URL safe

        if (! hash_equals($expectedToken, $reviewToken)) {
            return;
        }
        ?>
        <div id="ypg-review-modal" class="ypg-review-modal">
            <h2><?php echo __('Houdbaarheidscontrole', 'yard-page-guard') ?></h2>
			<form id="ypg-review-form" class="ypg-review-form" hx-post="/wp-json/yard-page-guard/v1/verify-post"> 
				<input type="hidden" name="post_id" value="<?php echo $post->ID; ?>">
				<input type="hidden" name="ypg_review_token" value="<?php echo esc_attr($reviewToken); ?>">
				<input type="submit" value="<?php echo __('Gecontroleerd en akkoord', 'yard-page-guard') ?>">
			</form>
        </div>
        <?php
    }
}
