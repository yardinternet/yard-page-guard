<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait Token
{
	public function generateReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate): string
	{
		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			throw new \RuntimeException('Missing review token parameter');
		}

		$data = strtolower(trim("$postId|$contentOwnerEmail|$reviewDate"));
		$rawHash = $this->generateKeyedHash($data);

		return rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '='); // URL safe
	}

	/**
	 * Generates a keyed hash using HMAC with SHA-256.
	 * The key is derived from a salt defined in wp-config.php or environment variables.
	 *
	 * For a cross-site PDC/Pub connection, YPG_AUTH_SALT must be the same on all connected sites.
	 */
	private function generateKeyedHash(string $data): string
	{
		$salt = defined('YPG_AUTH_SALT') ? YPG_AUTH_SALT
			: (defined('AUTH_SALT') ? AUTH_SALT
			: ($_ENV['YPG_AUTH_SALT'] ?? $_ENV['AUTH_SALT'] ?? ''));

		return hash_hmac('sha256', $data, $salt, true);
	}

	public function verifyReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate, string $tokenToCheck): bool
	{
		$expectedToken = $this->generateReviewToken($postId, $contentOwnerEmail, $reviewDate);

		return hash_equals($expectedToken, $tokenToCheck);
	}

	/**
	 * In case of an internal page
	 */
	private function handleInternalToken(): ?array
	{
		if (! in_array(get_post_type(), apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
			return null;
		}

		if (! is_single() && ! is_page()) {
			return null;
		}

		$contentOwnerEmail = get_post_meta(get_the_ID(), 'ypg_post_content_owner_email', true) ?: '';
		$reviewDate = get_post_meta(get_the_ID(), 'ypg_review_date', true) ?: '';

		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			return null;
		}

		if (! $this->verifyReviewToken(get_the_ID(), $contentOwnerEmail, $reviewDate, sanitize_text_field((string) ($_GET['ypg_review_token'] ?? '')))) {
			return null;
		}

		$footer = trim(strip_tags(get_option('ypg_modal_footer_content', ''))) !== '' ? wpautop(get_option('ypg_modal_footer_content', '')) : false;

		return [
			'id' => get_the_ID(),
			'title' => get_the_title(),
			'footer' => $footer,
			'endpoint' => '/wp-json/yard-page-guard/v1/verify-post',
		];
	}

	/**
	 * In case of a fusion PDC or Pub page
	 */
	private function handleExternalToken(): ?array
	{
		$external = strtolower(sanitize_text_field((string) ($_GET['external'] ?? '')));
		$postId = absint($_GET['post_id'] ?? 0);

		if (! in_array($external, ['pdc', 'pub']) || 0 === $postId) {
			return null;
		}

		$endpointVariable = sprintf('OPEN%s_ENDPOINT', strtoupper($external)); // e.g. OPENPDC_ENDPOINT or OPENPUB_ENDPOINT

		// define('OPENPDC_ENDPOINT', '...') or define('OPENPUB_ENDPOINT', '...') in wp-config.php takes precedence over $_ENV.
		$endpointValue = defined($endpointVariable) ? constant($endpointVariable) : ($_ENV[$endpointVariable] ?? null);

		if (! is_string($endpointValue) || ! wp_http_validate_url($endpointValue)) {
			return null;
		}

		$endpointUrl = trailingslashit($endpointValue) . 'wp-json/yard-page-guard/v1/modal-info';

		$endpointArgs = [
			'method' => 'POST',
			'timeout' => 10,
			'blocking' => true,
			'headers' => [
				'Content-Type' => 'application/json',
			],
			'body' => wp_json_encode([
				'post_id' => $postId,
				'ypg_review_token' => sanitize_text_field((string) ($_GET['ypg_review_token'] ?? '')),
			]),
		];

		$endpointResponse = wp_remote_post($endpointUrl, $endpointArgs);
		if (is_wp_error($endpointResponse)) {
			return null;
		}

		$endpointBody = json_decode(wp_remote_retrieve_body($endpointResponse), true);

		if (! is_array($endpointBody) || ! isset($endpointBody['endpoint'])) {
			return null;
		}

		return $endpointBody;
	}
}
