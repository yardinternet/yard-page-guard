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

		/** Providers specific to the admin */
		'admin' => [
			Yard\PageGuard\Admin\AdminServiceProvider::class,
			Yard\PageGuard\Metabox\MetaboxServiceProvider::class,
		],
	],
];
