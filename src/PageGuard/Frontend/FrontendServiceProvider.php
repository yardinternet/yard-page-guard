<?php

namespace Yard\PageGuard\Frontend;

use Yard\PageGuard\Foundation\ServiceProvider;

class FrontendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $reviewModal = new ReviewModal;
        add_action('wp_footer', [$reviewModal, 'render']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
    }

    public function enqueueFrontendAssets(): void
    {
        if (! isset($_GET['ypg_review_token'])) {
            return;
        }

        $path = $this->plugin->resourcePath('frontend.asset.php');
        $scriptAsset = file_exists($path) ? require $path : ['dependencies' => [], 'version' => round(microtime(true))];

        wp_enqueue_style(
            'ypg-frontend-styles',
            $this->plugin->resourceUrl('style-frontend.css'),
            [],
            $scriptAsset['version']
        );

        wp_enqueue_script(
            'ypg-frontend-scripts',
            $this->plugin->resourceUrl('frontend.js'),
            [],
            $scriptAsset['version']
        );
    }
}
