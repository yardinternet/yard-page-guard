<?php

namespace Yard\PageGuard\WPJson\Controllers;

use DateTime;
use WP_Error;
use WP_REST_Request;

class VerifyPostController
{
    public function handleRequest(WP_REST_Request $request): void
    {
        // TODO
    }

    public static function getEndpointArgs(): array
    {
        return [
            'post_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function ($value) {
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
            ],
            'ypg_review_period_type' => [
                'required' => true,
                'type' => 'string',
                'enum' => ['auto', 'manual'],
            ],
            'ypg_reminder_period_type' => [
                'required' => true,
                'type' => 'string',
                'enum' => ['auto', 'manual'],
            ],
            'ypg_review_date' => [
                'required' => false,
                'type' => 'string',
                'validate_callback' => function (mixed $value, WP_REST_Request $request, string $key) {
                    if ($request->get_param('ypg_review_period_type') === 'manual' && empty($value)) {
                        return new WP_Error(
                            'missing_review_date',
                            __('Controle datum is verplicht bij een specifieke datum', 'yard-page-guard')
                        );
                    }

                    
                    return $this->validateDateFormat($value);
                },
            ],
            'ypg_reminder_date' => [
                'required' => false,
                'type' => 'string',
                'validate_callback' => function (mixed $value, WP_REST_Request $request, string $key) {
                    if ($request->get_param('ypg_reminder_period_type') === 'manual' && empty($value)) {
                        return new WP_Error(
                            'missing_reminder_date',
                            __('Herinnerings datum is verplicht bij een specifieke datum', 'yard-page-guard')
                        );
                    }

                    return $this->validateDateFormat($value);
                },
            ],
        ];
    }

    private function validateDateFormat(string $dateString, string $format = 'd-m-Y')
    {
        $date = DateTime::createFromFormat($format, $dateString);
        $errors = DateTime::getLastErrors();

        if (! $date || 0 < $errors['warning_count'] || 0 < $errors['error_count']) {
            return new WP_Error(
                'invalid_date_format',
                sprintf(__('Foutief datum formaat, verwacht: %s', 'yard-page-guard'), $format)
            );
        }

        return true;
    }
}
