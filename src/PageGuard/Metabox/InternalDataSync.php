<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

/**
 * Mirrors the assigned content owner to a handful of third-party plugin/theme
 * stores so editors see the owner alongside other "internal" page information:
 *
 * - Fusion portal: CMB2 `_ys_post_information_internal[_title]` post meta.
 * - Fusion PDC: CMB2 `_owc_pdc_internaldata` repeater post meta.
 * - Brave: ACF `internal_information` repeater field.
 *
 * Runs on `save_post`. None of these integrations are required for the plugin
 * to function; missing fields/plugins are silently skipped.
 */
final class InternalDataSync
{
	private MetaboxAccess $access;

	public function __construct(MetaboxAccess $access)
	{
		$this->access = $access;
	}

	public function handleInternalData(int $postId): void
	{
		if (! $this->access->shouldSave($postId)) {
			return;
		}

		if (! isset($_POST['ypg_post_content_owner'])) {
			return;
		}

		if (empty(get_post_meta($postId, 'ypg_post_content_owner_name', true))) {
			$this->removeInternalData($postId);

			return;
		}

		$this->addInternalData($postId);
	}

	private function addInternalData(int $postId): void
	{
		$ownerName = get_post_meta($postId, 'ypg_post_content_owner_name', true) ?: '';
		$ownerEmail = get_post_meta($postId, 'ypg_post_content_owner_email', true) ?: '';
		$ownerPhone = get_post_meta($postId, 'ypg_post_content_owner_phone_number', true) ?: '';

		$title = __('Inhoudseigenarenmodule', 'yard-page-guard');
		$label = __('Inhoudseigenaar', 'yard-page-guard') . ': ';

		$ownerLink = sprintf(
			'%s <a href="mailto:%s">%s</a>',
			$label,
			esc_attr($ownerEmail),
			esc_html($ownerName)
		);

		if ('' !== $ownerPhone) {
			$telNumber = $this->formatPhoneForTel($ownerPhone);
			$phoneDisplay = null !== $telNumber
				? sprintf('<a href="tel:%s">%s</a>', esc_attr($telNumber), esc_html($ownerPhone))
				: esc_html($ownerPhone);
			$ownerLink .= sprintf(' (%s)', $phoneDisplay);
		}

		/**
		 * Fusion portal internal information
		 */
		if (! metadata_exists('post', $postId, '_ys_post_information_internal_title')) {
			update_post_meta($postId, '_ys_post_information_internal_title', $title);
		}

		if (metadata_exists('post', $postId, '_ys_post_information_internal')) {
			$currentValue = get_post_meta($postId, '_ys_post_information_internal', true);

			if (strpos($currentValue, 'mailto:') !== false) {
				$newValue = preg_replace(
					'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?/i',
					$ownerLink,
					$currentValue
				);
			} else {
				$newValue = empty($currentValue)
					? $ownerLink
					: $currentValue . $ownerLink;
			}

			update_post_meta($postId, '_ys_post_information_internal', $newValue);
		} else {
			update_post_meta($postId, '_ys_post_information_internal', $ownerLink);
		}

		/**
		 * Fusion PDC internal information
		 */
		$key = '_owc_pdc_internaldata';
		$current = get_post_meta($postId, $key, true);
		$current = is_array($current) ? $current : [];

		$newValue = [
			'internaldata_key' => $title,
			'internaldata_value' => $ownerLink,
		];

		$updated = false;
		foreach ($current as $i => $row) {
			if (($row['internaldata_key'] ?? '') === $title) {
				$current[$i] = $newValue;
				$updated = true;

				break;
			}
		}

		if (! $updated) {
			$current[] = $newValue;
		}

		update_post_meta($postId, $key, $current);

		/**
		 * Brave internal information
		 */
		if (! function_exists('get_field') || ! function_exists('update_field')) {
			return; // Early return if ACF not active
		}

		$rows = get_field('internal_information', $postId);
		$rows = is_array($rows) ? $rows : [];

		$updated = false;
		foreach ($rows as $i => $row) {
			if (($row['internal_information_title'] ?? '') === $title) {
				$rows[$i]['internal_information_content'] = $ownerLink;
				$updated = true;

				break;
			}
		}

		if (! $updated) {
			$rows[] = [
				'internal_information_title' => $title,
				'internal_information_content' => $ownerLink,
			];
		}

		update_field('internal_information', $rows, $postId);
	}

	private function removeInternalData(int $postId): void
	{
		$newTitle = __('Inhoudseigenarenmodule', 'yard-page-guard');

		/**
		 * Remove entry from single meta fields (fusion portal)
		 */
		if (metadata_exists('post', $postId, '_ys_post_information_internal_title')) {
			$currentTitle = get_post_meta($postId, '_ys_post_information_internal_title', true);

			if ($currentTitle === $newTitle) {
				delete_post_meta($postId, '_ys_post_information_internal_title');
			}
		}

		if (metadata_exists('post', $postId, '_ys_post_information_internal')) {
			$value = get_post_meta($postId, '_ys_post_information_internal', true);

			// Remove the Inhoudseigenaar block (email link + optional phone link)
			$value = preg_replace(
				'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?/i',
				'',
				$value
			);

			update_post_meta($postId, '_ys_post_information_internal', $value);
		}

		/**
		 * Remove entry from Fusion PDC repeater
		 */
		$pdcKey = '_owc_pdc_internaldata';
		$pdcEntries = get_post_meta($postId, $pdcKey, true);

		if (is_array($pdcEntries)) {
			$pdcEntries = array_values(array_filter($pdcEntries, function ($entry) use ($newTitle) {
				return ! (isset($entry['internaldata_key']) && $entry['internaldata_key'] === $newTitle);
			}));

			update_post_meta($postId, $pdcKey, $pdcEntries);
		}

		/**
		 * Remove entry from Brave ACF repeater "internal_information"
		 */
		if (function_exists('get_field') && function_exists('update_field')) {
			$acfRows = get_field('internal_information', $postId);

			if (is_array($acfRows)) {
				$acfRows = array_values(array_filter($acfRows, function ($row) use ($newTitle) {
					return ! (isset($row['internal_information_title']) &&
							  $row['internal_information_title'] === $newTitle);
				}));

				update_field('internal_information', $acfRows, $postId);
			}
		}
	}

	private function formatPhoneForTel(string $phone): ?string
	{
		// Strip formatting humans add for readability — whitespace, dashes,
		// dots and parentheses — leaving only the dialable digits (and a
		// possible leading `+`).
		$cleaned = preg_replace('/[\s\-\.\(\)]/', '', $phone);

		if (str_starts_with($cleaned, '0')) {
			$cleaned = '+31' . substr($cleaned, 1);
		}

		// Accept only a valid E.164 number: a leading `+` followed by 7–15
		// digits. Anything else (letters, extensions, junk) yields no tel: link.
		if (preg_match('/^\+\d{7,15}$/', $cleaned)) {
			return $cleaned;
		}

		return null;
	}
}
