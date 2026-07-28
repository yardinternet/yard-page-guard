<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Traits\Text;

class AdminSettingsController
{
	use Text;

	public const PAGE_SLUG = 'page-guard-settings';
	public const OPTION_GROUP = 'ypg_settings';

	public function init(): void
	{
		add_action('admin_menu', [$this, 'addSettingsPage']);
		add_action('admin_init', [$this, 'registerSettings']);
	}

	public function addSettingsPage(): void
	{
		add_options_page(
			__('Inhoudscontrole module', 'yard-page-guard'),
			__('Inhoudscontrole module', 'yard-page-guard'),
			apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
			self::PAGE_SLUG,
			[$this, 'renderSettingsPage']
		);
	}

	public function registerSettings(): void
	{
		register_setting(self::OPTION_GROUP, Options::REVIEW_TIME_PERIOD, [
			'sanitize_callback' => 'absint',
			'default' => 1,
		]);
		register_setting(self::OPTION_GROUP, Options::REVIEW_TIME_UNIT, [
			'default' => 'days',
		]);
		register_setting(self::OPTION_GROUP, Options::REMINDER_TIME_PERIOD, [
			'sanitize_callback' => 'absint',
			'default' => 1,
		]);
		register_setting(self::OPTION_GROUP, Options::REMINDER_TIME_UNIT);
		register_setting(self::OPTION_GROUP, Options::EMAIL_FROM_NAME, [
			'sanitize_callback' => 'sanitize_text_field',
			'default' => get_bloginfo('name'),
		]);
		register_setting(self::OPTION_GROUP, Options::EMAIL_FROM_ADDRESS, [
			'sanitize_callback' => 'sanitize_email',
		]);
		register_setting(self::OPTION_GROUP, Options::REMINDER_EMAIL_BCC, [
			'sanitize_callback' => 'sanitize_email',
		]);
		register_setting(self::OPTION_GROUP, Options::REVIEW_EMAIL_CONTENT);
		register_setting(self::OPTION_GROUP, Options::REMINDER_EMAIL_CONTENT);
		register_setting(self::OPTION_GROUP, Options::REVIEW_EMAIL_SUBJECT, [
			'sanitize_callback' => 'sanitize_text_field',
		]);
		register_setting(self::OPTION_GROUP, Options::REMINDER_EMAIL_SUBJECT, [
			'sanitize_callback' => 'sanitize_text_field',
		]);
		register_setting(self::OPTION_GROUP, Options::MODAL_FOOTER_CONTENT);
		register_setting(self::OPTION_GROUP, Options::SHOW_INTERNAL_DATA_ON_REVIEW, [
			'sanitize_callback' => fn ($value) => ! empty($value) ? 1 : 0,
		]);

		add_settings_section(
			'email',
			__('E-mails', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Options::EMAIL_FROM_NAME,
			__('Afzend naam', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			'email',
			[
				'type' => 'text',
				'name' => Options::EMAIL_FROM_NAME,
				'label_for' => Options::EMAIL_FROM_NAME,
				'value' => get_option(Options::EMAIL_FROM_NAME),
			]
		);

		add_settings_field(
			Options::EMAIL_FROM_ADDRESS,
			__('Afzend emailadres', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			'email',
			[
				'type' => 'email',
				'name' => Options::EMAIL_FROM_ADDRESS,
				'label_for' => Options::EMAIL_FROM_ADDRESS,
				'value' => get_option(Options::EMAIL_FROM_ADDRESS),
			]
		);
		add_settings_field(
			Options::REMINDER_EMAIL_BCC,
			__('Herinneringmail BCC emailadres', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			'email',
			[
				'type' => 'email',
				'name' => Options::REMINDER_EMAIL_BCC,
				'label_for' => Options::REMINDER_EMAIL_BCC,
				'value' => get_option(Options::REMINDER_EMAIL_BCC),
			]
		);

		// Herzienings instelling
		add_settings_section(
			'review_settings',
			__('Herzieningsmail', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Options::REVIEW_TIME_PERIOD,
			__('Herzieningsperiode', 'yard-page-guard'),
			[$this, 'renderPeriodInput'],
			self::PAGE_SLUG,
			'review_settings',
			[
				'label_for' => Options::REVIEW_TIME_PERIOD,
				'period_name' => Options::REVIEW_TIME_PERIOD,
				'period_value' => get_option(Options::REVIEW_TIME_PERIOD),
				'unit_name' => Options::REVIEW_TIME_UNIT,
				'unit_value' => get_option(Options::REVIEW_TIME_UNIT),
			]
		);

		add_settings_field(
			Options::REVIEW_EMAIL_SUBJECT,
			__('Herzieningsmail onderwerp', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			'review_settings',
			[
				'type' => 'text',
				'name' => Options::REVIEW_EMAIL_SUBJECT,
				'label_for' => Options::REVIEW_EMAIL_SUBJECT,
				'value' => get_option(Options::REVIEW_EMAIL_SUBJECT),
			]
		);
		add_settings_field(
			Options::REVIEW_EMAIL_CONTENT,
			__('Herzieningsmail inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			'review_settings',
			[
				'name' => Options::REVIEW_EMAIL_CONTENT,
				'label_for' => Options::REVIEW_EMAIL_CONTENT,
				'value' => get_option(Options::REVIEW_EMAIL_CONTENT),
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
			'reminder_settings',
			__('Herinneringsmail', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Options::REMINDER_TIME_PERIOD,
			__('Herinneringsperiode', 'yard-page-guard'),
			[$this, 'renderPeriodInput'],
			self::PAGE_SLUG,
			'reminder_settings',
			[
				'label_for' => Options::REMINDER_TIME_PERIOD,
				'period_name' => Options::REMINDER_TIME_PERIOD,
				'period_value' => get_option(Options::REMINDER_TIME_PERIOD),
				'unit_name' => Options::REMINDER_TIME_UNIT,
				'unit_value' => get_option(Options::REMINDER_TIME_UNIT),
			]
		);

		add_settings_field(
			Options::REMINDER_EMAIL_SUBJECT,
			__('Herinneringsmail onderwerp', 'yard-page-guard'),
			[$this, 'renderInput'],
			self::PAGE_SLUG,
			'reminder_settings',
			[
				'type' => 'text',
				'name' => Options::REMINDER_EMAIL_SUBJECT,
				'label_for' => Options::REMINDER_EMAIL_SUBJECT,
				'value' => get_option(Options::REMINDER_EMAIL_SUBJECT),
			]
		);
		add_settings_field(
			Options::REMINDER_EMAIL_CONTENT,
			__('Herinneringsmail inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			'reminder_settings',
			[
				'name' => Options::REMINDER_EMAIL_CONTENT,
				'label_for' => Options::REMINDER_EMAIL_CONTENT,
				'value' => get_option(Options::REMINDER_EMAIL_CONTENT),
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
			'modal',
			__('Modal', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);
		add_settings_field(
			Options::MODAL_FOOTER_CONTENT,
			__('Controleer venster footer inhoud', 'yard-page-guard'),
			[$this, 'renderEditor'],
			self::PAGE_SLUG,
			'modal',
			[
				'name' => Options::MODAL_FOOTER_CONTENT,
				'label_for' => Options::MODAL_FOOTER_CONTENT,
				'value' => get_option(Options::MODAL_FOOTER_CONTENT),
				'description' => __('Een knop kan aangemaakt worden door een link op een nieuwe regel toe te voegen en deze dikgedrukt te maken.', 'yard-page-guard'),
			]
		);
		add_settings_section(
			'internal_information',
			__('Interne informatie', 'yard-page-guard'),
			'',
			self::PAGE_SLUG,
		);

		add_settings_field(
			Options::SHOW_INTERNAL_DATA_ON_REVIEW,
			__('Externe eigenaren kunnen interne data inzien', 'yard-page-guard'),
			[$this, 'renderCheckbox'],
			self::PAGE_SLUG,
			'internal_information',
			[
				'type' => 'checkbox',
				'name' => Options::SHOW_INTERNAL_DATA_ON_REVIEW,
				'label_for' => Options::SHOW_INTERNAL_DATA_ON_REVIEW,
				'checked' => get_option(Options::SHOW_INTERNAL_DATA_ON_REVIEW, 0) ? true : false,
			]
		);

		add_filter('option_page_capability_ypg_settings', fn () => apply_filters('yard::page-guard/capability/admin', 'edit_pages'));
	}
	public function renderSettingsPage(): void
	{
		?>
		<div class="wrap">
			<h1><?php echo get_admin_page_title() ?></h1>
			<form method="post" action="options.php">
				<?php
						settings_fields(self::OPTION_GROUP);
		do_settings_sections(self::PAGE_SLUG);
		submit_button();
		?>
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

		$type = $args['type'] ?? 'text';
		$name = $args['name'] ?? '';
		$value = $args['value'] ?? '';
		printf(
			'<input type="%1$s" name="%2$s" id="%3$s" value="%4$s" %5$s/>',
			esc_attr($type),
			esc_attr($name),
			esc_attr($args['label_for']),
			esc_attr($value),
			$args['required'] ? 'required' : ''
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
			'unit_options' => $this->getUnitOptions(),
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
