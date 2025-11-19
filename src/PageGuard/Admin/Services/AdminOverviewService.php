<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Services;

use WP_Query;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Meta;
use Yard\PageGuard\Traits\Text;

class AdminOverviewService
{
	use Text;
	use Date;
	use Meta;

	public function handleBulkEdit(): void
	{
		if (! current_user_can('manage_options')) {
			wp_die(__('U heeft geen toegang tot deze actie.', 'yard-page-guard'));
		}

		check_admin_referer('ypg_bulk_update');

		$postIds = array_map('intval', $_POST['post_ids'] ?? []);
		$reviewDate = sanitize_text_field(! empty($_POST['ypg_review_date']) ? $_POST['ypg_review_date'] : 'none');
		$reviewStatus = sanitize_text_field($_POST['ypg_review_status'] ?? 'keep'); // Either 'keep', '1' (verify) or '0' (unverify)
		$contentOwner = sanitize_text_field($_POST['ypg_post_content_owner'] ?? 'keep'); // Either 'keep', 'none' (removes all ypg meta) or | seperated owner data

		if ([] === $postIds) {
			wp_redirect(add_query_arg('ypg_updated', 'none', wp_get_referer()));
			exit;
		}

		if ('none' !== $contentOwner && 'keep' !== $contentOwner) {
			$contentOwner = $this->parseContentOwnerData($contentOwner);
		}

		foreach ($postIds as $postId) {
			$previouslyVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
			$toBeVerified = intval($reviewStatus);

			if ('none' === $contentOwner) {
				$this->clearReviewMeta($postId);

				continue;
			}

			if ('keep' !== $reviewStatus) {
				update_post_meta($postId, 'ypg_is_verified', $toBeVerified);

				if ($toBeVerified) {
					update_post_meta($postId, 'ypg_last_review_date', date('Y-m-d'));
					delete_post_meta($postId, 'ypg_review_mail_sent');
				}

				if ('none' === $reviewDate && $toBeVerified) {
					$calculatedReviewDate = $this->computeReviewDate($postId, (bool) $toBeVerified, $previouslyVerified);
					$calculatedReminderDate = $this->computeReminderDate($postId, (bool) $toBeVerified, $previouslyVerified);

					update_post_meta($postId, 'ypg_review_date', $calculatedReviewDate);
					update_post_meta($postId, 'ypg_reminder_date', $calculatedReminderDate);
				}
			}

			if ('none' !== $reviewDate && $this->isValidDate($reviewDate)) {
				$isVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);

				update_post_meta($postId, 'ypg_review_date', $reviewDate);
				update_post_meta($postId, 'ypg_reminder_date', $this->computeReminderDate($postId, $isVerified, $previouslyVerified));
			}

			if (is_array($contentOwner)) {
				update_post_meta($postId, 'ypg_post_content_owner_id', $contentOwner['id']);
				update_post_meta($postId, 'ypg_post_content_owner_name', $contentOwner['name']);
				update_post_meta($postId, 'ypg_post_content_owner_email', $contentOwner['email']);
				update_post_meta($postId, 'ypg_post_content_owner_type', $contentOwner['type']);
			}
		}

		wp_redirect(add_query_arg('ypg_updated', 'success', wp_get_referer()));
		exit;
	}

	public function handleOverviewQuery(): array
	{
		// Pagination
		$currentPage = max(1, intval($_GET['paged'] ?? 1));
		$itemsPerPage = max(1, intval($_GET['items_per_page'] ?? 20));

		// Filters
		$filterOwner = sanitize_text_field($_GET['ypg_filter_owner'] ?? 'none');
		$filterType = sanitize_text_field($_GET['ypg_filter_type'] ?? 'all');
		$filterStatus = sanitize_text_field($_GET['ypg_filter_status'] ?? 'all');

		$metaQuery = [
			[
				'key' => 'ypg_post_content_owner_email',
				'compare' => 'EXISTS',
			],
		];

		if ('none' !== $filterOwner) {
			$owner = $this->parseContentOwnerData($filterOwner);

			$metaQuery[] = [
				'key' => 'ypg_post_content_owner_id',
				'value' => $owner['id'],
				'compare' => '=',
			];

			$metaQuery[] = [
				'key' => 'ypg_post_content_owner_type',
				'value' => $owner['type'],
				'compare' => '=',
			];
		}

		$today = date('Y-m-d');

		if ('on_schedule' === $filterStatus) {
			$metaQuery[] = [
				'key' => 'ypg_review_date',
				'value' => $today,
				'compare' => '>=',
				'type' => 'DATE',
			];
		} elseif ('overdue' === $filterStatus) {
			$metaQuery[] = [
				'key' => 'ypg_review_date',
				'value' => $today,
				'compare' => '<',
				'type' => 'DATE',
			];
		}

		$query = new WP_Query([
			'post_type' => 'all' !== $filterType ? $filterType : apply_filters('yard::page-guard/post-types-to-use', ['page']),
			'posts_per_page' => $itemsPerPage,
			'paged' => $currentPage,
			'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
			'meta_key' => 'ypg_review_date',
			'orderby' => 'meta_value',
			'order' => 'ASC',
			'meta_query' => $metaQuery,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
		]);

		return [
			'items' => $query->posts,
			'items_per_page' => $itemsPerPage,
			'total_pages' => max(1, $query->max_num_pages),
			'total_items' => $query->found_posts,
			'current_page' => $currentPage,
			'filters' => [
				'owner' => $filterOwner,
				'type' => $filterType,
				'status' => $filterStatus,
			],
			'filter_status' => $filterStatus,
		];
	}

	public function buildPagination(array $query): string
	{
		$baseUrl = esc_url(remove_query_arg(['paged', 'items_per_page'], $_SERVER['REQUEST_URI'])) . '%_%';

		return paginate_links([
			'base' => $baseUrl,
			'format' => '&paged=%#%',
			'current' => $query['current_page'] ?? 1,
			'total' => $query['total_pages'] ?? 1,
			'prev_text' => '«',
			'next_text' => '»',
		]);
	}

	/**
	 * @param array<\WP_Post> $items
	 */
	public function buildTableRows(array $items)
	{
		foreach ($items as $reviewItem) {
			$contentOwnerType = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_type', true);
			$contentOwnerId = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_id', true);
			$nextReviewDate = get_post_meta($reviewItem->ID, 'ypg_review_date', true);
			$formattedNextReviewDate = $this->formatDate($nextReviewDate);
			$lastReviewDate = ! empty(get_post_meta($reviewItem->ID, 'ypg_last_review_date', true)) ? $this->formatDate(get_post_meta($reviewItem->ID, 'ypg_last_review_date', true)) : __('N.v.t.', 'yard-page-guard');
			$reviewStatus = __('Gecontroleerd', 'yard-page-guard');
			$contentOwner = (ContentOwnerType::EXTERNAL === $contentOwnerType)
				? get_term($contentOwnerId, 'ypg_external_content_owner')
				: get_user_by('ID', $contentOwnerId);
			$contentOwnerLink = ContentOwnerType::EXTERNAL === $contentOwnerType ? get_edit_term_link($contentOwner->term_id) : get_edit_user_link($contentOwner->ID);
			$contentOwnerName = ContentOwnerType::EXTERNAL === $contentOwnerType ? $contentOwner->name : $contentOwner->display_name;
			$postTypeLabel = get_post_type_labels(get_post_type_object(get_post_type($reviewItem->ID)))->singular_name;
			$reviewAttributes = '';
			$postEditLink = get_edit_post_link($reviewItem->ID);

			if ($nextReviewDate && date('Y-m-d') > $nextReviewDate) {
				$reviewStatus = __('Achterstallig', 'yard-page-guard');
				$reviewAttributes = 'class="overdue"';
			}

			echo <<<HTML
			<tr>
				<td><input type="checkbox" name="post_ids[]" value="$reviewItem->ID"></td>
				<td><a href="$postEditLink">$reviewItem->post_title</td>
				<td>$postTypeLabel</td>
				<td><a href="$contentOwnerLink">$contentOwnerName</a></td>
				<td>$lastReviewDate</td>
				<td $reviewAttributes>$formattedNextReviewDate</td>
				<td>$reviewStatus</td>
			</tr>
			HTML;
		}
	}

	public function buildUserList(?string $filterValue = null)
	{
		$wpUsers = get_users(['capability' => 'edit_pages']);
		$externalUsers = get_terms(['taxonomy' => 'ypg_external_content_owner', 'hide_empty' => false]);

		if (is_wp_error($externalUsers)) {
			return;
		}

		foreach ($wpUsers as $user) {
			$name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;
			$value = "{$user->ID}|{$name}|{$user->user_email}|user";
			$selected = selected($value, $filterValue, false);

			echo <<<HTML
				<option value="$value" $selected>$user->display_name</option>
			HTML;
		}

		foreach ($externalUsers as $user) {
			$email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');
			$value = "{$user->term_id}|{$user->name}|{$email}|external";
			$selected = null !== $filterValue ? selected($value, $filterValue, false) : '';
			$label = __('Extern', 'yard-page-guard');

			echo <<<HTML
				<option value="$value" $selected>$user->name ($label)</option>
			HTML;
		}
	}
}
