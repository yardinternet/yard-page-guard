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
		return isset($_GET['ypg_review_token']) && strlen(trim($_GET['ypg_review_token'])) > 0;
	}

	public function renderBodyOpen(): void
	{
		if (! $this->isReview()) {
			return;
		}

		printf(
			'<div id="%s" data-review-token="%s" data-modal-info-endpoint="%s" data-post-id="%s"></div>',
			'ypg-review-modal', //TODO: id naar constante verplaatsen
			esc_attr(rawurldecode($_GET['ypg_review_token'] ?? '')),
			esc_attr(rawurldecode($_GET['ypg_modal_info_endpoint'] ?? '')),
			esc_attr(intval($_GET['ypg_post_id'] ?? 0)),
		);
	}

	public function enqueueFrontendAssets(): void
	{
		if (! $this->isReview()) {
			return;
		}

		wp_enqueue_style(
			'ypg-frontend-styles',
			$this->plugin->resourceUrl('frontend.css'),
			[],
			filemtime($this->plugin->resourcePath('frontend.css')),
		);

		wp_enqueue_style(
			'ypg-frontend-fonts',
			'https://use.typekit.net/ozu4txi.css',
			[],
			null
		);

		wp_enqueue_script(
			'ypg-frontend-scripts',
			$this->plugin->resourceUrl('frontend.js'),
			[],
			filemtime($this->plugin->resourcePath('frontend.js')),
		);
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
