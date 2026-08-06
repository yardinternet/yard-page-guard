<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\ListTables;

use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Traits\PostTypes;

if (! class_exists('WP_List_Table')) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php'; //
}

class PageGuardListTable extends \WP_List_Table
{
	use PostTypes;

	public function get_columns()
	{
		return [
			'cb' => '<input type="checkbox" />',
			'title' => __('Pagina', 'yard-page-guard'),
			'type' => __('Type', 'yard-page-guard'),
			'owner' => __('Eigenaar', 'yard-page-guard'),
			'last_review' => __('Laatst gecontroleerd op', 'yard-page-guard'),
			'last_reminder' => __('Laatste herinneringsmail', 'yard-page-guard'),
			'next_review' => __('Volgende herzieningsdatum', 'yard-page-guard'),
			'status' => __('Status', 'yard-page-guard'),
		];
	}

	public function get_sortable_columns()
	{
		// FIXME: make the columns sortable by meta value, not by post title
		return [
			'title' => ['post_title'],
			// 'last_review' => [PostMeta::LAST_REVIEW_DATE],
			// 'last_reminder' => [PostMeta::LAST_REMINDER_DATE],
			// 'next_review' => [PostMeta::REVIEW_DATE],
		];
	}
	public function column_cb($item)
	{
		return sprintf(
			'<input type="checkbox" name="bulk_edit[]" value="%1$s" id="cb-select-%1$s" />' .
					'<label for="cb-select-%1$s"><span class="screen-reader-text">%2$s</span></label>',
			$item->ID,
			/* translators: Hidden accessibility text. %s: Taxonomy term name. */
			sprintf(__('Select %s'), $item->post_title)
		);
	}

	public function column_default($item, $column_name)
	{
		$reviewItem = new ReviewItem($item);

		switch ($column_name) {
			case 'title':
				return sprintf('<a href="%s">%s</a>', get_edit_post_link($item), $item->post_title);
			case 'type':
				return esc_html(get_post_type_labels(get_post_type_object($item->post_type))->singular_name);
			case 'owner':
				//TODO: add external/internal owner type to the list table and link to meta/profile
				return $reviewItem->contentOwner() ? $reviewItem->contentOwner()->name() : __('Niet ingesteld', 'yard-page-guard');
			case 'last_review':
				return $reviewItem->lastReviewDateFormatted();
			case 'last_reminder':
				return $reviewItem->lastReminderDateFormatted();
			case 'next_review':
				return $reviewItem->reviewDateFormatted();
			case 'status':
				return $reviewItem->status();
			default:
				return '';
		}
	}

	public function get_bulk_actions()
	{
		return [
			'mark_as_reviewed' => __('Markeer als gecontroleerd', 'yard-page-guard'),
			//'transfer_ownership' => __('Eigendom overdragen', 'yard-page-guard'),
			//'set_review_date' => __('Stel herzieningsdatum in', 'yard-page-guard'),
		];
	}

	public function prepare_items()
	{
		$columns = $this->get_columns();
		$hidden = [];
		$sortable = $this->get_sortable_columns();
		$this->_column_headers = [ $columns, $hidden, $sortable ];

		$orderby = ! empty($_GET['orderby']) ? sanitize_key($_GET['orderby']) : 'date';
		$order = ! empty($_GET['order'])   ? sanitize_key($_GET['order'])   : 'DESC';

		$screen = get_current_screen();
		$per_page = $this->get_items_per_page(str_replace('-', '_', $screen->id . '_per_page'));
		$current_page = $this->get_pagenum();

		$metaQuery = [
			[
				'key' => Meta::POST_CONTENT_OWNER_ID,
				'compare' => 'EXISTS',
			],
		];

		if (! empty($_GET['status_view']) && 'expired' === $_GET['status_view']) {
			$metaQuery[] = [
				'key' => Meta::REVIEW_DATE,
				'value' => current_time('Y-m-d'),
				'compare' => '<',
				'type' => 'DATE',
			];
		} elseif (! empty($_GET['status_view']) && 'checked' === $_GET['status_view']) {
			$metaQuery[] = [
				'key' => Meta::REVIEW_DATE,
				'value' => current_time('Y-m-d'),
				'compare' => '>=',
				'type' => 'DATE',
			];
		}

		$args = [
			'post_type' => $this->getPostTypes(),
			'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
			'posts_per_page' => $per_page,
			'paged' => $current_page,
			'orderby' => $orderby,
			'order' => $order,
			'meta_query' => $metaQuery,
		];

		$query = new \WP_Query($args);
		$this->items = $query->posts;
		$this->set_pagination_args([
			'total_items' => $query->found_posts,
			'per_page' => $per_page,
			'total_pages' => $query->max_num_pages,
		]);
	}

	protected function extra_tablenav($which)
	{
		// TODO: add inputs for bulk actions like transfer ownership and set review date
	}

	protected function get_views()
	{
		$current = (! empty($_GET['status_view'])) ? sanitize_key($_GET['status_view']) : 'all';

		$base_url = admin_url('admin.php?page=' . $_REQUEST['page']);

		$expiredPosts = get_posts(
			[
				'post_type' => $this->getPostTypes(),
				'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
				'meta_query' => [
					[
						'key' => Meta::REVIEW_DATE,
						'value' => current_time('Y-m-d'),
						'compare' => '<',
						'type' => 'DATE',
					],
				],
				'numberposts' => -1,
				'fields' => 'ids',
			]
		);
		$nonExpiredPosts = get_posts(
			[
				'post_type' => $this->getPostTypes(),
				'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
				'meta_query' => [
					[
						'key' => Meta::REVIEW_DATE,
						'value' => current_time('Y-m-d'),
						'compare' => '>=',
						'type' => 'DATE',
					],
				],
				'numberposts' => -1,
				'fields' => 'ids',
			]
		);

		$views = [
			'all' => sprintf(
				'<a href="%s" class="%s">%s <span class="count">(%d)</span></a>',
				esc_url($base_url),
				('all' === $current) ? 'current' : '',
				__('All statussen', 'yard-page-guard'),
				count($expiredPosts) + count($nonExpiredPosts)
			),
			'expired' => sprintf(
				'<a href="%s" class="%s">%s <span class="count">(%d)</span></a>',
				esc_url(add_query_arg('status_view', 'expired', $base_url)),
				('expired' === $current) ? 'current' : '',
				__('Achterstallig', 'yard-page-guard'),
				count($expiredPosts)
			),
			'checked' => sprintf(
				'<a href="%s" class="%s">%s <span class="count">(%d)</span></a>',
				esc_url(add_query_arg('status_view', 'checked', $base_url)),
				('checked' === $current) ? 'current' : '',
				__('Gecontroleerd', 'yard-page-guard'),
				count($nonExpiredPosts)
			),
		];

		return $views;
	}

	public function process_bulk_action()
	{
		$action = $this->current_action();
		if (false === $action) {
			return;
		}

		check_admin_referer('bulk-' . $this->_args['plural']);
		$ids = isset($_POST['bulk_edit']) ? array_map('intval', $_POST['bulk_edit']) : [];

		if (count($ids) === 0) {
			return;
		}

		switch ($action) {
			case 'mark_as_reviewed':
				foreach ($ids as $id) {
					$reviewItem = new \Yard\PageGuard\Models\ReviewItem(get_post($id));
					$reviewItem->markAsReviewed();
				}
				add_settings_error(
					'bulk_action',
					'bulk_action',
					sprintf(
						_n(
							'%d post gemarkeerd als gecontroleerd.',
							'%d posts gemarkeerd als gecontroleerd.',
							count($ids),
							'yard-page-guard'
						),
						count($ids),
					),
					'success'
				);

				break;
			case 'transfer_ownership':
			case 'set_review_date':
				// TODO: implement bulk actions for transferring ownership and setting review date
				break;
		}
	}

	public function no_items()
	{
		_e('Geen resultaten gevonden.', 'yard-page-guard');
	}
}
