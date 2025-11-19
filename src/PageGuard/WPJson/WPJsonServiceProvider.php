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
                'permission_callback' => '__return_true',
            ]);

            // Allow all origins and HTMX headers
            add_filter('rest_pre_serve_request', function (bool $served) {
                if (strpos($_SERVER['REQUEST_URI'], '/wp-json/yard-page-guard') !== false) {
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, HX-Current-URL, HX-Request');
                }

                return $served;
            });
        });
    }
}
