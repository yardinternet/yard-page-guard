<?php

declare(strict_types=1);

namespace Yard\PageGuard\Repositories;

use WP_Term;
use WP_User;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Models\ContentOwner;

/**
 * Reads the content owners that can be assigned to a post: WP users holding the
 * admin capability and terms of the external content owner taxonomy.
 */
class ContentOwnerRepository
{
	public const TAXONOMY = 'ypg_external_content_owner';

	/**
	 * @return ContentOwner[]
	 */
	public function all(): array
	{
		return array_merge($this->users(), $this->externals());
	}

	/**
	 * @return ContentOwner[]
	 */
	public function users(): array
	{
		$users = get_users([
			'capability' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
		]);

		return array_map(function (WP_User $user) {
			return new ContentOwner(
				$user->ID,
				$user->display_name,
				$user->user_email,
				ContentOwnerType::USER
			);
		}, $users);
	}

	/**
	 * @return ContentOwner[]
	 */
	public function externals(): array
	{
		$terms = get_terms([
			'taxonomy' => self::TAXONOMY,
			'hide_empty' => false,
		]);

		if (! is_array($terms)) {
			return [];
		}

		return array_map(function (WP_Term $term) {
			return new ContentOwner(
				$term->term_id,
				$term->name,
				(string) (get_term_meta($term->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true) ?: ''),
				ContentOwnerType::EXTERNAL
			);
		}, $terms);
	}
}
