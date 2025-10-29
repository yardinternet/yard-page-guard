<?php

declare(strict_types=1);

return [
    /**
     * Service Providers.
     */
    'providers' => [
        Yard\PageGuard\WPCron\WPCronServiceProvider::class,
		Yard\PageGuard\Frontend\FrontendServiceProvider::class,

        /** Providers specific to the admin */
        'admin' => [
            Yard\PageGuard\Admin\AdminServiceProvider::class,
            Yard\PageGuard\Metabox\MetaboxServiceProvider::class,
            Yard\PageGuard\Taxonomy\TaxonomyServiceProvider::class,
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
