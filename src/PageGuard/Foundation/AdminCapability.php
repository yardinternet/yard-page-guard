<?php

declare(strict_types=1);

namespace Yard\PageGuard\Foundation;

use WP_User;

/**
 * Custom capability shared by the settings page and the metabox access check.
 *
 * Granted dynamically via `user_has_cap` to anyone whose roles intersect the
 * filterable `yard::page-guard/admin-roles` list. Dynamic grant (vs. add_cap
 * on activation) keeps that filter as the single source of truth — no role
 * storage to migrate when the filter changes.
 */
final class AdminCapability
{
	public const NAME = 'yard_manage_page_guard';

	public const DEFAULT_ADMIN_ROLES = ['administrator', 'yard_superuser', 'super-user', 'superuser'];

	public static function register(): void
	{
		add_filter('user_has_cap', [self::class, 'grantToAdminRoles'], 10, 4);
	}

	/**
	 * @param array<string,bool> $allcaps
	 * @param array<int,string>  $caps
	 * @param array<int,mixed>   $args
	 */
	public static function grantToAdminRoles(array $allcaps, array $caps, array $args, WP_User $user): array
	{
		$adminRoles = apply_filters('yard::page-guard/admin-roles', self::DEFAULT_ADMIN_ROLES);

		if (count(array_intersect($adminRoles, (array) $user->roles)) > 0) {
			$allcaps[self::NAME] = true;
		}

		return $allcaps;
	}
}
