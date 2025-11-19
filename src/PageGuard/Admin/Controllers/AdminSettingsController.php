<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

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
			'manage_options',
			'page-guard-settings',
			[$this, 'renderSettingsPage']
		);
	}

	public function registerSettings(): void
	{
		register_setting('ypg_settings', 'ypg_review_time_period');
		register_setting('ypg_settings', 'ypg_review_time_unit');
		register_setting('ypg_settings', 'ypg_reminder_time_period');
		register_setting('ypg_settings', 'ypg_reminder_time_unit');
		register_setting('ypg_settings', 'ypg_email_from_name');
		register_setting('ypg_settings', 'ypg_email_from_address');
		register_setting('ypg_settings', 'ypg_reminder_email_bcc');
		register_setting('ypg_settings', 'ypg_review_email_content');
		register_setting('ypg_settings', 'ypg_reminder_email_content');
	}

	public function renderSettingsPage(): void
	{
		require_once __DIR__ . '/../Views/AdminSettingsPage.php';
	}
}
