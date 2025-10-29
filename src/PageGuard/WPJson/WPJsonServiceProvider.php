<?php

namespace Yard\PageGuard\WPJson;

use Yard\PageGuard\Foundation\ServiceProvider;

class WPJsonServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        add_action('rest_api_init', function () {
            register_rest_route('yard-page-guard/v1', '/verify-post', [
                'methods' => 'POST',
                'callback' => [Controllers\VerifyPostController::class, 'handleRequest'],
                'args' => Controllers\VerifyPostController::getEndpointArgs(),
                'permission_callback' => '__return_true',
            ]);
        });
    }
}
