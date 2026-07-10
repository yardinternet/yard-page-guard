<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

/**
 * One-off migration: rewrite the legacy 'Houdbaarheidsmodule' identifier (and
 * its en_GB translation 'Content Review Module') used by {@see InternalDataSync}
 * to write into third-party stores so existing entries stay reachable for
 * update/remove after the source string was renamed to 'Inhoudseigenarenmodule'.
 *
 * Runs once per site, gated by the `ypg_internal_data_title_migrated` option.
 * Safe to remove after one release cycle once every install has ticked over.
 */
final class InternalDataSyncMigration
{
	private const OPTION_KEY = 'ypg_internal_data_title_migrated';

	/**
	 * Source string + every shipped translation prior to the rename. Anything a
	 * production site could have written to third-party meta under the old name.
	 */
	private const LEGACY_TITLES = ['Houdbaarheidsmodule', 'Content Review Module'];

	public function register(): void
	{
		add_action('admin_init', [$this, 'maybeRun']);
	}

	public function maybeRun(): void
	{
		if (get_option(self::OPTION_KEY)) {
			return;
		}

		$newTitle = __('Inhoudseigenarenmodule', 'yard-page-guard');

		foreach (self::LEGACY_TITLES as $oldTitle) {
			if ($oldTitle === $newTitle) {
				continue;
			}

			$this->migrate($oldTitle, $newTitle);
		}

		update_option(self::OPTION_KEY, time(), false);
	}

	private function migrate(string $oldTitle, string $newTitle): void
	{
		global $wpdb;

		// Fusion portal: single-value meta — rewrite in place.
		$wpdb->update(
			$wpdb->postmeta,
			['meta_value' => $newTitle],
			[
				'meta_key' => '_ys_post_information_internal_title',
				'meta_value' => $oldTitle,
			]
		);

		$this->migrateRepeater(
			'_owc_pdc_internaldata',
			'internaldata_key',
			$oldTitle,
			$newTitle,
			static fn (int $postId, array $entries) => update_post_meta($postId, '_owc_pdc_internaldata', $entries)
		);

		if (function_exists('get_field') && function_exists('update_field')) {
			$this->migrateRepeater(
				'internal_information',
				'internal_information_title',
				$oldTitle,
				$newTitle,
				static fn (int $postId, array $entries) => update_field('internal_information', $entries, $postId),
				static fn (int $postId) => get_field('internal_information', $postId)
			);
		}
	}

	/**
	 * @param callable(int,array<int,array<string,mixed>>):void $write
	 * @param ?callable(int):mixed                              $read   Defaults to raw post meta.
	 */
	private function migrateRepeater(
		string $metaKey,
		string $entryKey,
		string $oldTitle,
		string $newTitle,
		callable $write,
		?callable $read = null
	): void {
		global $wpdb;

		$postIds = $wpdb->get_col($wpdb->prepare(
			"SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value LIKE %s",
			$metaKey,
			'%' . $wpdb->esc_like($oldTitle) . '%'
		));

		foreach ($postIds as $postId) {
			$postId = (int) $postId;
			$entries = null !== $read ? $read($postId) : get_post_meta($postId, $metaKey, true);

			if (! is_array($entries)) {
				continue;
			}

			$changed = false;
			foreach ($entries as $i => $entry) {
				if (is_array($entry) && ($entry[$entryKey] ?? null) === $oldTitle) {
					$entries[$i][$entryKey] = $newTitle;
					$changed = true;
				}
			}

			if ($changed) {
				$write($postId, $entries);
			}
		}
	}
}
