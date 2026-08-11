<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use WP_Post;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Traits\PostTypes;

class MetaServiceProvider extends ServiceProvider
{
	use PostTypes;

	public function register(): void
	{
		$meta = new Meta();
		add_action('init', [$meta, 'registerMeta']);
		add_action('rest_api_init', [$meta, 'registerMeta']);
		add_action('rest_api_init', [$this, 'registerReviewDateSync']);
	}

	public function registerReviewDateSync(): void
	{
		foreach ($this->getPostTypes() as $postType) {
			add_action("rest_after_insert_{$postType}", [$this, 'ensureReviewDate'], 10, 1);
		}
	}

	public function ensureReviewDate(WP_Post $post): void
	{
		(new ReviewItem($post))->ensureReviewDate();
	}
}
