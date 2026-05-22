<?php

declare(strict_types=1);

namespace Yard\PageGuard\Foundation;

use WP_Role;

/**
 * Capability gate for the settings page and metabox access check.
 *
 * Uses a plugin-private capability (`yard_manage_page_guard`) so cap checks
 * can't collide with the semantics of stock WordPress caps the host site
 * already uses elsewhere. The cap is stored on roles: it is added to the
 * configured roles on activation (see {@see addToRoles()}) and removed again
 * on deactivation (see {@see removeFromRoles()}), so a user's effective caps
 * stay in the database where WordPress, other plugins and role editors expect
 * them — no per-request `user_has_cap` filtering.
 *
 * Two filters tune the behaviour:
 *  - `yard::page-guard/admin-capability` swaps the cap name itself, so a site
 *    can scope access to a different *existing* cap (e.g. `edit_others_pages`).
 *    When the name is filtered away from the default, role grants are left
 *    untouched: the site already owns that cap and we must not add or strip it.
 *  - `yard::page-guard/admin-roles` chooses which roles receive the cap on
 *    activation (default: just `administrator`).
 */
final class AdminCapability
{
	public const DEFAULT = 'yard_manage_page_guard';
	public const FILTER = 'yard::page-guard/admin-capability';
	public const ROLES_FILTER = 'yard::page-guard/admin-roles';

	/** @var array<int,string> */
	public const DEFAULT_ROLES = ['administrator', 'superuser', 'yard_superuser', 'super-user'];

	private static ?string $cached = null;

	public static function name(): string
	{
		return self::$cached ??= (string) apply_filters(self::FILTER, self::DEFAULT);
	}

	/**
	 * Roles that receive the capability on activation.
	 *
	 * @return array<int,string>
	 */
	public static function roles(): array
	{
		return array_values(array_filter((array) apply_filters(self::ROLES_FILTER, self::DEFAULT_ROLES), 'is_string'));
	}

	/**
	 * Grant the capability to the configured roles. Called on activation and
	 * once on existing installs (see {@see AdminCapabilityMigration}).
	 *
	 * No-op when the cap name has been filtered away from the default: a site
	 * pointing the gate at an existing cap owns that cap and we must not touch
	 * which roles hold it.
	 */
	public static function addToRoles(): void
	{
		if (self::DEFAULT !== self::name()) {
			return;
		}

		foreach (self::roles() as $roleName) {
			$role = get_role($roleName);
			if ($role instanceof WP_Role) {
				$role->add_cap(self::DEFAULT);
			}
		}
	}

	/**
	 * Remove the capability from the configured roles. Called on deactivation.
	 *
	 * Mirrors {@see addToRoles()}: only the plugin's own default cap is ever
	 * stripped, never an existing cap a site mapped the gate onto.
	 */
	public static function removeFromRoles(): void
	{
		if (self::DEFAULT !== self::name()) {
			return;
		}

		foreach (self::roles() as $roleName) {
			$role = get_role($roleName);
			if ($role instanceof WP_Role) {
				$role->remove_cap(self::DEFAULT);
			}
		}
	}

	/**
	 * Clear the per-request cache. Test-only.
	 */
	public static function reset(): void
	{
		self::$cached = null;
	}
}
