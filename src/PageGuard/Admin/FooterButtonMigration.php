<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin;

/**
 * One-off migration: rewrite the legacy "bold link" button pattern in the
 * modal footer to the explicit `<a class="ypg-button">` form used by the new
 * Lexical-based button feature.
 *
 * Old: `<a href="…"><strong>Label</strong></a>` (and the reverse nesting).
 * New: `<a class="ypg-button" href="…">Label</a>`.
 *
 * Runs once per site, gated by the `ypg_footer_buttons_migrated` option.
 * Safe to remove after one release cycle.
 */
final class FooterButtonMigration
{
	private const OPTION_KEY = 'ypg_footer_buttons_migrated';

	private const TARGET_OPTION = 'ypg_modal_footer_content';

	public function register(): void
	{
		add_action('admin_init', [$this, 'maybeRun']);
	}

	public function maybeRun(): void
	{
		if (get_option(self::OPTION_KEY)) {
			return;
		}

		$value = (string) get_option(self::TARGET_OPTION, '');

		if ('' !== $value) {
			$migrated = $this->convertButtons($value);

			if ($migrated !== $value) {
				update_option(self::TARGET_OPTION, $migrated);
			}
		}

		update_option(self::OPTION_KEY, time(), false);
	}

	private function convertButtons(string $html): string
	{
		// <a [attrs] href="X" [attrs]><strong>Label</strong></a>
		$html = preg_replace_callback(
			'#<a\b[^>]*?href=(["\'])([^"\']*)\1[^>]*>\s*<strong>(.+?)</strong>\s*</a>#is',
			static fn ($m) => sprintf(
				'<a class="ypg-button" href="%s">%s</a>',
				esc_url($m[2]),
				$m[3]
			),
			$html
		) ?? $html;

		// <strong><a [attrs] href="X" [attrs]>Label</a></strong>
		$html = preg_replace_callback(
			'#<strong>\s*<a\b[^>]*?href=(["\'])([^"\']*)\1[^>]*>(.+?)</a>\s*</strong>#is',
			static fn ($m) => sprintf(
				'<a class="ypg-button" href="%s">%s</a>',
				esc_url($m[2]),
				$m[3]
			),
			$html
		) ?? $html;

		return $html;
	}
}
