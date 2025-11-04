<?php

namespace Yard\PageGuard\WPJson;

use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\WPJson\Controllers\VerifyPostController;

class WPJsonServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        add_action('rest_api_init', function () {
            $verifyPostController = new VerifyPostController();

            register_rest_route('yard-page-guard/v1', '/verify-post', [
                'methods' => 'POST',
                'callback' => [$verifyPostController, 'handleRequest'],
                'args' => $verifyPostController->getEndpointArgs(),
                'permission_callback' => '__return_true',
            ]);
        });
    }
}
