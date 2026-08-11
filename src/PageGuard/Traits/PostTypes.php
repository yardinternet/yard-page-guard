<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait PostTypes
{
	/**
	 * @return array<string>
	 */
	public function getPostTypes(): array
	{
		return apply_filters('yard::page-guard/post-types-to-use', ['page']);
	}
}
