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

        $frontendScript = basename(glob($this->plugin->resourcePath('frontend.*.js'))[0]);
        $frontendStyle = basename(glob($this->plugin->resourcePath('frontend.*.css'))[0]);

        wp_enqueue_style(
            'ypg-frontend-styles',
            $this->plugin->resourceUrl($frontendStyle),
            [],
            null,
        );

        wp_enqueue_style(
            'ypg-frontend-fonts',
            'https://use.typekit.net/ozu4txi.css',
            [],
            null
        );

        wp_enqueue_script(
            'ypg-frontend-scripts',
            $this->plugin->resourceUrl($frontendScript),
            [],
            null,
        );
    }
}
