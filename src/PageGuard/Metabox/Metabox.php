<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Meta;
use Yard\PageGuard\Traits\Text;

class Metabox
{
	use Date;
	use Text;
	use Meta;

	public function addMetaboxes(): void
	{
		add_meta_box(
			'yard_page_guard_metaboxes',
			__('Houdbaarsheidsmodule', 'yard-page-guard'),
			[$this, 'displayMetaboxes'],
			apply_filters('yard::page-guard/post-types-to-use', ['page']),
			'side',
			'high'
		);
	}

	public function displayMetaboxes(WP_Post $post): void
	{
		wp_nonce_field(basename(__FILE__), 'ypg_metaboxes_nonce');
		echo $this->displayMetaboxesHTML($post->ID);
	}

	private function displayMetaboxesHTML(int $postId): string
	{
		$html = sprintf('<p>%s</p>', __('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'));

		if ($this->currentUserHasAccess($postId)) {
			$html = $this->contentOwnerMetabox($html, $postId);
			$html = $this->isVerifiedMetabox($html, $postId);
			$html = $this->reviewDateMetabox($html, $postId);
			$html = $this->reminderMetabox($html, $postId);
		} else {
			$html .= sprintf('<p><b>%s</b></p>', __('U heeft geen toestemming om de houdbaarsheids module te bewerken.', 'yard-page-guard'));
		}

		return $html;
	}

	private function contentOwnerMetabox(string $html, int $postId): string
	{
		$contentOwnerId = get_post_meta($postId, 'ypg_post_content_owner_id', true);
		$contentOwnerType = get_post_meta($postId, 'ypg_post_content_owner_type', true);

		$wpUsers = get_users([
			'capability' => 'edit_pages',
		]);

		$externalUsers = get_terms([
			'taxonomy' => 'ypg_external_content_owner',
			'hide_empty' => false,
		]);

		if (is_wp_error($externalUsers)) {
			return '';
		}

		$optionsHtml = '';

		$optionsHtml .= sprintf(
			'<option value="none">%s</option>',
			__('Maak een keuze', 'yard-page-guard')
		);

		foreach ($wpUsers as $user) {
			$name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;
			$selected = ($contentOwnerId == $user->ID && ContentOwnerType::USER === $contentOwnerType) ? ' selected="selected"' : '';

			$optionsHtml .= sprintf(
				'<option value="%s|%s|%s|user"%s>%s</option>',
				esc_attr($user->ID),
				esc_attr($name),
				esc_attr($user->user_email),
				$selected,
				esc_html($user->display_name)
			);
		}

		if (! is_wp_error($externalUsers)) {
			foreach ($externalUsers as $user) {
				$email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');
				$selected = ($contentOwnerId == $user->term_id && ContentOwnerType::EXTERNAL === $contentOwnerType) ? ' selected="selected"' : '';

				$optionsHtml .= sprintf(
					'<option value="%s|%s|%s|external"%s>%s (%s)</option>',
					esc_attr($user->term_id),
					esc_attr($user->name),
					esc_attr($email),
					$selected,
					esc_html($user->name),
					__('Extern', 'yard-page-guard')
				);
			}
		}

		$label = __('Inhoudseigenaar', 'yard-page-guard');

		$html .= <<<HTML
		<div class="ypg-metabox-wrapper flex-column">
			<label for="ypg_post_content_owner">$label:</label>
			<select name="ypg_post_content_owner" id="ypg_post_content_owner">
				$optionsHtml
			</select>
		</div>
		HTML;

		return $html;
	}

	private function isVerifiedMetabox(string $html, int $postId): string
	{
		$isVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
		$checked = checked($isVerified, 1, false);
		$label = __('Gecontroleerd?', 'yard-page-guard');

		$html .= <<<HTML
		<div class="ypg-metabox-wrapper">
			<label for="ypg_is_verified">
				<input type="checkbox" name="ypg_is_verified" id="ypg_is_verified" value="1"$checked/>
				$label
			</label>
		</div>
		HTML;

		return $html;
	}

	private function reviewDateMetabox(string $html, int $postId): string
	{
		$reviewDate = get_post_meta($postId, 'ypg_review_date', true);
		$isVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);

		$label = $isVerified
			? __('Volgende herzieningsdatum', 'yard-page-guard')
			: __('Herzieningsdatum', 'yard-page-guard');

		$message = $isVerified
			? __('Het vinkje wordt op de datum hierboven weer weggehaald voor een nieuwe controle. Er wordt dan ook een mail verstuurd naar de eigenaar.', 'yard-page-guard')
			: __('De controle notificatie wordt (of is al) via de e-mail verstuurd op de ingestelde datum.', 'yard-page-guard');

		$reviewDateEscaped = esc_attr($reviewDate);
		$minDate = esc_attr(date('Y-m-d'));

		$html .= <<<HTML
		<div class="ypg-metabox-wrapper flex-column">
			<label for="ypg_review_date">$label:</label>
			<input type="date" name="ypg_review_date" id="ypg_review_date" value="$reviewDateEscaped" min="$minDate" />
			<p style="margin-bottom: 0">$message</p>
		</div>
		HTML;

		return $html;
	}

	private function reminderMetabox(string $html, int $postId): string
	{
		$postUnit = get_post_meta($postId, 'ypg_reminder_time_unit', true);
		$postPeriod = get_post_meta($postId, 'ypg_reminder_time_period', true);
		$isDefault = empty($postPeriod) || empty($postUnit);
		$customReminderAriaHidden = $isDefault ? 'true' : 'false';
		$currentUnit = ! empty($postUnit) ? $postUnit : get_option('ypg_reminder_time_unit', 'weeks');
		$currentPeriod = ! empty($postPeriod) ? $postPeriod : get_option('ypg_reminder_time_period', 1);

		$unitOptionElements = '';

		foreach ($this->getUnitOptions() as $unitValue => $label) {
			$unitOptionElements .= sprintf('<option value="%s" %s>%s</option>', $unitValue, selected($currentUnit, $unitValue, false), $label);
		}

		$reminderTypes = ['default' => __('Standaard', 'yard-page-guard'), 'custom' => __('Aangepast', 'yard-page-guard')];
		$typeOptionElements = '';

		foreach ($reminderTypes as $value => $label) {
			$checked = checked($isDefault, 'default' === $value, false);

			$typeOptionElements .= <<<HTML
			<div>
					<input type="radio" id="ypg-reminder-$value" name="ypg_reminder_type" value="$value" $checked/>
					<label for="ypg-reminder-$value">$label</label>
			</div>
			HTML;
		}

		$label = __('Herinnering periode', 'yard-page-guard');

		$html .= <<<HTML
		<div class="ypg-metabox-wrapper flex-column mb-0">
			<label for="ypg_reminder_date">$label:</label>

			<fieldset id="ypg-reminder-type-radio">
				$typeOptionElements
			</fieldset>

			<div class="ypg-reminder-date-input-wrapper" aria-hidden="$customReminderAriaHidden">
				<div class="d-flex">
					<input class="w-full" type="number" name="ypg_reminder_time_period" value="$currentPeriod" min="1" />
					<select class="w-full" name="ypg_reminder_time_unit">
						$unitOptionElements
					</select>
				</div>
			</div>
		</div>
		HTML;

		return $html;
	}

	public function saveMetaValues(int $postId): void
	{
		if (! $this->shouldSave($postId)) {
			return;
		}

		if (! isset($_POST['ypg_post_content_owner'])) {
			return;
		}

		$contentOwner = sanitize_text_field($_POST['ypg_post_content_owner']);

		if ('none' === $contentOwner) {
			$this->clearReviewMeta($postId);

			return;
		}

		$ownerData = $this->parseContentOwnerData($contentOwner);
		$this->updateOwnerMeta($postId, $ownerData);

		$wasPreviouslyVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
		$toBeVerified = isset($_POST['ypg_is_verified']);

		// Remove mail sent status if verified (date will update) OR post is manually being unverified
		if ($toBeVerified || ! $toBeVerified && $wasPreviouslyVerified) {
			delete_post_meta($postId, 'ypg_review_mail_sent');
			delete_post_meta($postId, 'ypg_last_reminder_date');
		}

		if ('custom' === ($_POST['ypg_reminder_type'] ?? 'standard')) {
			update_post_meta($postId, 'ypg_reminder_time_period', $_POST['ypg_reminder_time_period']);
			update_post_meta($postId, 'ypg_reminder_time_unit', $_POST['ypg_reminder_time_unit']);
		} else {
			delete_post_meta($postId, 'ypg_reminder_time_period');
			delete_post_meta($postId, 'ypg_reminder_time_unit');
		}

		$reviewDate = $this->computeReviewDate($toBeVerified, $wasPreviouslyVerified);
		$reminderDate = $this->computeReminderDate($postId, $toBeVerified, $wasPreviouslyVerified);

		$this->updateVerificationMeta($postId, $toBeVerified, $reviewDate, $reminderDate);
	}

	private function updateOwnerMeta(int $postId, array $ownerData): void
	{
		update_post_meta($postId, 'ypg_post_content_owner_id', $ownerData['id']);
		update_post_meta($postId, 'ypg_post_content_owner_name', $ownerData['name']);
		update_post_meta($postId, 'ypg_post_content_owner_email', $ownerData['email']);
		update_post_meta($postId, 'ypg_post_content_owner_type', $ownerData['type']);
	}

	private function updateVerificationMeta(int $postId, bool $isVerified, string $reviewDate, string $reminderDate): void
	{
		update_post_meta($postId, 'ypg_is_verified', (int) $isVerified);
		update_post_meta($postId, 'ypg_review_date', $reviewDate);
		update_post_meta($postId, 'ypg_reminder_date', $reminderDate);

		if ($isVerified) {
			update_post_meta($postId, 'ypg_last_review_date', date('Y-m-d'));
		}
	}

	private function shouldSave(int $postId): bool
	{
		// Check save location
		if (isset($_POST['ypg_metaboxes_nonce'])) {
			if (! wp_verify_nonce($_POST['ypg_metaboxes_nonce'], basename(__FILE__))) {
				return false;
			}
		} elseif (isset($_POST['_inline_edit'])) {
			if (! wp_verify_nonce($_POST['_inline_edit'], 'inlineeditnonce')) {
				return false;
			}
		} elseif (isset($_REQUEST['_wpnonce'])) {
			if (! wp_verify_nonce($_REQUEST['_wpnonce'], 'bulk-posts')) {
				return false;
			}

			// Keys to copy from $_REQUEST (in case of bulk edit) to $_POST
			$keys = ['ypg_post_content_owner', 'ypg_review_date', 'ypg_is_verified', 'post_type'];

			foreach ($keys as $key) {
				if (isset($_REQUEST[$key])) {
					$_POST[$key] = $_REQUEST[$key];
				}
			}
		} else {
			return false;
		}

		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return false;
		}

		$postTypes = apply_filters('yard::page-guard/post-types-to-use', ['page']);
		if (! isset($_POST['post_type']) || ! in_array($_POST['post_type'], $postTypes, true)) {
			return false;
		}

		if (! current_user_can('edit_pages', $postId)) {
			return false;
		}

		if (! $this->currentUserHasAccess($postId)) {
			return false;
		}

		return true;
	}

	private function currentUserHasAccess(int $postId): bool
	{
		$post = get_post($postId);
		$contentOwnerId = get_post_meta($postId, 'ypg_post_content_owner_id', true) ?: '';
		$contentOwnerType = get_post_meta($postId, 'ypg_post_content_owner_type', true);
		$currentUser = wp_get_current_user();

		// Regardless of content owner type: newly created posts, administrators, current user is author or no content owner set
		if (0 === strlen($post->post_name) || in_array('administrator', $currentUser->roles) || in_array('yard_superuser', $currentUser->roles) || '' === $contentOwnerId || $currentUser->ID === $post->post_author) {
			return true;
		}

		return (int) $contentOwnerId === $currentUser->ID && ContentOwnerType::USER === $contentOwnerType;
	}

	public function handleInternalData(int $postId): void
	{
		if (! $this->shouldSave($postId)) {
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

		$title = __('Houdbaarheidsmodule', 'yard-page-guard');
		$label = __('Inhoudseigenaar', 'yard-page-guard') . ': ';

		$ownerLink = sprintf(
			'%s <a href="mailto:%s">%s</a>',
			$label,
			esc_attr($ownerEmail),
			esc_html($ownerName)
		);

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
					'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>/i',
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
		$newTitle = __('Houdbaarheidsmodule', 'yard-page-guard');

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

			// Remove the Inhoudseigenaar mailto link if it exists
			$value = preg_replace(
				'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>/i',
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
}
