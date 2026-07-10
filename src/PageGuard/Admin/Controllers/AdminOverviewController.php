<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

/**
 * Exit when accessed directly.
 */
if (! defined('ABSPATH')) {
	exit;
}

use Yard\PageGuard\Admin\Services\AdminOverviewService;
use Yard\PageGuard\CronLog\CronLog;
use Yard\PageGuard\EmailLog\EmailLog;
use Yard\PageGuard\Foundation\AdminCapability;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;

class AdminOverviewController
{
	use Text;
	use Date;

	private AdminOverviewService $service;

	public function __construct()
	{
		$this->service = new AdminOverviewService();
	}

	public function init(): void
	{
		add_action('admin_menu', [$this, 'addOverviewPage']);
		add_action('admin_menu', [$this, 'addOverviewSubPage']);
		add_action('admin_post_ypg_bulk_update', [$this->service, 'handleBulkEdit']);
	}

	public function addOverviewPage(): void
	{
		add_menu_page(
			__('Houdbaarheids Overzicht', 'yard-page-guard'),
			__('Houdbaarheids Overzicht', 'yard-page-guard'),
			AdminCapability::name(),
			'ypg-overview',
			[$this, 'renderOverviewPage'],
			'dashicons-visibility',
			20
		);
	}

	public function addOverviewSubPage(): void
	{
		add_submenu_page(
			'ypg-overview',
			__('Externe inhoudseigenaren', 'yard-page-guard'),
			__('Externe inhoudseigenaren', 'yard-page-guard'),
			AdminCapability::name(),
			'edit-tags.php?taxonomy=ypg_external_content_owner',
		);

		add_submenu_page(
			'ypg-overview',
			__('Email log', 'yard-page-guard'),
			__('Email log', 'yard-page-guard'),
			AdminCapability::name(),
			'edit.php?post_type=' . EmailLog::POST_TYPE,
		);

		add_submenu_page(
			'ypg-overview',
			__('Controle log', 'yard-page-guard'),
			__('Controle log', 'yard-page-guard'),
			AdminCapability::name(),
			'edit.php?post_type=' . CronLog::POST_TYPE,
		);

		add_submenu_page(
			'ypg-overview',
			__('Instellingen', 'yard-page-guard'),
			__('Instellingen', 'yard-page-guard'),
			AdminCapability::name(),
			'options-general.php?page=page-guard-settings',
		);
	}

	public function renderOverviewPage(): void
	{
		require_once __DIR__ . '/../Views/AdminOverviewPage.php';
	}

	public function redirectToExternalContentOwners(): void
	{
		wp_safe_redirect(admin_url('edit-tags.php?taxonomy=ypg_external_content_owner'));
		exit();
	}
}
