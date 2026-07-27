<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Enums\TermMeta;
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
		$contentOwnerId = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_ID, true);
		$contentOwnerType = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_TYPE, true);

		$wpUsers = get_users([
			'capability' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
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
				$email = (string) (get_term_meta($user->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true) ?: '');
				$phoneNumber = (string) (get_term_meta($user->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, true) ?: '');
				$selected = ($contentOwnerId == $user->term_id && ContentOwnerType::EXTERNAL === $contentOwnerType) ? ' selected="selected"' : '';

				$optionsHtml .= sprintf(
					'<option value="%s|%s|%s|external|%s"%s>%s (%s)</option>',
					esc_attr($user->term_id),
					esc_attr($user->name),
					esc_attr($email),
					esc_attr($phoneNumber),
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
		$isVerified = (bool) get_post_meta($postId, PostMeta::IS_VERIFIED, true);
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
		$reviewDate = get_post_meta($postId, PostMeta::REVIEW_DATE, true);
		$isVerified = (bool) get_post_meta($postId, PostMeta::IS_VERIFIED, true);

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
		$postUnit = get_post_meta($postId, PostMeta::REMINDER_TIME_UNIT, true);
		$postPeriod = get_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD, true);
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

		$wasPreviouslyVerified = (bool) get_post_meta($postId, PostMeta::IS_VERIFIED, true);
		$toBeVerified = isset($_POST['ypg_is_verified']);

		// Remove mail sent status if verified (date will update) OR post is manually being unverified
		if ($toBeVerified || ! $toBeVerified && $wasPreviouslyVerified) {
			delete_post_meta($postId, PostMeta::REVIEW_MAIL_SENT);
			delete_post_meta($postId, PostMeta::LAST_REMINDER_DATE);
		}

		if ('custom' === ($_POST['ypg_reminder_type'] ?? 'standard')) {
			update_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD, $_POST['ypg_reminder_time_period']);
			update_post_meta($postId, PostMeta::REMINDER_TIME_UNIT, $_POST['ypg_reminder_time_unit']);
		} else {
			delete_post_meta($postId, PostMeta::REMINDER_TIME_PERIOD);
			delete_post_meta($postId, PostMeta::REMINDER_TIME_UNIT);
		}

		$reviewDate = $this->computeReviewDate($postId, $toBeVerified, $wasPreviouslyVerified);
		$reminderDate = $this->computeReminderDate($postId, $toBeVerified, $wasPreviouslyVerified, $reviewDate);

		$this->updateVerificationMeta($postId, $toBeVerified, $reviewDate, $reminderDate);
	}

	private function updateOwnerMeta(int $postId, array $ownerData): void
	{
		update_post_meta($postId, PostMeta::POST_CONTENT_OWNER_ID, $ownerData['id']);
		update_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, $ownerData['name']);
		update_post_meta($postId, PostMeta::POST_CONTENT_OWNER_EMAIL, $ownerData['email']);
		update_post_meta($postId, PostMeta::POST_CONTENT_OWNER_TYPE, $ownerData['type']);
		update_post_meta($postId, PostMeta::POST_CONTENT_OWNER_PHONE_NUMBER, $ownerData['phone_number']);
	}

	private function updateVerificationMeta(int $postId, bool $isVerified, string $reviewDate, string $reminderDate): void
	{
		update_post_meta($postId, PostMeta::IS_VERIFIED, (int) $isVerified);
		update_post_meta($postId, PostMeta::REVIEW_DATE, $reviewDate);
		update_post_meta($postId, PostMeta::REMINDER_DATE, $reminderDate);

		if ($isVerified) {
			update_post_meta($postId, PostMeta::LAST_REVIEW_DATE, date('Y-m-d'));
		}
	}

	private function shouldSave(int $postId): bool
	{
		// Check save location
		if (isset($_POST['ypg_metaboxes_nonce'])) {
			if (! wp_verify_nonce($_POST['ypg_metaboxes_nonce'], basename(__FILE__))) {
				return false;
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

		if (! current_user_can(apply_filters('yard::page-guard/capability/admin', 'edit_pages'), $postId)) {
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
		$contentOwnerId = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_ID, true) ?: '';
		$contentOwnerType = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_TYPE, true);
		$currentUser = wp_get_current_user();

		// Make admin roles filterable
		$defaultRoles = ['administrator', 'yard_superuser', 'super-user', 'superuser'];
		$adminRoles = apply_filters('yard::page-guard/admin-roles', $defaultRoles);

		// Regardless of content owner type: newly created posts, allowed roles, current user is author or no content owner set
		if (
			0 === strlen($post->post_name)
			|| count(array_intersect($adminRoles, (array) $currentUser->roles)) > 0
			|| '' === $contentOwnerId
			|| $currentUser->ID === $post->post_author
		) {
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

		$contentOwnerName = trim((string) (get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, true) ?: ''));

		if ('' === $contentOwnerName) {
			$this->removeInternalData($postId);

			return;
		}

		$internalDataSyncEnabled = (bool) apply_filters('yard::page-guard/enable-internal-data-sync', $this->owcInternalDataPluginsActive());

		if (! $internalDataSyncEnabled) {
			return;
		}

		$this->addInternalData($postId);
	}

	private function owcInternalDataPluginsActive(): bool
	{
		static $cached = null;

		if (null !== $cached) {
			return $cached;
		}

		if (! function_exists('is_plugin_active') && defined('ABSPATH')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if (function_exists('is_plugin_active')) {
			if (is_plugin_active('pdc-internal-products/pdc-internal-products.php') || is_plugin_active('openpub-internal-data/pub-internal-products.php')) {
				return $cached = true;
			}
		}

		foreach (get_declared_classes() as $class) {
			if (strpos($class, 'Yard\\OWC\\') === 0) {
				return $cached = true;
			}
		}

		return $cached = false;
	}

	private function addInternalData(int $postId): void
	{
		$ownerName = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, true) ?: '';
		$ownerEmail = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_EMAIL, true) ?: '';
		$ownerPhone = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_PHONE_NUMBER, true) ?: '';

		$title = __('Houdbaarheidsmodule', 'yard-page-guard');
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
		if (function_exists('get_field') && function_exists('update_field')) {
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

		do_action('yard::page-guard/after-internal-data-synced', $postId, $ownerLink, $title);
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

		do_action('yard::page-guard/after-internal-data-removed', $postId);
	}

	private function formatPhoneForTel(string $phone): ?string
	{
		$cleaned = preg_replace('/[\s\-\.\(\)]/', '', $phone);

		if (str_starts_with($cleaned, '0')) {
			$cleaned = '+31' . substr($cleaned, 1);
		}

		if (preg_match('/^\+\d{7,15}$/', $cleaned)) {
			return $cleaned;
		}

		return null;
	}
}
