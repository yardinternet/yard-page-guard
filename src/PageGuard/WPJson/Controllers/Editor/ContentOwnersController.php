<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Repositories\ContentOwnerRepository;

/**
 * Returns the assignable content owners for the block editor's owner select.
 *
 * The `value` is a composite of type and id, because a select needs a single
 * scalar. It is split again before it is stored, so the post meta keeps a plain
 * integer id and a separate owner type.
 */
class ContentOwnersController
{
	private ContentOwnerRepository $repository;

	public function __construct(?ContentOwnerRepository $repository = null)
	{
		$this->repository = $repository ?? new ContentOwnerRepository();
	}

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$owners = array_map([$this, 'toResponseItem'], $this->repository->all());

		return new WP_REST_Response($owners);
	}

	/**
	 * @return array<string, mixed>
	 */
	private function toResponseItem(ContentOwner $owner): array
	{
		return [
			'value' => sprintf('%s:%d', $owner->type(), $owner->id()),
			'id' => $owner->id(),
			'type' => $owner->type(),
			'name' => $owner->name(),
			'email' => $owner->email(),
			'label' => ContentOwnerType::EXTERNAL === $owner->type()
				? sprintf(
					/* translators: %s: content owner name. */
					__('%s (extern)', 'yard-page-guard'),
					$owner->name()
				)
				: $owner->name(),
		];
	}
}
