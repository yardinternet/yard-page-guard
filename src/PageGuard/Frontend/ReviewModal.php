<?php

namespace Yard\PageGuard\Frontend;

use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\WPJson\Controllers\VerifyPostController;

class ReviewModal
{
    use Date;

    private function shouldDisplay(): bool
    {
        $reviewToken = isset($_GET['ypg_review_token']) ? sanitize_text_field($_GET['ypg_review_token']) : '';

        if ('' === $reviewToken) {
            return false;
        }

        if (! in_array(get_post_type(), apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
            return false;
        }
        
        if (! is_single() && ! is_page()) {
            return false;
        }

        $contentOwnerEmail = get_post_meta(get_the_ID(), 'ypg_post_content_owner_email', true) ?? '';
        $reviewDate = get_post_meta(get_the_ID(), 'ypg_review_date', true) ?? '';

        if ('' === $contentOwnerEmail || '' === $reviewDate) {
            return false;
        }

        return VerifyPostController::verifyReviewPermission(get_the_ID(), $contentOwnerEmail, $reviewDate, $_GET['ypg_review_token']);
    }

    public function render(): void
    {
        if (! $this->shouldDisplay()) {
            return;
        }
        ?>
        <div id="ypg-review-modal" class="ypg-review-modal">
            <h2 class="title"><?php echo __('Houdbaarheidscontrole', 'yard-page-guard') ?></h2>
            <p class="description"><?php echo sprintf(__('U bent momenteel de pagina "%s" aan het controleren op houdbaarheid.', 'yard-page-guard'), get_the_title()) ?></p>
			
            <form class="ypg-review-form" hx-post="/wp-json/yard-page-guard/v1/verify-post"> 
				<input type="hidden" name="post_id" value="<?php echo get_the_ID(); ?>">
				<input type="hidden" name="ypg_review_token" value="<?php echo esc_attr(sanitize_text_field($_GET['ypg_review_token'])); ?>">
                <button type="submit"><i class="fa-solid fa-check"></i> <?php echo __('Gecontroleerd en akkoord', 'yard-page-guard') ?></button>
			</form>
        </div>
        <?php
    }
}
