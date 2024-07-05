<?php

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Foundation\ServiceProvider;

class MetaboxServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		$metabox = new Metabox;
		add_action('add_meta_boxes', [$metabox, 'addMetaboxes'], 999, 0);
		add_action('save_post', [$metabox, 'saveMetaboxValues'], 999, 1);
	}
}
