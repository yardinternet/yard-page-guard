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
		$termMeta = new TermMeta();
		add_action('init', [$meta, 'registerMeta']);
		add_action('init', [$termMeta, 'registerMeta']);
		add_action('rest_api_init', [$meta, 'registerMeta']);
		add_action('rest_api_init', [$termMeta, 'registerMeta']);
		add_action('rest_api_init', [$this, 'registerReviewDateSync']);
		add_action('updated_postmeta', [$this, 'clearMeta'], 10, 4);
	}

	public function registerReviewDateSync(): void
	{
		foreach ($this->getPostTypes() as $postType) {
			add_action("rest_after_insert_{$postType}", [$this, 'ensureReviewDate'], 10, 1);
		}
	}

	public function clearMeta(int $metaId, int $postId, string $metaKey, $metaValue): void
	{
		if (Meta::POST_CONTENT_OWNER_ID === $metaKey && 0 === $metaValue) {
			$reviewItem = new ReviewItem(get_post($postId));
			$reviewItem->removeMetaData();
		}

		if (Meta::REVIEW_DATE === $metaKey) {
			$reviewItem = new ReviewItem(get_post($postId));
			$reviewItem->resetSentEmails();
		}
	}

	public function ensureReviewDate(WP_Post $post): void
	{
		(new ReviewItem($post))->ensureReviewDate();
	}
}
