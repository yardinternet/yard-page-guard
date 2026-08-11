<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait PostStatusses
{
	protected function postStatussesToUse(): array
	{
		return apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']);
	}
}
