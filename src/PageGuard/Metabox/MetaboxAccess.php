<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Foundation\AdminCapability;

/**
 * Authorisation and save-gating shared by every metabox-related listener.
 *
 * Both the renderer (which decides whether to draw the form fields or a
 * "no permission" notice) and the save/sync handlers depend on these two
 * checks, so they live together in one explicit place.
 */
final class MetaboxAccess
{
	/**
	 * Nonce action for the metabox form. Kept as a fixed string (historically
	 * `basename(__FILE__)` of the old monolithic Metabox.php) so in-flight edit
	 * sessions continue to validate after the file was split.
	 */
	public const NONCE_ACTION = 'Metabox.php';

	/**
	 * Decide whether the current `save_post` request should be acted on for the
	 * given post. Returns false for autosaves, wrong post types, missing nonces,
	 * insufficient capabilities, and users who do not own the post.
	 *
	 * As a side effect, copies the bulk-edit fields from $_REQUEST to $_POST so
	 * downstream code can read them in a single place.
	 */
	public function shouldSave(int $postId): bool
	{
		if (isset($_POST['ypg_metaboxes_nonce'])) {
			if (! wp_verify_nonce($_POST['ypg_metaboxes_nonce'], self::NONCE_ACTION)) {
				return false;
			}
		} elseif (isset($_POST['_inline_edit'])) {
			if (! wp_verify_nonce($_POST['_inline_edit'], 'inlineeditnonce')) {
				return false;
			}
		} elseif (isset($_REQUEST['_wpnonce'])) {
			if (! wp_verify_nonce($_REQUEST['_wpnonce'], 'bulk-posts')) {
				return false;
			}

			foreach (['ypg_post_content_owner', 'ypg_review_date', 'ypg_is_verified', 'post_type'] as $key) {
				if (isset($_REQUEST[$key])) {
					$_POST[$key] = $_REQUEST[$key];
				}
			}
		} else {
			return false;
		}

		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return false;
		}

		$postTypes = apply_filters('yard::page-guard/post-types-to-use', ['page']);
		if (! isset($_POST['post_type']) || ! in_array($_POST['post_type'], $postTypes, true)) {
			return false;
		}

		if (! current_user_can('edit_pages', $postId)) {
			return false;
		}

		return $this->currentUserHasAccess($postId);
	}

	/**
	 * Whether the current user is allowed to view/edit the metabox for the given
	 * post. Admins (filterable), the post author, and the assigned WP-user owner
	 * are all granted; external content owners are not WP users so they are not.
	 */
	public function currentUserHasAccess(int $postId): bool
	{
		$post = get_post($postId);
		$contentOwnerId = get_post_meta($postId, 'ypg_post_content_owner_id', true) ?: '';
		$contentOwnerType = get_post_meta($postId, 'ypg_post_content_owner_type', true);
		$currentUser = wp_get_current_user();

		if (
			0 === strlen($post->post_name)
			|| current_user_can(AdminCapability::name())
			|| '' === $contentOwnerId
			|| $currentUser->ID === $post->post_author
		) {
			return true;
		}

		return (int) $contentOwnerId === $currentUser->ID && ContentOwnerType::USER === $contentOwnerType;
	}
}
