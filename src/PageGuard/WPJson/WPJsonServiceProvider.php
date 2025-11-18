<?php

namespace Yard\PageGuard\WPJson;

use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\WPJson\Controllers\ModalInfoController;
use Yard\PageGuard\WPJson\Controllers\VerifyPostController;

class WPJsonServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        add_action('rest_api_init', function () {
            $verifyPostController = new VerifyPostController();
            $modalInfoController = new ModalInfoController();

            register_rest_route('yard-page-guard/v1', '/verify-post', [
                'methods' => 'POST',
                'callback' => [$verifyPostController, 'handleRequest'],
                'args' => VerifyPostController::getEndpointArgs(),
                'permission_callback' => '__return_true',
            ]);

            register_rest_route('yard-page-guard/v1', '/modal-info', [
                'methods' => 'POST',
                'callback' => [$modalInfoController, 'handleRequest'],
                'args' => ModalInfoController::getEndpointArgs(),
                'permission_callback' => fn () => '__return_true',
            ]);
        });
    }
}
