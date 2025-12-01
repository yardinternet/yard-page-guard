<?php

namespace Yard\PageGuard\Frontend;

class ReviewModal
{
	public function render(): void
	{
		$displayInfo = isset($_REQUEST['ypg_modal_info']) && is_array($_REQUEST['ypg_modal_info'])
			? $_REQUEST['ypg_modal_info']
			: null;

		if (null === $displayInfo) {
			return;
		}

		// translators: %s will be replaced with page title
		$description = __('U bent momenteel de pagina "%s" aan het controleren op houdbaarheid.', 'yard-page-guard');
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
