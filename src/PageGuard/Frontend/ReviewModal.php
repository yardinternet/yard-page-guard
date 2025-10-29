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
            <h2>Houdbaarheidscontrole</h2>
			<form id="ypg-review-form" class="ypg-review-form">
				<label for="ypg-review">Nieuwe controledatum</label>
				<select name="ypg_review_period_type" id="ypg-review-period-type">
					<option value="auto">Automatisch (over <?php echo $this->getPeriodOptionString('ypg_review_time_period', 'ypg_review_time_unit', false)  ?>)</option>
					<option value="manual">Specifieke datum</option>
				</select>

				<label for="ypg-review">Nieuwe herinneringsdatum</label>
				<select name="ypg_reminder_period_type" id="ypg-reminder-period-type">
					<option value="auto">Automatisch (over <?php echo $this->getPeriodOptionString('ypg_reminder_time_period', 'ypg_reminder_time_unit', false)  ?>)</option>
					<option value="manual">Specifieke datum</option>
				</select>

				<input type="hidden" name="ypg_review_token" value="<?php echo esc_attr($reviewToken); ?>">
				<input type="submit" value="Gecontroleerd en akkoord">
			</form>
        </div>
        <?php
    }
}
