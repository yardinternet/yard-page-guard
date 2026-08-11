<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson;

use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\WPJson\Controllers\EditorController;
use Yard\PageGuard\WPJson\Controllers\FrontEndController;

class WPJsonServiceProvider extends ServiceProvider
{
	/** @var \WP_REST_Controller[] */
	protected array $controllers = [];
	protected EditorController $editorController;

	public function register(): void
	{
		$this->controllers = [
			new FrontEndController(),
			new EditorController(),
		];
		add_action('rest_api_init', [$this, 'registerRoutes']);
	}

	public function registerRoutes(): void
	{
		foreach ($this->controllers as $controller) {
			$controller->register_routes();
		}
	}
}
