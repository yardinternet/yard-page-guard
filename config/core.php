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
	/**
	 * Dependencies upon which the plugin relies.
	 *
	 * Required: type, label
	 * Optional: message
	 *
	 * Type: plugin
	 * - Required: file
	 * - Optional: version
	 *
	 * Type: class
	 * - Required: name
	 */
	'dependencies' => [],
];
