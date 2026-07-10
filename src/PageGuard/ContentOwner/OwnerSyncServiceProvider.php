<?php

declare(strict_types=1);

namespace Yard\PageGuard\ContentOwner;

use WP_User;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\CascadesOwner;

/**
 * Keeps the denormalised owner meta in sync when the *source* WordPress user
 * behind a content owner is edited (name or email). The external-owner term
 * side of this lives in {@see \Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy}.
 *
 * Registered top-level (not admin-only) so a `wp_update_user()` from any
 * context — profile screen, WP-CLI, another plugin — still reconciles the
 * copies rather than leaving stale owner details on the posts.
 */
final class OwnerSyncServiceProvider extends ServiceProvider
{
	use CascadesOwner;

	public function register(): void
	{
		add_action('profile_update', [$this, 'cascadeUserOwner'], 10, 1);
	}

	public function cascadeUserOwner(int $userId): void
	{
		$user = get_userdata($userId);

		if (! $user instanceof WP_User) {
			return;
		}

		// Mirror how the owner name is derived when assigned in the metabox
		// (see MetaboxRenderer): "First Last", falling back to the display name.
		$name = trim(implode(' ', array_filter([$user->first_name, $user->last_name]))) ?: $user->display_name;

		$this->cascadeOwnerToPosts($userId, ContentOwnerType::USER, [
			'name' => (string) $name,
			'email' => (string) $user->user_email,
		]);
	}
}
