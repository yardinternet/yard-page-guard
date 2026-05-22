<?php

declare(strict_types=1);

/**
 * Load dependencies with Composer autoloader.
 */
require __DIR__ . '/../vendor/autoload.php';

define('WP_PLUGIN_DIR', __DIR__);
define('WP_DEBUG', false);

/**
 * Bootstrap WordPress Mock.
 */
\WP_Mock::setUsePatchwork(true);
\WP_Mock::bootstrap();

$GLOBALS['yard-page-guard'] = [
	'active_plugins' => ['yard-page-guard/yard-page-guard.php'],
];

if (! class_exists('WP_CLI')) {
	class WP_CLI
	{
		public static function add_command()
		{
		}
	}
}

if (! class_exists('WP_User')) {
	class WP_User
	{
		/** @var array<int,string> */
		public array $roles = [];

		public int $ID = 0;
	}
}

if (! function_exists('get_echo')) {
	/**
	 * Capture the echo of a callable function.
	 *
	 * @param       $callable
	 * @param array $args
	 *
	 * @return string
	 */
	function get_echo($callable, $args = [])
	{
		ob_start();
		call_user_func_array($callable, $args);

		return ob_get_clean();
	}
}
