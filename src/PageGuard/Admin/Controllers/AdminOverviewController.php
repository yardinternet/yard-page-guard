<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

/**
 * Exit when accessed directly.
 */
if (! defined('ABSPATH')) {
	exit;
}

use Yard\PageGuard\Admin\ListTables\PageGuardListTable;
use Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy;
use Yard\PageGuard\Traits\AdminPermissions;

class AdminOverviewController
{
	use AdminPermissions;

	public function init(): void
	{
		add_action('admin_menu', [$this, 'addOverviewPage']);
		add_action('admin_menu', [$this, 'addOverviewSubPage']);
		add_filter('set_screen_option_toplevel_page_ypg_overview_per_page', [$this, 'setScreenOptionPerPage'], 10, 3);
	}

	public function setScreenOptionPerPage($screenOption, string $option, $value)
	{
		return (int) $value;
	}

	public function addOverviewPage(): void
	{
		$adminScreen = add_menu_page(
			__('Inhoudscontrole', 'yard-page-guard'),
			__('Inhoudscontrole', 'yard-page-guard'),
			$this->adminCapability(),
			'ypg-overview',
			[$this, 'renderOverviewPage'],
			'dashicons-shield',
			20
		);

		add_action("load-{$adminScreen}", [$this, 'addScreenOptionPerPage']);
	}

	public function addScreenOptionPerPage(): void
	{
		add_screen_option('per_page');
	}

	public function addOverviewSubPage(): void
	{
		add_submenu_page(
			'ypg-overview',
			__('Externe inhoudseigenaren', 'yard-page-guard'),
			__('Externe inhoudseigenaren', 'yard-page-guard'),
			$this->adminCapability(),
			'edit-tags.php?taxonomy=' . ExternalOwnerTaxonomy::TAXONOMY,
		);
	}

	public function renderOverviewPage(): void
	{
		$listTable = new PageGuardListTable([]);
		$listTable->process_bulk_action();
		$listTable->prepare_items(); //
		settings_errors();
		?>
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php echo esc_html(get_admin_page_title()); ?></h1>
			<hr class="wp-header-end">
			<?php $listTable->views();?>
			<form id="yard-page-guard-table-form" method="post">
				<?php $listTable->display();?>
			</form>
		</div>
		<?php
	}
}
