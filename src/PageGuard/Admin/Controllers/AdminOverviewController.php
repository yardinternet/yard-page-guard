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
			AdminCapability::NAME,
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
			AdminCapability::NAME,
			'edit-tags.php?taxonomy=ypg_external_content_owner',
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
