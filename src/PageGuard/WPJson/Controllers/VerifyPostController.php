<?php

namespace Yard\PageGuard\WPJson\Controllers;

use WP_Error;
use WP_REST_Request;

class VerifyPostController
{
    public function handleRequest(WP_REST_Request $request): void
    {
        $postId = $request->get_param('post_id');
    }

    public function getEndpointArgs(): array
    {
        return [
            'post_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function (int $value) {
                    if (get_post($value) === null) {
                        return new WP_Error(
                            'invalid_post_id',
                            __('Ongeldige post ID', 'yard-page-guard')
                        );
                    }

                    return true;
                },
            ],
            'ypg_review_token' => [
                'required' => true,
                'type' => 'string',
                'validate_callback' => function (string $value, WP_REST_Request $request) {
                    error_log('Post ID: ' . $request->get_param('post_id'));

                    return true;
                },
            ],
        ];
    }
}
