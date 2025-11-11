<?php

namespace Yard\PageGuard\Admin\Controllers;

use Yard\PageGuard\Admin\Services\AdminOverviewService;
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
        add_action('admin_post_ypg_bulk_update', [$this->service, 'handleBulkEdit']);
    }

    public function addOverviewPage(): void
    {
        add_menu_page(
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            'manage_options',
            'ypg-overview',
            [$this, 'renderOverviewPage'],
            'dashicons-visibility',
            20
        );
    }

    public function renderOverviewPage(): void
    {
        require_once __DIR__ . '/../Views/AdminOverviewPage.php';
    }
}
