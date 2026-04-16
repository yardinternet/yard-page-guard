<?php

namespace Yard\PageGuard\Frontend;

use WP_User;
use Yard\PageGuard\Traits\Token;

class ReviewModal
{
	use Token;

	private ?array $displayInfo = null;

	/**
	 * Verify review token either for the current post OR via an external endpoint (pdc/pub).
	 * If token verifies and the visitor is not logged in, set current WP user to user reserved/created by plugin.
	 */
	public function handleReviewToken(): void
	{
		if (! isset($_GET['ypg_review_token']) || null !== $this->displayInfo) {
			return;
		}

		if (isset($_GET['external'], $_GET['post_id'])) {
			$this->displayInfo = $this->handleExternalToken();
		} else {
			$this->displayInfo = $this->handleInternalToken();
		}

		if (null !== $this->displayInfo && ! is_user_logged_in() && get_option('ypg_show_internal_data_on_review', false)) {
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

	public function render(): void
	{
		$this->handleReviewToken();

		if (null === $this->displayInfo) {
			return;
		}

		// translators: %s will be replaced with page title
		$description = __('U bent momenteel de pagina "%s" aan het controleren op houdbaarheid.', 'yard-page-guard');
		?>
        <div id="ypg-review-modal" class="ypg-review-modal">
			<button class="ypg-close-modal" aria-label="<?= __('Sluit venster', 'yard-page-guard') ?>"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>

            <form class="ypg-review-form" hx-post="<?= $this->displayInfo['endpoint'] ?>">
                <h2 class="ypg-title"><?= __('Houdbaarheidscontrole', 'yard-page-guard') ?></h2>
                <p class="ypg-description"><?= sprintf($description, $this->displayInfo['title']) ?></p>
				<input type="hidden" name="post_id" value="<?= $this->displayInfo['id'] ?>">
				<input type="hidden" name="ypg_review_token" value="<?= esc_attr(sanitize_text_field($_GET['ypg_review_token'])); ?>">
                <button type="submit"><i class="fa-solid fa-check" aria-hidden="true"></i> <?= __('Gecontroleerd en akkoord', 'yard-page-guard') ?></button>
				<?php if ($this->displayInfo['footer'] ?? false): ?>
				<div class="ypg-footer">
					<?= $this->displayInfo['footer'] ?>
				</div>
				<?php endif; ?>
			</form>
        </div>
        <?php
	}
}
