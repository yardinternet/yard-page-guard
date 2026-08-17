<?php

declare(strict_types=1);

namespace Yard\PageGuard\Taxonomy;

use WP_Term;
use Yard\PageGuard\Meta\TermMeta;
use Yard\PageGuard\Traits\AdminPermissions;
use Yard\PageGuard\Traits\FormField;
use Yard\PageGuard\Traits\PostTypes;

class ExternalOwnerTaxonomy
{
	public const TAXONOMY = 'ypg_external_content_owner';

	use AdminPermissions;
	use PostTypes;
	use FormField;

	public function register(): void
	{
		register_taxonomy(self::TAXONOMY, $this->getPostTypes(), [
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
			'meta_box_cb' => false,
			'show_in_menu' => false,
			'hierarchical' => false,
			'capabilities' => [
				'manage_terms' => $this->adminCapability(),
				'edit_terms' => $this->adminCapability(),
				'delete_terms' => $this->adminCapability(),
				'assign_terms' => $this->adminCapability(),
			],
		]);
	}

	public function addInsertFormFields(): void
	{
		echo $this->renderInput([
			'type' => 'email',
			'name' => TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL,
			'label' => __('E-mailadres', 'yard-page-guard'),
			'required' => true,
			'description' => __('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'),
		]);

		echo $this->renderInput([
			'type' => 'text',
			'name' => TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER,
			'label' => __('Telefoonnummer', 'yard-page-guard'),
			'description' => __('Voer het telefoonnummer van de externe inhoudseigenaar in.', 'yard-page-guard'),
		]);
	}

	public function addUpdateFormFields(WP_Term $user): void
	{
		echo $this->renderInput([
			'type' => 'email',
			'name' => TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL,
			'label' => __('E-mailadres', 'yard-page-guard'),
			'required' => true,
			'value' => get_term_meta($user->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true) ?: '',
			'description' => __('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'),
		], true);

		echo $this->renderInput([
			'type' => 'text',
			'name' => TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER,
			'label' => __('Telefoonnummer', 'yard-page-guard'),
			'value' => get_term_meta($user->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, true) ?: '',
			'description' => __('Voer het telefoonnummer van de externe inhoudseigenaar in.', 'yard-page-guard'),
		], true);
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
		if (ExternalOwnerTaxonomy::TAXONOMY !== $taxonomy) {
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
		if (ExternalOwnerTaxonomy::TAXONOMY !== $taxonomy) {
			return $data;
		}

		return $this->validateEmail($data, $termId);
	}

	/**
	 * Force the term slug to be based on the email address after creating or editing.
	 */
	public function handleSaveMeta(int $termId, int $ttId, array $args): void
	{
		if (! isset($args[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL])) {
			return;
		}

		$email = sanitize_email($args[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL]);
		$phoneNumber = trim(sanitize_text_field($args[TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER] ?? ''));

		if ('' === $email || ! is_email($email)) {
			delete_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL); //FIXME: dit kan niet gebeuren

			return;
		}

		if ('' === $phoneNumber) {
			delete_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER);
		}

		update_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, $email);
		update_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, $phoneNumber);
	}

	/**
	 * @param mixed $passthrough Value to return on success.
	 * @param int|null $excludeTermId Term ID to exclude from the duplicate check (for edits).
	 *
	 * @return mixed|\WP_Error
	 */
	private function validateEmail($passthrough, ?int $excludeTermId = null)
	{
		if (! isset($_POST[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL])) {
			return new \WP_Error(
				'ypg_missing_email',
				__('Een e-mailadres is verplicht voor een externe inhoudseigenaar.', 'yard-page-guard')
			);
		}

		$email = sanitize_email($_POST[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL]);

		if ('' === $email || ! is_email($email)) {
			return new \WP_Error(
				'ypg_invalid_email',
				__('Voer een geldig e-mailadres in.', 'yard-page-guard')
			);
		}

		$existingTerms = get_terms([
			'taxonomy' => ExternalOwnerTaxonomy::TAXONOMY,
			'hide_empty' => false,
			'meta_key' => TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL,
			'meta_value' => $email,
			'fields' => 'ids',
			'exclude' => $excludeTermId,
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

	public function setSlugFromEmailOnInsert(array $data, string $taxonomy, array $args): array
	{
		if (ExternalOwnerTaxonomy::TAXONOMY !== $taxonomy || ! isset($args[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL])) {
			return $data;
		}

		$email = sanitize_email($args[TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL]);

		if ('' === $email || ! is_email($email)) {
			return $data;
		}

		$data['slug'] = sanitize_title($email);

		return $data;
	}

	public function setSlugFromEmailOnUpdate(array $data, int $termId, string $taxonomy, array $args): array
	{
		return $this->setSlugFromEmailOnInsert($data, $taxonomy, $args);
	}
}
