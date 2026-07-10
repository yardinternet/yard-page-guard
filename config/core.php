<?php

declare(strict_types=1);

return [
	/**
	 * Service Providers.
	 */
	'providers' => [
		Yard\PageGuard\WPCron\WPCronServiceProvider::class,
		Yard\PageGuard\WPJson\WPJsonServiceProvider::class,
		Yard\PageGuard\Frontend\FrontendServiceProvider::class,
		Yard\PageGuard\Taxonomy\TaxonomyServiceProvider::class,
		Yard\PageGuard\EmailLog\EmailLogServiceProvider::class,
		Yard\PageGuard\CronLog\CronLogServiceProvider::class,
		Yard\PageGuard\ContentOwner\OwnerSyncServiceProvider::class,

		/** Providers specific to the admin */
		'admin' => [
			Yard\PageGuard\Admin\AdminServiceProvider::class,
			Yard\PageGuard\Metabox\MetaboxServiceProvider::class,
		],
	],
];
