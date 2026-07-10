<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Foundation\ServiceProvider;

class MetaboxServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		$access = new MetaboxAccess();
		$renderer = new MetaboxRenderer($access);
		$saver = new MetaboxSaver($access);
		$internalDataSync = new InternalDataSync($access);

		add_action('add_meta_boxes', [$renderer, 'addMetaboxes'], 999, 0);
		add_action('save_post', [$saver, 'saveMetaValues'], 999, 1);
		add_action('save_post', [$internalDataSync, 'handleInternalData'], 999, 1);

		(new InternalDataSyncMigration())->register();
	}
}
