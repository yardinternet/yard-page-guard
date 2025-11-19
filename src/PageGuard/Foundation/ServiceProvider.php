<?php

declare(strict_types=1);

namespace Yard\PageGuard\Foundation;

abstract class ServiceProvider
{
	/**
	 * Instance of the plugin.
	 */
	protected Plugin $plugin;

	/**
	 * Construction of the service provider.
	 */
	public function __construct(Plugin $plugin)
	{
		$this->plugin = $plugin;
	}

	/**
	 * Register the service provider.
	 */
	abstract public function register(): void;
}
