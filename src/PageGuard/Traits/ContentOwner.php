<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait ContentOwner
{
	/**
	 * All selectable content owners: WP users with the admin capability and
	 * external content owner terms, keyed by their prefixed identifier.
	 *
	 * @return array<string, string> [ 'user_1' => 'Name', 'term_2' => 'Name (extern)' ]
	 */
	public function getContentOwnerOptions(): array
	{
		$wpUsers = get_users([
			'capability' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
		]);
		$wpUsers = array_map(function (\WP_User $user) {
			return [
				'id' => "user_{$user->ID}",
				'name' => $user->display_name,
			];
		}, $wpUsers);

		$externalUsers = get_terms([
			'taxonomy' => 'ypg_external_content_owner',
			'hide_empty' => false,
		]);
		$externalUsers = is_array($externalUsers) ? $externalUsers : [];
		$externalUsers = array_map(function (\WP_Term $term) {
			return [
				'id' => "term_{$term->term_id}",
				'name' => sprintf('%s (extern)', $term->name),
			];
		}, $externalUsers);
		$contentOwnerOptions = array_merge($wpUsers, $externalUsers);

		return array_column($contentOwnerOptions, 'name', 'id');
	}

	/**
	 * Content owners in the shape SelectControl expects.
	 *
	 * @return array<int, array{value: string, label: string}>
	 */
	public function getContentOwnerSelectOptions(): array
	{
		$options = [];

		foreach ($this->getContentOwnerOptions() as $value => $label) {
			$options[] = [
				'value' => (string) $value,
				'label' => $label,
			];
		}

		return $options;
	}
}
