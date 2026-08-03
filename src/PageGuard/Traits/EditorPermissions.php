<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

/**
 * Capability checks shared by the block editor REST endpoints.
 */
trait EditorPermissions
{
	protected function adminCapability(): string
	{
		return (string) apply_filters('yard::page-guard/capability/admin', 'edit_pages');
	}

	/**
	 * May the current user manage page guard data at all? Used by the endpoints
	 * that return data which is not tied to a single post.
	 */
	public function canManage(): bool
	{
		return current_user_can($this->adminCapability());
	}

	public function canEditPost(int $postId): bool
	{
		if (! $this->isEnabledPostType($postId)) {
			return false;
		}

		return current_user_can($this->adminCapability(), $postId) && current_user_can('edit_post', $postId);
	}

	public function isEnabledPostType(int $postId): bool
	{
		$postType = get_post_type($postId);

		if (! is_string($postType)) {
			return false;
		}

		return in_array($postType, apply_filters('yard::page-guard/post-types-to-use', ['page']), true);
	}
}
