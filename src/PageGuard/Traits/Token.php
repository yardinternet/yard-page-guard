<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use RuntimeException;

trait Token
{
	/**
	 * @return string[]
	 */
	private static function externalTokenSources(): array
	{
		return ['pdc', 'pub'];
	}

	public function generateReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate): string
	{
		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			throw new RuntimeException('Missing review token parameter');
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
		if (defined('YPG_AUTH_SALT')) {
			$salt = (string) YPG_AUTH_SALT;
		} elseif (isset($_ENV['YPG_AUTH_SALT'])) {
			$salt = (string) $_ENV['YPG_AUTH_SALT'];
		} elseif (defined('AUTH_SALT')) {
			$salt = (string) AUTH_SALT;
		} else {
			$salt = (string) ($_ENV['AUTH_SALT'] ?? '');
		}

		if ('' === $salt) {
			throw new RuntimeException('Missing authentication salt for review token generation');
		}

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
		$reviewToken = $this->readReviewTokenFromQuery();

		if (null === $reviewToken) {
			return null;
		}

		if (! in_array(get_post_type(), apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
			return null;
		}

		if (! is_single() && ! is_page()) {
			return null;
		}

		$postId = (int) get_the_ID();
		if (0 >= $postId) {
			return null;
		}

		$contentOwnerEmail = (string) (get_post_meta($postId, 'ypg_post_content_owner_email', true) ?: '');
		$reviewDate = (string) (get_post_meta($postId, 'ypg_review_date', true) ?: '');

		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			return null;
		}

		try {
			if (! $this->verifyReviewToken($postId, $contentOwnerEmail, $reviewDate, $reviewToken)) {
				return null;
			}
		} catch (RuntimeException $e) {
			return null;
		}

		$footer = trim(strip_tags(get_option('ypg_modal_footer_content', ''))) !== '' ? wpautop(get_option('ypg_modal_footer_content', '')) : false;

		return [
			'id' => $postId,
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
		$reviewToken = $this->readReviewTokenFromQuery();
		$source = $this->readExternalSourceFromQuery();
		$postId = $this->readPostIdFromQuery();

		if (null === $reviewToken || null === $source || null === $postId) {
			return null;
		}

		$endpointVariable = strtoupper('OPEN' . $source . '_ENDPOINT'); // e.g. OPENPDC_ENDPOINT or OPENPUB_ENDPOINT

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
				'ypg_review_token' => $reviewToken,
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

	private function readReviewTokenFromQuery(): ?string
	{
		if (! is_string($_GET['ypg_review_token'] ?? null)) {
			return null;
		}

		$token = sanitize_text_field($_GET['ypg_review_token']);

		return '' === $token ? null : $token;
	}

	private function readExternalSourceFromQuery(): ?string
	{
		if (! is_string($_GET['external'] ?? null)) {
			return null;
		}

		return in_array($_GET['external'], self::externalTokenSources(), true) ? $_GET['external'] : null;
	}

	private function readPostIdFromQuery(): ?int
	{
		if (! isset($_GET['post_id']) || ! is_numeric($_GET['post_id'])) {
			return null;
		}

		$postId = (int) $_GET['post_id'];

		return 0 < $postId ? $postId : null;
	}
}
