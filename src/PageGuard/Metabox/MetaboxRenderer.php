<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Text;

/**
 * Renders the Page Guard metabox UI on the post edit screen.
 *
 * Responsibility is limited to producing HTML; persistence lives in
 * {@see MetaboxSaver} and auth lives in {@see MetaboxAccess}.
 */
final class MetaboxRenderer
{
	use Text;

	private MetaboxAccess $access;

	public function __construct(MetaboxAccess $access)
	{
		$this->access = $access;
	}

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
		wp_nonce_field(MetaboxAccess::NONCE_ACTION, 'ypg_metaboxes_nonce');
		echo $this->displayMetaboxesHTML($post->ID);
	}

	private function displayMetaboxesHTML(int $postId): string
	{
		$html = sprintf('<p>%s</p>', __('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'));

		if (! $this->access->currentUserHasAccess($postId)) {
			return $html . sprintf('<p><b>%s</b></p>', __('U heeft geen toestemming om de houdbaarsheids module te bewerken.', 'yard-page-guard'));
		}

		$html = $this->contentOwnerMetabox($html, $postId);
		$html = $this->isVerifiedMetabox($html, $postId);
		$html = $this->reviewDateMetabox($html, $postId);
		$html = $this->reminderMetabox($html, $postId);

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

		$optionsHtml = sprintf(
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

		foreach ($externalUsers as $user) {
			$email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');
			$phoneNumber = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_phone_number', true) ?: '');
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
}
