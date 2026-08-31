<?php

declare(strict_types=1);

namespace Yard\PageGuard\Frontend;

use WP_User;
use Yard\PageGuard\Foundation\ServiceProvider;
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
			add_filter('show_admin_bar', [$this, 'disableAdminBarForReviewUsers'], 10, 1);
		}
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
