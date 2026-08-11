<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Models\ContentOwner;

trait ContentOwners
{
	/** @return ContentOwner[] */
	protected function getContentOwners(): array
	{
		$wpUsers = get_users([
			'capability' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
		]);

		$externalUsers = get_terms([
			'taxonomy' => 'ypg_external_content_owner',
			'hide_empty' => false,
		]);

		$contentOwners = [
			...array_map(fn (\WP_User $user) => ContentOwner::fromUser($user), $wpUsers),
			...array_map(fn (\WP_Term $term) => ContentOwner::fromTerm($term), $externalUsers),
		];

		return $contentOwners;
	}

	protected function getContentOwnerOptions(): array
	{
		$contentOwnerOptions[''] = __('Geen inhoudseigenaar', 'yard-page-guard');
		foreach ($this->getContentOwners() as $contentOwner) {
			$contentOwnerOptions[sprintf('%s:%s', $contentOwner->type(), $contentOwner->id())] = $contentOwner->displayName();
		}

		return $contentOwnerOptions;
	}
}
