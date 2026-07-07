<?php

declare(strict_types=1);

use Yard\PageGuard\Foundation\AdminCapability;

/**
 * Grant the plugin's admin capability to the configured roles.
 */
if (! function_exists('ypg_activate')) {
	function ypg_activate(): void
	{
		AdminCapability::addToRoles();
	}
}
