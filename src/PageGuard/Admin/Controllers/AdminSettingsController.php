<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

use Yard\PageGuard\Enums\TimeUnit;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\AdminPermissions;

class AdminSettingsController
{
	use AdminPermissions;

	public const PAGE_SLUG = 'page-guard-settings';

	public const SECTION_EMAIL = 'email_settings';
	public const SECTION_REVIEW = 'review_settings';
	public const SECTION_REMINDER = 'reminder_settings';
	public const SECTION_MODAL = 'modal_settings';
	public const SECTION_INTERNAL_INFORMATION = 'internal_information_settings';

	public function init(): void
	{
		add_action('admin_menu', [$this, 'addSettingsPage']);
		add_action('admin_init', [$this, 'addSettingsFields']);
		add_filter('option_page_capability_ypg_settings', fn () => $this->adminCapability());
	}

	public function addSettingsPage(): void
	{
		add_options_page(
			__('Inhoudscontrole', 'yard-page-guard'),
			__('Inhoudscontrole', 'yard-page-guard'),
			$this->adminCapability(),
			self::PAGE_SLUG,
			[$this, 'renderSettingsPage']
		);
	}

	public function addSettingsFields(): void
	{
		add_settings_section(
			self::SECTION_EMAIL,
			__('E-mails', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Settings::EMAIL_FROM_NAME,
			__('Afzend naam', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			self::SECTION_EMAIL,
			[
				'type' => 'text',
				'name' => Settings::EMAIL_FROM_NAME,
				'label_for' => Settings::EMAIL_FROM_NAME,
				'value' => get_option(Settings::EMAIL_FROM_NAME),
			]
		);

		add_settings_field(
			Settings::EMAIL_FROM_ADDRESS,
			__('Afzend emailadres', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			self::SECTION_EMAIL,
			[
				'type' => 'email',
				'name' => Settings::EMAIL_FROM_ADDRESS,
				'label_for' => Settings::EMAIL_FROM_ADDRESS,
				'value' => get_option(Settings::EMAIL_FROM_ADDRESS),
			]
		);
		add_settings_field(
			Settings::REMINDER_EMAIL_BCC,
			__('Herinneringmail BCC emailadres', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			self::SECTION_EMAIL,
			[
				'type' => 'email',
				'name' => Settings::REMINDER_EMAIL_BCC,
				'label_for' => Settings::REMINDER_EMAIL_BCC,
				'value' => get_option(Settings::REMINDER_EMAIL_BCC),
			]
		);

		// Herzienings instelling
		add_settings_section(
			self::SECTION_REVIEW,
			__('Herzieningsmail', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Settings::REVIEW_TIME_PERIOD,
			__('Herzieningsperiode', 'yard-page-guard'),
			[$this, 'renderPeriodInput'],
			self::PAGE_SLUG,
			self::SECTION_REVIEW,
			[
				'label_for' => Settings::REVIEW_TIME_PERIOD,
				'period_name' => Settings::REVIEW_TIME_PERIOD,
				'period_value' => get_option(Settings::REVIEW_TIME_PERIOD),
				'unit_name' => Settings::REVIEW_TIME_UNIT,
				'unit_value' => get_option(Settings::REVIEW_TIME_UNIT),
			]
		);

		add_settings_field(
			Settings::REVIEW_EMAIL_SUBJECT,
			__('Herzieningsmail onderwerp', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			self::SECTION_REVIEW,
			[
				'type' => 'text',
				'name' => Settings::REVIEW_EMAIL_SUBJECT,
				'label_for' => Settings::REVIEW_EMAIL_SUBJECT,
				'value' => get_option(Settings::REVIEW_EMAIL_SUBJECT),
			]
		);
		add_settings_field(
			Settings::REVIEW_EMAIL_CONTENT,
			__('Herzieningsmail inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			self::SECTION_REVIEW,
			[
				'name' => Settings::REVIEW_EMAIL_CONTENT,
				'label_for' => Settings::REVIEW_EMAIL_CONTENT,
				'value' => get_option(Settings::REVIEW_EMAIL_CONTENT),
				'description' => sprintf(
					'%s<ol class="description"><li>%s</li><li>%s</li></ol>',
					__('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard'),
					__('Naam van inhoudseigenaar', 'yard-page-guard'),
					__('Lijst van items die gecontroleerd moeten worden', 'yard-page-guard'),
				),
			]
		);

		// Herinnerings instelling
		add_settings_section(
			self::SECTION_REMINDER,
			__('Herinneringsmail', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Settings::REMINDER_TIME_PERIOD,
			__('Herinneringsperiode', 'yard-page-guard'),
			[$this, 'renderPeriodInput'],
			self::PAGE_SLUG,
			'reminder_settings',
			[
				'label_for' => Settings::REMINDER_TIME_PERIOD,
				'period_name' => Settings::REMINDER_TIME_PERIOD,
				'period_value' => get_option(Settings::REMINDER_TIME_PERIOD),
				'unit_name' => Settings::REMINDER_TIME_UNIT,
				'unit_value' => get_option(Settings::REMINDER_TIME_UNIT),
			]
		);

		add_settings_field(
			Settings::REMINDER_EMAIL_SUBJECT,
			__('Herinneringsmail onderwerp', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			self::SECTION_REMINDER,
			[
				'type' => 'text',
				'name' => Settings::REMINDER_EMAIL_SUBJECT,
				'label_for' => Settings::REMINDER_EMAIL_SUBJECT,
				'value' => get_option(Settings::REMINDER_EMAIL_SUBJECT),
			]
		);
		add_settings_field(
			Settings::REMINDER_EMAIL_CONTENT,
			__('Herinneringsmail inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			self::SECTION_REMINDER,
			[
				'name' => Settings::REMINDER_EMAIL_CONTENT,
				'label_for' => Settings::REMINDER_EMAIL_CONTENT,
				'value' => get_option(Settings::REMINDER_EMAIL_CONTENT),
				'description' => sprintf(
					'%s<ol class="description"><li>%s</li><li>%s</li></ol>',
					__('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard'),
					__('Naam van inhoudseigenaar', 'yard-page-guard'),
					__('Lijst van items die gecontroleerd moeten worden', 'yard-page-guard'),
				),
			]
		);

		//Modal instellingen
		add_settings_section(
			self::SECTION_MODAL,
			__('Modal', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);
		add_settings_field(
			Settings::MODAL_FOOTER_CONTENT,
			__('Controleer venster footer inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			self::SECTION_MODAL,
			[
				'name' => Settings::MODAL_FOOTER_CONTENT,
				'label_for' => Settings::MODAL_FOOTER_CONTENT,
				'value' => get_option(Settings::MODAL_FOOTER_CONTENT),
				'description' => __('Een knop kan aangemaakt worden door een link op een nieuwe regel toe te voegen en deze dikgedrukt te maken.', 'yard-page-guard'),
			]
		);
		add_settings_section(
			self::SECTION_INTERNAL_INFORMATION,
			__('Interne informatie', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Settings::SHOW_INTERNAL_DATA_ON_REVIEW,
			__('Externe eigenaren kunnen interne data inzien', 'yard-page-guard'),
			[$this, 'renderCheckbox'],
			self::PAGE_SLUG,
			self::SECTION_INTERNAL_INFORMATION,
			[
				'type' => 'checkbox',
				'name' => Settings::SHOW_INTERNAL_DATA_ON_REVIEW,
				'label_for' => Settings::SHOW_INTERNAL_DATA_ON_REVIEW,
				'checked' => get_option(Settings::SHOW_INTERNAL_DATA_ON_REVIEW, 0) ? true : false,
			]
		);
	}

	public function renderSettingsPage(): void
	{
		?>
		<div class="wrap">
			<h1><?php echo get_admin_page_title() ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields(Settings::OPTION_GROUP); ?>
				<?php do_settings_sections(self::PAGE_SLUG); ?>
				<?php submit_button(); ?>
			</form>
		</div>
	<?php
	}

	public function renderInput(array $args): void
	{
		$args = wp_parse_args($args, [
			'type' => 'text',
			'name' => '',
			'label_for' => '',
			'value' => '',
			'required' => false,
		]);

		printf(
			'<input type="%1$s" name="%2$s" id="%3$s" value="%4$s" %5$s class="%6$s"/>',
			esc_attr($args['type']),
			esc_attr($args['name']),
			esc_attr($args['label_for']),
			esc_attr($args['value']),
			$args['required'] ? 'required' : '',
			'number' !== $args['type'] ? 'regular-text' : 'small-text',
		);
	}

	public function renderCheckbox(array $args): void
	{
		$args = wp_parse_args($args, [
			'type' => 'checkbox',
			'name' => '',
			'checked' => false,
			'label_for' => '',
		]);

		printf(
			'<input type="%1$s" id="%2$s" name="%3$s" %4$s/>',
			esc_attr($args['type']),
			esc_attr($args['label_for']),
			esc_attr($args['name']),
			checked($args['checked'], true, false)
		);
	}

	public function renderPeriodInput(array $args): void
	{
		$args = wp_parse_args($args, [
			'label_for' => '',
			'period_name' => '',
			'period_value' => '',
			'unit_name' => '',
			'unit_value' => '',
			'unit_options' => TimeUnit::options(),
		]);
		$this->renderInput([
			'type' => 'number',
			'name' => $args['period_name'],
			'label_for' => $args['label_for'],
			'value' => $args['period_value'],
			'required' => true,
		]);

		$this->renderSelect([
			'name' => $args['unit_name'],
			'value' => $args['unit_value'],
			'options' => $args['unit_options'],
			'label_for' => $args['label_for'],
		]);
	}

	public function renderSelect(array $args): void
	{
		$args = wp_parse_args($args, [
			'name' => '',
			'value' => '',
			'options' => [],
			'label_for' => '',
		]);

		printf('<select name="%1$s" id="%2$s">', esc_attr($args['name']), esc_attr($args['label_for']));
		foreach ($args['options'] as $key => $label) {
			printf(
				'<option value="%1$s" %2$s>%3$s</option>',
				esc_attr($key),
				selected($args['value'], $key, false),
				esc_html($label)
			);
		}
		echo '</select>';
	}

	public function renderEditor(array $args): void
	{
		$args = wp_parse_args($args, [
			'name' => '',
			'label_for' => '',
			'value' => '',
			'description' => '',
		]);

		wp_editor($args['value'], $args['label_for'], [
			'textarea_name' => $args['name'],
			'textarea_rows' => 6,
			'media_buttons' => false,
			'teeny' => true,
		]);

		if (! empty($args['description'])) {
			printf('<p class="description">%s</p>', wp_kses_post($args['description']));
		}
	}
}
