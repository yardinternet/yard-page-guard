<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait Token
{
	public static function generateReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate): string
	{
		if ('' === $contentOwnerEmail || '' === $reviewDate) {
			throw new \RuntimeException('Missing review token parameter');
		}

		$data = strtolower(trim("$postId|$contentOwnerEmail|$reviewDate"));
		$rawHash = hash_hmac('sha256', $data, 'YPG_AUTH_SALT', true); # TODO: In case this goes open source, turn into env variable synced across sites, when fusion pdc setup.

		return rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '='); // URL safe
	}

	public static function verifyReviewToken(int $postId, string $contentOwnerEmail, string $reviewDate, string $tokenToCheck): bool
	{
		$expectedToken = self::generateReviewToken($postId, $contentOwnerEmail, $reviewDate);

		return hash_equals($expectedToken, $tokenToCheck);
	}
}
