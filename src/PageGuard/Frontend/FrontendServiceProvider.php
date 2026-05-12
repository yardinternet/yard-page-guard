<?php

declare(strict_types=1);

namespace Yard\PageGuard\Frontend;

use Yard\PageGuard\Foundation\ServiceProvider;

class FrontendServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		add_action('template_redirect', [new ReviewModal(), 'render'], 5, 0);
		add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);

		if (get_option('ypg_show_internal_data_on_review', false)) {
			add_filter('show_admin_bar', [$this, 'disableAdminBarForReviewUsers'], 10, 1);
		}
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
			$this->plugin::VERSION,
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
			$this->plugin::VERSION,
		);
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
