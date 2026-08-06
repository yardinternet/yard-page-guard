<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Traits\ContentOwners;

/**
 * Returns the assignable content owners for the block editor's owner select.
 *
 * The `value` is a composite of type and id, because a select needs a single
 * scalar. It is split again before it is stored, so the post meta keeps a plain
 * integer id and a separate owner type.
 */
class ContentOwnersController
{
	use ContentOwners;

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$owners = array_map(
			fn (ContentOwner $owner): array => ['value' => sprintf('%s:%d', $owner->type(), $owner->id()), 'label' => $owner->displayName()],
			$this->getContentOwners()
		);

		return new WP_REST_Response($owners);
	}
}
