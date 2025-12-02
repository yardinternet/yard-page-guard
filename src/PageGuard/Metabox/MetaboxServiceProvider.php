<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Foundation\ServiceProvider;

class MetaboxServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		$metabox = new Metabox;
		add_action('add_meta_boxes', [$metabox, 'addMetaboxes'], 999, 0);
		add_action('save_post', [$metabox, 'saveMetaValues'], 999, 1);
		add_action('save_post', [$metabox, 'handleInternalData'], 999, 1);
	}
}
