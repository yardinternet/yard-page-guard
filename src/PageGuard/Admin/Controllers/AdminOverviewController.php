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
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;

class AdminOverviewController
{
	use Text;
	use Date;

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
			__('Houdbaarheids Overzicht', 'yard-page-guard'),
			__('Houdbaarheids Overzicht', 'yard-page-guard'),
			apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
			'ypg-overview',
			[$this, 'renderOverviewPage'],
			'dashicons-visibility',
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
			apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
			'edit-tags.php?taxonomy=ypg_external_content_owner',
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

	public function redirectToExternalContentOwners(): void
	{
		wp_safe_redirect(admin_url('edit-tags.php?taxonomy=ypg_external_content_owner'));
		exit();
	}
}
