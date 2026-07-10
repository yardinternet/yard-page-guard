<?php

declare(strict_types=1);
/**
 * Plugin Name:     Yard | Page Guard
 * Description:     Wijs inhoudseigenaren toe aan pagina's, zodat zij deze als 'gecontroleerd' kunnen markeren en automatische herinneringsmails ontvangen op basis van zelf ingestelde datums en intervallen.
 * Author:          Yard | Digital Agency
 * Author URI:      http://www.yard.nl
 * Version:         2.3.0
 *
 * @package         Yard_Page_Guard
 */

/**
 * If this file is called directly, abort.
 */
if (! defined('ABSPATH')) {
	exit;
}

/**
 * Require autoloader.
 */
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
	require __DIR__ . '/vendor/autoload.php';
} else {
	// Manual loaded file: the autoloader.
	require_once __DIR__ . '/autoloader.php';
	$autoloader = new Yard\PageGuard\Autoloader();
}

define('YPG_VERSION', '2.3.0');
define('YPG_PLUGIN_NAME', basename(__DIR__));

/**
 * Begin execution of the plugin
 *
 * This hook is called once any activated plugins have been loaded. Is generally used for immediate filter setup, or
 * plugin overrides. The plugins_loaded action hook fires early, and precedes the setup_theme, after_setup_theme, init
 * and wp_loaded action hooks.
 */
add_action('plugins_loaded', function () {
	add_action('after_setup_theme', function () {
		(new Yard\PageGuard\Foundation\Plugin(__DIR__))->boot();
	});
});

include_once plugin_dir_path(__FILE__) . 'activate.php';
register_activation_hook(__FILE__, 'ypg_activate');

include_once plugin_dir_path(__FILE__) . 'deactivate.php';
register_deactivation_hook(__FILE__, 'ypg_deactivate');
