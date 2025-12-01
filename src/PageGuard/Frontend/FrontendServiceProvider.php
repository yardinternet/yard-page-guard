<?php

declare(strict_types=1);

namespace Yard\PageGuard\Frontend;

use WP_User;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\Token;

class FrontendServiceProvider extends ServiceProvider
{
	use Token;

	public function register(): void
	{
		add_action('wp', [$this, 'handleReviewToken'], 5);
		add_action('wp_footer', [new ReviewModal(), 'render']);
		add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
		add_filter('show_admin_bar', [$this, 'disableAdminBarForReviewUsers'], 10, 1);

		// For laravel PDC routes
		$this->handleReviewToken();
	}

	public function enqueueFrontendAssets(): void
	{
		if (! isset($_GET['ypg_review_token'])) {
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

	/**
	 * Verify review token either for the current post OR via an external endpoint (pdc/pub).
	 * If token verifies and the visitor is not logged in, set current WP user to ID 0.
	 */
	public function handleReviewToken(): void
	{
		if (! isset($_GET['ypg_review_token']) || isset($_REQUEST['ypg_modal_info'])) {
			return;
		}

		$isVerified = false;

		if (isset($_GET['external'], $_GET['post_id'])) {
			$isVerified = $this->handleExternalToken();
		} else {
			$isVerified = $this->handleInternalToken();
		}

		if ($isVerified && ! is_user_logged_in()) {
			$this->loginReviewUser();
		}
	}

	private function loginReviewUser(): void
	{
		$username = 'ypg_review_user';

		$user = get_user_by('login', $username);

		if (! $user) {
			$user_id = wp_create_user(
				$username,
				wp_generate_password(20),
				$username . '@yard.nl'
			);

			if (is_wp_error($user_id)) {
				return;
			}

			$user = new WP_User($user_id);
			$user->set_role('subscriber');
		}

		wp_set_current_user($user->ID);
	}

	public function disableAdminBarForReviewUsers(bool $showAdminBar): bool
	{
		if (is_user_logged_in()) {
			$user = wp_get_current_user();

			if ($user && 'ypg_review_user' === $user->user_login) {
				return false;
			}
		}

		return $showAdminBar;
	}
}
