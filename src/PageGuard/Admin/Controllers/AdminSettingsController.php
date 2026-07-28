<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Traits\Text;

class AdminSettingsController
{
	use Text;

	public function init(): void
	{
		add_action('admin_menu', [$this, 'addSettingsPage']);
		add_action('admin_init', [$this, 'registerSettings']);
	}

	public function addSettingsPage(): void
	{
		add_options_page(
			__('Houdbaarheidsmodule Instellingen', 'yard-page-guard'),
			__('Houdbaarheidsmodule', 'yard-page-guard'),
			apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
			'page-guard-settings',
			[$this, 'renderSettingsPage']
		);
	}

	public function registerSettings(): void
	{
		register_setting('ypg_settings', Options::REVIEW_TIME_PERIOD, [
			'sanitize_callback' => 'absint',
		]);
		register_setting('ypg_settings', Options::REVIEW_TIME_UNIT);
		register_setting('ypg_settings', Options::REMINDER_TIME_PERIOD, [
			'sanitize_callback' => 'absint',
		]);
		register_setting('ypg_settings', Options::REMINDER_TIME_UNIT);
		register_setting('ypg_settings', Options::EMAIL_FROM_NAME, [
			'sanitize_callback' => 'sanitize_text_field',
		]);
		register_setting('ypg_settings', Options::EMAIL_FROM_ADDRESS, [
			'sanitize_callback' => 'sanitize_email',
		]);
		register_setting('ypg_settings', Options::REMINDER_EMAIL_BCC, [
			'sanitize_callback' => 'sanitize_email',
		]);
		register_setting('ypg_settings', Options::REVIEW_EMAIL_CONTENT);
		register_setting('ypg_settings', Options::REMINDER_EMAIL_CONTENT);
		register_setting('ypg_settings', Options::REVIEW_EMAIL_SUBJECT, [
			'sanitize_callback' => 'sanitize_text_field',
		]);
		register_setting('ypg_settings', Options::REMINDER_EMAIL_SUBJECT, [
			'sanitize_callback' => 'sanitize_text_field',
		]);
		register_setting('ypg_settings', Options::MODAL_FOOTER_CONTENT);
		register_setting('ypg_settings', Options::SHOW_INTERNAL_DATA_ON_REVIEW, [
			'sanitize_callback' => fn ($value) => ! empty($value) ? 1 : 0,
		]);

		add_filter('option_page_capability_ypg_settings', fn () => apply_filters('yard::page-guard/capability/admin', 'edit_pages'));
	}

	public function renderSettingsPage(): void
	{
		require_once __DIR__ . '/../Views/AdminSettingsPage.php';
	}
}
