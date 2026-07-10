<?php

namespace Yard\PageGuard\Taxonomy;

use WP_Term;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\CascadesOwner;

class ExternalOwnerTaxonomy
{
	use CascadesOwner;

	public function register(): void
	{
		register_taxonomy('ypg_external_content_owner', apply_filters('yard::page-guard/post-types-to-use', ['page']), [
			'labels' => [
				'name' => __('Externe inhoudseigenaren', 'yard-page-guard'),
				'singular_name' => __('Externe inhoudseigenaar', 'yard-page-guard'),
				'menu_name' => __('Externe inhoudseigenaren', 'yard-page-guard'),
				'all_items' => __('Alle externe inhoudseigenaren', 'yard-page-guard'),
				'edit_item' => __('Bewerk externe inhoudseigenaar', 'yard-page-guard'),
				'view_item' => __('Bekijk externe inhoudseigenaar', 'yard-page-guard'),
				'update_item' => __('Werk externe inhoudseigenaar bij', 'yard-page-guard'),
				'add_new_item' => __('Nieuwe externe inhoudseigenaar toevoegen', 'yard-page-guard'),
				'new_item_name' => __('Naam van nieuwe externe inhoudseigenaar', 'yard-page-guard'),
				'parent_item' => null,
				'parent_item_colon' => null,
				'search_items' => __('Zoek externe inhoudseigenaren', 'yard-page-guard'),
				'not_found' => __('Geen externe inhoudseigenaren gevonden', 'yard-page-guard'),
			],
			'public' => false,
			'show_ui' => true,
			'show_in_quick_edit' => false,
			'show_admin_column' => false,
			'show_in_menu' => false,
			'hierarchical' => false,
			'rewrite' => [
				'slug' => 'ypg-external-content-owner',
				'with_front' => false,
			],
			'capabilities' => [
				'manage_terms' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
				'edit_terms' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
				'delete_terms' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
				'assign_terms' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
			],
		]);
	}

	public function addInsertEmailFormField(): void
	{
		?>
        <div class="form-field">
            <label for="ypg_external_content_owner_email"><?php _e('E-mailadres', 'yard-page-guard'); ?></label>
            <input type="email" name="ypg_external_content_owner_email" id="ypg_external_content_owner_email" required />
            <p><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
        </div>
        <?php
	}

	public function addInsertPhoneNumberFormField(): void
	{
		?>
        <div class="form-field">
            <label for="ypg_external_content_owner_phone_number"><?php _e('Telefoonnummer', 'yard-page-guard'); ?></label>
            <input type="text" name="ypg_external_content_owner_phone_number" id="ypg_external_content_owner_phone_number" />
            <p><?php _e('Voer het telefoonnummer van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
        </div>
        <?php
	}

	public function addUpdateEmailFormField(WP_Term $user): void
	{
		$email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');
		?>
        <tr class="form-field">
            <th scope="row">
                <label for="ypg_external_content_owner_email"><?php _e('E-mailadres', 'yard-page-guard'); ?></label>
            </th>
            <td>
                <input type="email"
                       name="ypg_external_content_owner_email"
                       id="ypg_external_content_owner_email"
                       size="40"
                       required
                       value="<?= esc_attr($email); ?>" />
                <p class="description"><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
            </td>
        </tr>
        <?php
	}

	public function addUpdatePhoneNumberFormField(WP_Term $user): void
	{
		$phoneNumber = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_phone_number', true) ?: '');
		?>
        <tr class="form-field">
            <th scope="row">
                <label for="ypg_external_content_owner_phone_number"><?php _e('Telefoonnummer', 'yard-page-guard'); ?></label>
            </th>
            <td>
                <input type="text"
                       name="ypg_external_content_owner_phone_number"
                       id="ypg_external_content_owner_phone_number"
                       size="40"
                       value="<?= esc_attr($phoneNumber); ?>" />
                <p class="description"><?php _e('Voer het telefoonnummer van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
            </td>
        </tr>
        <?php
	}

	/**
	 * Prevent creating a term if the email is missing, invalid, or already exists on another term.
	 *
	 * Returning a WP_Error from `pre_insert_term` cancels the insert and WordPress
	 * displays the error message as an admin notice automatically.
	 *
	 * @param string|\WP_Error $term The term name or a WP_Error.
	 * @param string $taxonomy The taxonomy slug.
	 *
	 * @return string|\WP_Error
	 */
	public function preventDuplicateEmailOnInsert($term, string $taxonomy)
	{
		if ('ypg_external_content_owner' !== $taxonomy) {
			return $term;
		}

		return $this->validateEmail($term);
	}

	/**
	 * Prevent updating a term if the email is missing, invalid, or already exists on another term.
	 *
	 * Returning a WP_Error from `wp_update_term_data` cancels the update and WordPress
	 * displays the error message as an admin notice automatically.
	 *
	 * @param array $data The term data to be updated.
	 * @param int $termId The term ID.
	 * @param string $taxonomy The taxonomy slug.
	 * @param array $args The raw arguments passed to wp_update_term().
	 *
	 * @return array|\WP_Error
	 */
	public function preventDuplicateEmailOnUpdate(array $data, int $termId, string $taxonomy, array $args)
	{
		if ('ypg_external_content_owner' !== $taxonomy) {
			return $data;
		}

		return $this->validateEmail($data, $termId);
	}

	/**
	 * Force the term slug to be based on the email address after creating or editing.
	 */
	public function handleSaveMeta(int $termId): void
	{
		if (! isset($_POST['ypg_external_content_owner_email'])) {
			return;
		}

		$email = sanitize_email($_POST['ypg_external_content_owner_email']);
		$phoneNumber = trim(sanitize_text_field($_POST['ypg_external_content_owner_phone_number'] ?? ''));

		if ('' === $email || ! is_email($email)) {
			delete_term_meta($termId, 'ypg_external_content_owner_email');

			return;
		}

		$previousEmail = (string) (get_term_meta($termId, 'ypg_external_content_owner_email', true) ?: '');
		$previousPhoneNumber = (string) (get_term_meta($termId, 'ypg_external_content_owner_phone_number', true) ?: '');
		$previousName = '';
		$term = get_term($termId, 'ypg_external_content_owner');
		if ($term && ! is_wp_error($term)) {
			$previousName = $term->name;
		}
		$newName = sanitize_text_field($_POST['name'] ?? $previousName);

		if ('' === $phoneNumber) {
			delete_term_meta($termId, 'ypg_external_content_owner_phone_number');
		}

		update_term_meta($termId, 'ypg_external_content_owner_email', $email);
		update_term_meta($termId, 'ypg_external_content_owner_phone_number', $phoneNumber);

		$ownerChanged = $email !== $previousEmail
			|| $phoneNumber !== $previousPhoneNumber
			|| $newName !== $previousName;

		if ($ownerChanged) {
			$this->cascadeOwnerToPosts($termId, ContentOwnerType::EXTERNAL, [
				'name' => $newName,
				'email' => $email,
				'phone_number' => $phoneNumber,
			]);
		}

		// Force the slug to be based on the email address.
		$slug = sanitize_title($email);

		remove_action('created_ypg_external_content_owner', [$this, 'handleSaveMeta'], 10);
		remove_action('edited_ypg_external_content_owner', [$this, 'handleSaveMeta'], 10);

		wp_update_term($termId, 'ypg_external_content_owner', ['slug' => $slug]);

		add_action('created_ypg_external_content_owner', [$this, 'handleSaveMeta'], 10, 1);
		add_action('edited_ypg_external_content_owner', [$this, 'handleSaveMeta'], 10, 1);
	}

	/**
	 * @param mixed $passthrough Value to return on success.
	 * @param int|null $excludeTermId Term ID to exclude from the duplicate check (for edits).
	 *
	 * @return mixed|\WP_Error
	 */
	private function validateEmail($passthrough, ?int $excludeTermId = null)
	{
		if (! isset($_POST['ypg_external_content_owner_email'])) {
			return new \WP_Error(
				'ypg_missing_email',
				__('Een e-mailadres is verplicht voor een externe inhoudseigenaar.', 'yard-page-guard')
			);
		}

		$email = sanitize_email($_POST['ypg_external_content_owner_email']);

		if ('' === $email || ! is_email($email)) {
			return new \WP_Error(
				'ypg_invalid_email',
				__('Voer een geldig e-mailadres in.', 'yard-page-guard')
			);
		}

		$existingTerms = get_terms([
			'taxonomy' => 'ypg_external_content_owner',
			'hide_empty' => false,
			'meta_key' => 'ypg_external_content_owner_email',
			'meta_value' => $email,
			'fields' => 'ids',
		]);

		if (is_wp_error($existingTerms)) {
			return $passthrough;
		}

		if (null !== $excludeTermId) {
			$existingTerms = array_filter($existingTerms, function ($id) use ($excludeTermId) {
				return (int) $id !== $excludeTermId;
			});
		}

		if (is_array($existingTerms) && count($existingTerms) > 0) {
			return new \WP_Error(
				'ypg_duplicate_email',
				__('Er bestaat al een externe inhoudseigenaar met dit e-mailadres.', 'yard-page-guard')
			);
		}

		return $passthrough;
	}
}
