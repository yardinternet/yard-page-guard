<?php

declare(strict_types=1);

namespace Yard\PageGuard\Frontend;

use WP_User;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\ReviewUser;

class FrontendServiceProvider extends ServiceProvider
{
	use ReviewUser;

	public const QUERY_PARAM_REVIEW_TOKEN = 'ypg_review_token';
	public const QUERY_PARAM_MODAL_INFO_ENDPOINT = 'ypg_modal_info_endpoint';
	public const QUERY_PARAM_POST_ID = 'ypg_post_id';

	public function register(): void
	{
		add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
		add_action('wp_body_open', [$this, 'renderBodyOpen'], 5, 0);

		if (get_option(Settings::SHOW_INTERNAL_DATA_ON_REVIEW, false)) {
			add_action('template_redirect', [$this, 'loginReviewUser'], 5, 0);
			add_filter('show_admin_bar', [$this, 'disableAdminBarForReviewUsers'], 10, 1);
		}
	}

	/**
	 * Log anonymous reviewers in as the review user so content gated to logged-in
	 * users is visible while reviewing. Only runs on a valid review token.
	 */
	public function loginReviewUser(): void
	{
		if (! $this->isReview() || is_user_logged_in()) {
			return;
		}

		$postId = intval($_GET[self::QUERY_PARAM_POST_ID] ?? 0);
		$token = sanitize_text_field(rawurldecode($_GET[self::QUERY_PARAM_REVIEW_TOKEN]));
		$post = get_post($postId);
		$reviewItem = $post instanceof \WP_Post ? new ReviewItem($post) : null;
		$verified = $reviewItem && $reviewItem->verifyToken($reviewItem, home_url(), $token);

		if (! $verified) {
			// The post lives on another site (PDC/PUB item shown on a portal): let that site verify the token.
			// Only the host of the endpoint in the URL is used, and only when a filter marks it as trusted;
			$host = wp_parse_url(rawurldecode($_GET[self::QUERY_PARAM_MODAL_INFO_ENDPOINT] ?? ''), PHP_URL_HOST);
			$trusted = in_array($host, apply_filters('yard::page-guard/trusted-review-origins', []), true);
			$verified = $trusted && 200 === wp_remote_retrieve_response_code(wp_remote_get(
				add_query_arg(['post_id' => $postId, 'token' => $token], 'https://' . $host . '/wp-json/yard/page-guard/v2/modal-info'),
				['timeout' => 10],
			));
		}

		if (! $verified) {
			return;
		}

		$username = $this->resolveReviewUserLogin();
		if ('' === $username) {
			return;
		}

		$user = get_user_by('login', $username);

		if (! $user) {
			$userId = wp_create_user($username, wp_generate_password(20), $username . '@yard.nl');

			if (is_wp_error($userId)) {
				return;
			}

			$user = new WP_User($userId);
			$user->set_role('subscriber');
		}

		// Refuse to log in as any user that can edit/administer content, this prevents a
		// misconfigured filter from escalating visitors to a privileged account.
		if (user_can($user, 'edit_posts') || user_can($user, 'edit_pages') || user_can($user, 'manage_options') || user_can($user, 'promote_users')) {
			return;
		}

		wp_set_current_user($user->ID);
	}

	public function isReview(): bool
	{
		return isset($_GET[self::QUERY_PARAM_REVIEW_TOKEN]) && strlen(trim($_GET[self::QUERY_PARAM_REVIEW_TOKEN])) > 0;
	}

	public function renderBodyOpen(): void
	{
		if (! $this->isReview()) {
			return;
		}

		printf(
			'<div id="%s" data-review-token="%s" data-modal-info-endpoint="%s" data-post-id="%s"></div>',
			'ypg-review-modal',
			esc_attr(rawurldecode($_GET[self::QUERY_PARAM_REVIEW_TOKEN] ?? '')),
			esc_attr(rawurldecode($_GET[self::QUERY_PARAM_MODAL_INFO_ENDPOINT] ?? '')),
			esc_attr(intval($_GET[self::QUERY_PARAM_POST_ID] ?? 0)),
		);
	}

	public function enqueueFrontendAssets(): void
	{
		if (! $this->isReview()) {
			return;
		}

		$handle = 'ypg-frontend';
		$asset = $this->plugin->assetMeta('frontend');

		wp_enqueue_style(
			$handle,
			$this->plugin->resourceUrl('frontend.css'),
			[],
			$asset['version'],
		);

		wp_enqueue_script(
			$handle,
			$this->plugin->resourceUrl('frontend.js'),
			$asset['dependencies'],
			$asset['version'],
			['in_footer' => true],
		);

		wp_set_script_translations($handle, 'yard-page-guard', $this->plugin->rootPath . '/languages');
	}

	public function disableAdminBarForReviewUsers(bool $showAdminBar): bool
	{
		if (! is_user_logged_in()) {
			return $showAdminBar;
		}

		$user = wp_get_current_user();

		if (! $user instanceof WP_User) {
			return $showAdminBar;
		}

		$reviewLogin = $this->resolveReviewUserLogin();

		if ('' !== $reviewLogin && $reviewLogin === $user->user_login) {
			return false;
		}

		return $showAdminBar;
	}
}
