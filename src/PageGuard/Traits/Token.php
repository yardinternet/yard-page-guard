<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Models\ReviewItem;

trait Token
{
	public function generateToken(ReviewItem $item, string $originSite): string
	{
		$data = [
			$item->ID(),
			$item->contentOwner()->combinedId(),
			$item->reviewDate()->format('Y-m-d'),
			$originSite,
		];

		return wp_hash(implode('|', $data), 'auth', 'sha256');
	}

	public function verifyToken(ReviewItem $item, string $originSite, string $tokenToCheck): bool
	{
		$expectedToken = $this->generateToken($item, $originSite);

		return hash_equals($expectedToken, $tokenToCheck);
	}
}
