<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

/**
 * Capability checks shared by the block editor REST endpoints.
 */
trait AdminPermissions
{
	use PostTypes;
	protected function adminCapability(): string
	{
		return (string) apply_filters('yard::page-guard/capability/admin', 'edit_pages');
	}
}
