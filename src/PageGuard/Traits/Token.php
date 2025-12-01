<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait Token
{
	public static function generateReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate): string
	{
		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			throw new \RuntimeException('Missing review token parameter');
		}

		$data = strtolower(trim("$postId|$contentOwnerEmail|$reviewDate"));
		$rawHash = hash_hmac('sha256', $data, 'YPG_AUTH_SALT', true); # TODO: In case this goes open source, turn into env variable synced across sites, when fusion pdc setup.

		return rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '='); // URL safe
	}

	public static function verifyReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate, string $tokenToCheck): bool
	{
		$expectedToken = self::generateReviewToken($postId, $contentOwnerEmail, $reviewDate);

		return hash_equals($expectedToken, $tokenToCheck);
	}

	/**
	 * In case of an internal page
	 *
	 * @return bool Whether the internal token was successfully verified and modal info was set
	 */
	private function handleInternalToken()
	{
		if (! in_array(get_post_type(), apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
			return false;
		}

		if (! is_single() && ! is_page()) {
			return false;
		}

		$contentOwnerEmail = get_post_meta(get_the_ID(), 'ypg_post_content_owner_email', true) ?: '';
		$reviewDate = get_post_meta(get_the_ID(), 'ypg_review_date', true) ?: '';

		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			return false;
		}

		if (! self::verifyReviewToken(get_the_ID(), $contentOwnerEmail, $reviewDate, sanitize_text_field($_GET['ypg_review_token']))) {
			return false;
		}

		$_REQUEST['ypg_modal_info'] = [
			'id' => get_the_ID(),
			'title' => get_the_title(),
			'endpoint' => '/wp-json/yard-page-guard/v1/verify-post',
		];

		return true;
	}

	/**
	 * In case of a fusion PDC or Pub page
	 *
	 * @return bool Whether the external token was successfully verified and modal info was set
	 */
	private function handleExternalToken(): bool
	{
		if (! in_array($_GET['external'], ['pdc', 'pub']) || ! is_numeric($_GET['post_id'])) {
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
				'ypg_review_token' => sanitize_text_field($_GET['ypg_review_token']),
			]),
		];

		$endpointResponse = wp_remote_post($endpointUrl, $endpointArgs);
		if (is_wp_error($endpointResponse)) {
			return false;
		}

		$endpointBody = json_decode(wp_remote_retrieve_body($endpointResponse), true);

		if (! is_array($endpointBody) || ! isset($endpointBody['endpoint'])) {
			return false;
		}

		$_REQUEST['ypg_modal_info'] = $endpointBody;

		return true;
	}
}
