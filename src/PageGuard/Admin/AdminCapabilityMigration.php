<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * One-off migration: grant the plugin's admin capability to the configured
 * roles on installs that were already active before the capability moved from
 * a runtime `user_has_cap` grant to stored role caps.
 *
 * The activation hook only fires on (re)activation, so without this an
 * already-active site would silently lose access on upgrade. Gated by the
 * `ypg_admin_capability_migrated` option so it runs at most once.
 *
 * Safe to remove after one release cycle once every install has ticked over.
 */
final class AdminCapabilityMigration
{
	private const OPTION_KEY = 'ypg_admin_capability_migrated';

	public function register(): void
	{
		add_action('admin_init', [$this, 'maybeRun']);
	}

	public function maybeRun(): void
	{
		if (get_option(self::OPTION_KEY)) {
			return;
		}

		AdminCapability::addToRoles();

		update_option(self::OPTION_KEY, time(), false);
	}
}
