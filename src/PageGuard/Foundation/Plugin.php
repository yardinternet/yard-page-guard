<?php

namespace Yard\PageGuard\Foundation;

class Plugin
{
	const NAME = \YPG_PLUGIN_NAME;
	const VERSION = \YPG_VERSION;

	public string $rootPath;
	public Config $config;

	public function __construct(string $rootPath)
	{
		$this->rootPath = $rootPath;
		\load_plugin_textdomain($this->getName(), false, sprintf('%s/languages/', $this->getName()));

		$this->config = new Config($this->rootPath . '/config');
		$this->config->setProtectedNodes(['core']);
		$this->config->boot();
	}

	public function boot(): bool
	{
		// Set up service providers
		$this->callServiceProviders('register');

		if (\is_admin()) {
			$this->callServiceProviders('register', 'admin');
			$this->callServiceProviders('boot', 'admin');
		}

		$this->callServiceProviders('boot');

		return true;
	}

	/**
	 * Get the path to a particular resource.
	 */
	public function resourceUrl(string $file, string $directory = ''): string
	{
		$directory = ! empty($directory) ? $directory . '/' : '';

		return plugins_url("build/{$directory}{$file}", YPG_PLUGIN_NAME . '/plugin.php');
	}

	public function resourcePath(string $file, string $directory = ''): string
	{
		$directory = ! empty($directory) ? $directory . '/' : '';

		return $this->rootPath . "/build/{$directory}{$file}";
	}

	public function callServiceProviders(string $method, string $key = ''): void
	{
		$offset = $key ? "core.providers.{$key}" : 'core.providers';
		$services = $this->config->get($offset);

		if (! is_array($services)) {
			return;
		}

		foreach ($services as $service) {
			if (is_array($service)) {
				continue;
			}

			$service = new $service($this);

			if (! $service instanceof ServiceProvider) {
				throw new \Exception('Provider must be an instance of ServiceProvider.');
			}

			if (! method_exists($service, $method)) {
				continue;
			}

			$service->$method();
		}
	}

	public function getName(): string
	{
		return static::NAME;
	}

	public function getVersion(): string
	{
		return static::VERSION;
	}

	/**
	 * Return root url of plugin.
	 */
	public function getPluginUrl(): string
	{
		return \plugins_url($this->getName());
	}
}
