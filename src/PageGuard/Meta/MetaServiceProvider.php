<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use Yard\PageGuard\Foundation\ServiceProvider;

class MetaServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		$meta = new Meta();
		add_action('init', [$meta, 'registerMeta']);
		add_action('rest_api_init', [$meta, 'registerMeta']);
	}
}
