<?php

namespace Yard\PageGuard\Traits;

trait Token
{
    public static function generateReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate): string
    {
        if (! defined('AUTH_SALT') || '' === $contentOwnerEmail || '' === $reviewDate) {
            throw new \RuntimeException('Missing review token parameter');
        }

        $data = strtolower(trim("$postId|$contentOwnerEmail|$reviewDate"));
        $rawHash = hash_hmac('sha256', $data, AUTH_SALT, true);

        return rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '='); // URL safe
    }

    public static function verifyReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate, string $tokenToCheck): bool
    {
        $expectedToken = self::generateReviewToken($postId, $contentOwnerEmail, $reviewDate);

        return hash_equals($expectedToken, $tokenToCheck);
    }
}
