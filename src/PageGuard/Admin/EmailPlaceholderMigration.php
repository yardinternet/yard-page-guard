<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

/**
 * One-off migration: rewrite the legacy numeric `{1}` / `{2}` placeholders in
 * the stored review + reminder email templates to the named `{name}` /
 * `{item_list}` form introduced alongside this class.
 *
 * Runs once per site, gated by the `ypg_email_placeholders_migrated` option.
 * Safe to remove after one release cycle once every install has ticked over.
 */
final class EmailPlaceholderMigration
{
	private const OPTION_KEY = 'ypg_email_placeholders_migrated';

	private const TEMPLATE_OPTIONS = [
		'ypg_review_email_content',
		'ypg_reminder_email_content',
	];

	private const REPLACEMENTS = [
		'{1}' => '{name}',
		'{2}' => '{item_list}',
	];

	public function register(): void
	{
		add_action('admin_init', [$this, 'maybeRun']);
	}

	public function maybeRun(): void
	{
		if (get_option(self::OPTION_KEY)) {
			return;
		}

		foreach (self::TEMPLATE_OPTIONS as $key) {
			$value = get_option($key, '');

			if (! is_string($value) || '' === $value) {
				continue;
			}

			$updated = strtr($value, self::REPLACEMENTS);

			if ($updated !== $value) {
				update_option($key, $updated);
			}
		}

		update_option(self::OPTION_KEY, time(), false);
	}
}
