<?php

declare(strict_types=1);

namespace Yard\PageGuard\Settings;

use Yard\PageGuard\Foundation\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		$settings = new Settings();
		add_action('init', [$settings, 'registerSettings']);
		add_action('rest_api_init', [$settings, 'registerSettings']);
	}
}
