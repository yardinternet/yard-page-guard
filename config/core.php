<?php

declare(strict_types=1);

return [

	/**
	 * Service Providers.
	 */
	'providers' => [
		// Yard\BrokenLinkSafetyGuard\RestAPI\RestAPIServiceProvider::class,

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
