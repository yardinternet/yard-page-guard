<?php

namespace Yard\PageGuard\WPJson\Controllers;

use WP_Error;
use WP_REST_Request;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;

class VerifyPostController
{
    use Date;
    use Text;

    public function handleRequest(WP_REST_Request $request): void
    {
        $postId = (int) $request->get_param('post_id');
        $currentReviewDate = get_post_meta($postId, 'ypg_review_date', true);
        $currentReminderDate = get_post_meta($postId, 'ypg_reminder_date', true);

        $newReviewDate = $this->computeDateMeta(
            'ypg_review_date',
            $currentReviewDate,
            true,
            false,
            'ypg_review_time_period',
            'ypg_review_time_unit',
        );
        
        $newReminderDate = $this->computeDateMeta(
            'ypg_reminder_date',
            $currentReminderDate,
            true,
            false,
            'ypg_reminder_time_period',
            'ypg_reminder_time_unit',
            $newReviewDate
        );

        if (strtotime($newReminderDate) <= strtotime($newReviewDate)) {
            $newReminderDate = $this->setReminderAfterReview($newReviewDate);
        }

        $updatedReviewDate = update_post_meta($postId, 'ypg_review_date', $newReviewDate);
        $updatedReminderDate = update_post_meta($postId, 'ypg_reminder_date', $newReminderDate);
        $updatedVerifiedStatus = update_post_meta($postId, 'ypg_is_verified', true);

        header('Content-Type: text/html; charset=utf-8');

        if ($updatedReviewDate && $updatedReminderDate && $updatedVerifiedStatus) {
            http_response_code(200);
            echo self::getSuccessResponse();
            exit();
        }
        
        error_log("[yard-page-guard] Failed to process review for post ID: $postId");
        http_response_code(500);
        header('Content-Type: text/html; charset=utf-8');
        echo self::getErrorResponse();
        exit();
    }

    public static function verifyReviewPermission(int $postId, string $contentOwnerEmail, string $reviewDate, string $tokenToCheck): bool
    {
        if (! defined('AUTH_SALT')) {
            return false;
        }

        $rawExpectedToken = hash_hmac('sha256', strtolower(trim("$postId|$contentOwnerEmail|$reviewDate")), AUTH_SALT, true);
        $expectedToken = $expectedToken = rtrim(strtr(base64_encode($rawExpectedToken), '+/', '-_'), '=');

        return hash_equals($expectedToken, $tokenToCheck);
    }

    public static function getEndpointArgs(): array
    {
        return [
            'post_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function (int $postId) {
                    if (get_post($postId) === null) {
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
                'validate_callback' => function (string $reviewToken, WP_REST_Request $request) {
                    $postId = (int) $request->get_param('post_id');
                    $contentOwnerEmail = get_post_meta($postId, 'ypg_post_content_owner_email', true) ?? '';
                    $reviewDate = get_post_meta($postId, 'ypg_review_date', true) ?? '';

                    if ('' === $contentOwnerEmail || '' === $reviewDate) {
                        return false;
                    }

                    return self::verifyReviewPermission($postId, $contentOwnerEmail, $reviewDate, $reviewToken);
                },
            ],
        ];
    }

    public static function getSuccessResponse(): string
    {
        $message = __('De pagina is succesvol gecontroleerd!', 'yard-page-guard');

        $html = <<<HTML
            <div class="alert alert-success">
                <p>$message</p>
            </div>
        HTML;
        
        return self::minifyHtml($html);
    }

    public static function getErrorResponse(): string
    {
        $message = __('Er is iets fout gegaan tijdens de controle.', 'yard-page-guard');
        
        $html = <<<HTML
            <div class="alert alert-error">
                <p>$message</p>
            </div>
        HTML;
        
        return self::minifyHtml($html);
    }
}
