<?php

namespace Yard\PageGuard\Frontend;

use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Token;

class ReviewModal
{
	use Date;
	use Token;

	/**
	 * Get info to display in modal and verify get parameters
	 * Return type specified through PHPDoc due to PHP 7 compatibility
	 *
	 * @return false|array
	 */
	private function getModalInfo()
	{
		$reviewToken = isset($_GET['ypg_review_token']) ? sanitize_text_field($_GET['ypg_review_token']) : '';

		if ('' === $reviewToken) {
			return false;
		}

		if (isset($_GET['external'], $_GET['post_id'])) {
			return $this->getExternalModalInfo();
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

		if (! self::verifyReviewToken(get_the_ID(), $contentOwnerEmail, $reviewDate, $reviewToken)) {
			return false;
		}

		return [
			'id' => get_the_ID(),
			'title' => get_the_title(),
			'endpoint' => '/wp-json/yard-page-guard/v1/verify-post',
		];
	}

	/**
	 * Get modal info externally in case of Fusion PDC or PUB
	 *
	 * @return false|array
	 */
	private function getExternalModalInfo()
	{
		if (('pdc' !== $_GET['external'] && 'pub' !== $_GET['external']) || ! is_numeric($_GET['post_id'])) {
			return false;
		}

		$endpointVariable = strtoupper('OPEN' . $_GET['external'] . '_ENDPOINT');

		if (! is_string($_ENV[$endpointVariable] ?? null)) {
			return false;
		}

		$endpointUrl = trailingslashit($_ENV[$endpointVariable]) . 'wp-json/yard-page-guard/v1/modal-info';

		$endpointArgs = [
			'method' => 'POST',
			'timeout' => 10,
			'blocking' => true,
			'headers' => [
				'Content-Type' => 'application/json',
			],
			'body' => wp_json_encode([
				'post_id' => $_GET['post_id'],
				'ypg_review_token' => $_GET['ypg_review_token'],
			]),
		];

		$endpointResponse = wp_remote_post($endpointUrl, $endpointArgs);
		if (is_wp_error($endpointResponse)) {
			return false;
		}

		$endpointBody = json_decode(wp_remote_retrieve_body($endpointResponse), true);

		if (! is_array($endpointBody)) {
			return false;
		}

		return isset($endpointBody['endpoint']) ? $endpointBody : false;
	}

	public function render(): void
	{
		$displayInfo = $this->getModalInfo();

		if (! is_array($displayInfo)) {
			return;
		}

		// translators: %s will be replaced with page title
		$description = __('U bent momenteel de pagina "%s" aan het controleren op houdbaarheid.', 'yard-page-guard')
		?>
        <div id="ypg-review-modal" class="ypg-review-modal">
			<button class="close-modal" aria-label="<?= __('Sluit venster', 'yard-page-guard') ?>"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>

            <form class="ypg-review-form" hx-post="<?= $displayInfo['endpoint'] ?>">
                <h2 class="title"><?= __('Houdbaarheidscontrole', 'yard-page-guard') ?></h2>
                <p class="description"><?= sprintf($description, $displayInfo['title']) ?></p>
				<input type="hidden" name="post_id" value="<?= $displayInfo['id'] ?>">
				<input type="hidden" name="ypg_review_token" value="<?= esc_attr(sanitize_text_field($_GET['ypg_review_token'])); ?>">
                <button type="submit"><i class="fa-solid fa-check" aria-hidden="true"></i> <?= __('Gecontroleerd en akkoord', 'yard-page-guard') ?></button>
			</form>
        </div>
        <?php
	}
}
