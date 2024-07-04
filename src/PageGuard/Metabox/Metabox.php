<?php

namespace Yard\PageGuard\Metabox;

use WP_Post;

class Metabox
{
	public function addMetaboxes(): void
	{
		add_meta_box(
			'yard_page_guard_metaboxes',
			__('Houdbaarsheidsmodule', 'yard-page-guard'),
			[$this, 'displayMetaboxes'],
			'page',
			'side',
			'high'
		);
	}

	public function displayMetaboxes(WP_Post $post): void
	{
		// Retrieve current meta values.
		$currentAuthor = get_post_meta($post->ID, 'ypg_page_author', true);
		$isVerified = get_post_meta($post->ID, 'ypg_is_verified', true);
		$reviewDate = get_post_meta($post->ID, 'ypg_review_date', true);

		// Security nonce field.
		wp_nonce_field(basename(__FILE__), 'yard_page_guard_metaboxes_nonce');

		echo $this->displayMetaboxesHTML($currentAuthor, $isVerified, $reviewDate, $post->ID);
	}

	private function displayMetaboxesHTML(string $currentAuthor, string $isVerified, string $reviewDate, int $postID): string
	{
		$html = sprintf('<p>%s</p>', __('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'));

		if ($this->currentUserHasAccess($postID)) {
			$html = $this->pageAuthorMetabox($html, $currentAuthor);
			$html = $this->isVerifiedMetabox($html, $isVerified);
			$html = $this->reviewDatedMetabox($html, $reviewDate);
		} else {
			$html .= sprintf('<p><b>%s</b></p>', __('U heeft geen toestemming om de houdbaarsheids module te bewerken.', 'yard-page-guard'));
		}

		return $html;
	}

	private function pageAuthorMetabox(string $html, string $currentAuthor): string
	{
		$users = get_users([
			'capability' => 'edit_pages',
		]);

		$html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_page_author">%s:</label>', __('Inhoudseigenaar', 'yard-page-guard'));
		$html .= '<select name="ypg_page_author" id="ypg_page_author">';
		$html .= sprintf('<option value="">%s</option>', __('Maak een keuze', 'yard-page-guard'));

		foreach ($users as $user) {
			$html .= sprintf(
				'<option value="%s"%s>%s</option>',
				esc_attr($user->ID),
				selected($currentAuthor, $user->ID, false),
				esc_html($user->display_name)
			);
		}

		$html .= '</select></div>';

		return $html;
	}

	private function isVerifiedMetabox(string $html, string $isVerified): string
	{
		$html .= '<div class="ypg-metabox-wrapper"><label for="ypg_is_verified">';
		$html .= sprintf('<input type="checkbox" name="ypg_is_verified" id="ypg_is_verified" value="1"%s />', checked($isVerified, 1, false));
		$html .= sprintf(' %s</label></div>', __('Gecontroleerd?', 'yard-page-guard'));

		return $html;
	}

	private function reviewDatedMetabox(string $html, string $reviewDate): string
	{
		$html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_review_date">%s:</label>', __('Herinnering', 'yard-page-guard'));
		$html .= sprintf('<input type="date" name="ypg_review_date" id="ypg_review_date" value="%s" />', esc_attr($reviewDate));
		$html .= sprintf('<p>%s</p></div>', __('De herinnering wordt via de e-mail verstuurd op de ingestelde datum.', 'yard-page-guard'));

		return $html;
	}

	public function saveMetaboxValues(int $postID): int
	{
		if (! $this->shouldSave($postID)) {
			return $postID;
		}

		// Sanitize and save the author ID
		$newAuthorId = (isset($_POST['ypg_page_author']) ? sanitize_text_field($_POST['ypg_page_author']) : '');
		update_post_meta($postID, 'ypg_page_author', $newAuthorId);

		// Sanitize and save the verified status
		$isVerified = (isset($_POST['ypg_is_verified']) ? 1 : 0);
		update_post_meta($postID, 'ypg_is_verified', $isVerified);

		// Sanitize and save the review date
		$reviewDate = (isset($_POST['ypg_review_date']) ? sanitize_text_field($_POST['ypg_review_date']) : '');
		update_post_meta($postID, 'ypg_review_date', $reviewDate);
	}

	private function shouldSave(int $postID): bool
	{
		if (! isset($_POST['yard_page_guard_metaboxes_nonce']) || ! wp_verify_nonce($_POST['yard_page_guard_metaboxes_nonce'], basename(__FILE__))) {
			return false;
		}

		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return false;
		}

		if ('page' !== ($_POST['post_type'] ?? '')) {
			return false;
		}

		if (! current_user_can('edit_pages', $postID)) {
			return false;
		}

		if (! $this->currentUserHasAccess($postID)) {
			return false;
		}

		return true;
	}

	private function currentUserHasAccess(int $postID): bool
	{
		$post = get_post($postID);
		$selectedAuthor = get_post_meta($postID, 'ypg_page_author', true) ?: '0';
		$currentUser = wp_get_current_user();
		$currentUserId = $currentUser->ID;
		$currentUserRoles = (array) $currentUser->roles;

		// A newly created page which has never been published yet has no post_name yet.
		if (0 === strlen($post->post_name) || in_array('administrator', $currentUserRoles)) {
			return true;
		}

		// Allow access if the current user is the author or the selected author
		return ($currentUserId == $post->post_author || $currentUserId == $selectedAuthor);
	}
}
