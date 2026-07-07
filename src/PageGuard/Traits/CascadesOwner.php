<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use WP_Query;
use Yard\PageGuard\Enums\ContentOwnerType;

/**
 * Propagates a content owner's details to the denormalised
 * `ypg_post_content_owner_*` meta stored on every post they own.
 *
 * Owner name/email/phone are copied onto each post when the owner is assigned,
 * so cron notifications and the overview don't have to resolve the owner every
 * time. That copy goes stale when the source record is edited — an external
 * owner term or a WordPress user — so both sides reconcile it through here.
 */
trait CascadesOwner
{
	/**
	 * Write the given owner fields onto every post owned by ($ownerId, $type).
	 *
	 * Matching on both id and type avoids collisions between a WP user ID and a
	 * taxonomy term ID that happen to share a number.
	 *
	 * @param array<string,string> $fields Owner meta to update, keyed by the
	 *                                      suffix after `ypg_post_content_owner_`
	 *                                      (e.g. `email`, `name`, `phone_number`).
	 *
	 * @return int Number of posts updated.
	 */
	private function cascadeOwnerToPosts(int $ownerId, string $type, array $fields): int
	{
		if (0 >= $ownerId || null === ContentOwnerType::tryFrom($type) || [] === $fields) {
			return 0;
		}

		$query = new WP_Query([
			'post_type' => apply_filters('yard::page-guard/post-types-to-use', ['page']),
			'posts_per_page' => -1,
			'post_status' => 'any',
			'fields' => 'ids',
			'no_found_rows' => true,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
			'meta_query' => [
				'relation' => 'AND',
				[
					'key' => 'ypg_post_content_owner_id',
					'value' => $ownerId,
					'compare' => '=',
				],
				[
					'key' => 'ypg_post_content_owner_type',
					'value' => $type,
					'compare' => '=',
				],
			],
		]);

		foreach ($query->posts as $postId) {
			foreach ($fields as $suffix => $value) {
				update_post_meta((int) $postId, 'ypg_post_content_owner_' . $suffix, $value);
			}
		}

		return count($query->posts);
	}
}
