<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\ListTables;

use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Traits\ContentOwners;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\PostStatusses;
use Yard\PageGuard\Traits\PostTypes;

if (! class_exists('WP_List_Table')) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php'; //
}

class PageGuardListTable extends \WP_List_Table
{
	use Date;
	use PostTypes;
	use PostStatusses;
	use ContentOwners;

	public const ACTION_MARK_AS_REVIEWED = 'mark_as_reviewed';
	public const ACTION_TRANSFER_OWNERSHIP = 'transfer_ownership';
	public const ACTION_SET_REVIEW_DATE = 'set_review_date';

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
				//TODO: add external/internal owner type to the list table and link to meta/profile or filter current list table by owner
				return $reviewItem->contentOwner() ? $reviewItem->contentOwner()->displayName() : __('Niet ingesteld', 'yard-page-guard');
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
			self::ACTION_MARK_AS_REVIEWED => __('Markeer als gecontroleerd', 'yard-page-guard'),
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
				'compare' => '>',
				'value' => 0,
				'type' => 'NUMERIC',
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
			'post_status' => $this->postStatussesToUse(),
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
		if ('top' !== $which) {
			// FIXME: duplicate buttons and use marryControls to link them
			return;
		}
		$newContentOwnerId = 'new_content_owner';
		$newContentOwnerButtonId = 'set_content_owner';
		$newReviewDateId = 'new_review_date';
		$newReviewDateButtonId = 'set_review_date';

		?>
		<div class="alignleft actions">
			<label class="screen-reader-text" for="<?php echo $newContentOwnerId; ?>">
			<?php _e('Eigenaar veranderen naar&hellip;', 'yard-page-guard');?>
			</label>
			<select name="<?php echo $newContentOwnerId; ?>" id="<?php echo $newContentOwnerId; ?>">
				<option value=""><?php _e('Eigenaar veranderen naar&hellip;', 'yard-page-guard'); ?></option>
				<?php
				foreach ($this->getContentOwners() as $owner) {
					printf(
						'<option value="%s">%s</option>',
						esc_attr($owner->combinedId()),
						esc_html($owner->displayName())
					);
				}?>
			</select>
			<?php submit_button(__('Change'), '', $newContentOwnerButtonId, false);	?>

			<label class="screen-reader-text" for="<?php echo $newReviewDateId; ?>">
			<?php _e('Herzieningsdatum instellen op&hellip;', 'yard-page-guard');?>
			</label>
			<input type="date" name="new_review_date" id="<?php echo $newReviewDateId; ?>" value="<?php echo esc_attr($this->defaultReviewDate()->format('Y-m-d')); ?>" min="<?php echo esc_attr(current_time('Y-m-d')); ?>" />
			<?php submit_button(__('Herzieningsdatum instellen'), '', $newReviewDateButtonId, false);	?>
		</div>

	<?php
	}

	protected function get_views()
	{
		$current = (! empty($_GET['status_view'])) ? sanitize_key($_GET['status_view']) : 'all';

		$base_url = admin_url('admin.php?page=' . $_REQUEST['page']);

		$expiredPosts = get_posts(
			[
				'post_type' => $this->getPostTypes(),
				'post_status' => $this->postStatussesToUse(),
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
				'post_status' => $this->postStatussesToUse(),
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

	public function current_action()
	{
		if (isset($_REQUEST['set_content_owner']) && isset($_REQUEST['new_content_owner']) && ! empty($_REQUEST['new_content_owner'])) {
			return self::ACTION_TRANSFER_OWNERSHIP;
		}
		if (isset($_REQUEST['set_review_date']) && isset($_REQUEST['new_review_date']) && ! empty($_REQUEST['new_review_date'])) {
			return self::ACTION_SET_REVIEW_DATE;
		}

		return parent::current_action();
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
			add_settings_error(
				'bulk_action',
				'bulk_action',
				__('Geen pagina\'s geselecteerd.', 'yard-page-guard'),
				'warning'
			);

			return;
		}

		switch ($action) {
			case self::ACTION_MARK_AS_REVIEWED:
				foreach ($ids as $id) {
					$reviewItem = new ReviewItem(get_post($id));
					$reviewItem->markAsReviewed();
				}
				add_settings_error(
					'bulk_action',
					'bulk_action',
					sprintf(
						_n(
							'%d pagina gemarkeerd als gecontroleerd.',
							'%d pagina\'s gemarkeerd als gecontroleerd.',
							count($ids),
							'yard-page-guard'
						),
						count($ids),
					),
					'success'
				);

				break;
			case self::ACTION_TRANSFER_OWNERSHIP:
				$newContentOwner = ContentOwner::fromCombinedId(sanitize_text_field($_REQUEST['new_content_owner']));
				if (! $newContentOwner) {
					add_settings_error(
						'bulk_action',
						'bulk_action',
						__('Ongeldige inhoudseigenaar geselecteerd.', 'yard-page-guard'),
						'error'
					);

					return;
				}

				foreach ($ids as $id) {
					$reviewItem = new ReviewItem(get_post($id));
					$reviewItem->setContentOwner($newContentOwner->id(), $newContentOwner->type());
				}
				add_settings_error(
					'bulk_action',
					'bulk_action',
					sprintf(
						_n(
							'%d pagina overgedragen naar <code>%s</code>.',
							'%d pagina\'s overgedragen naar <code>%s</code>.',
							count($ids),
							'yard-page-guard'
						),
						count($ids),
						$newContentOwner->displayName()
					),
					'success'
				);

				break;
			case self::ACTION_SET_REVIEW_DATE:
				$newReviewDate = sanitize_text_field($_REQUEST['new_review_date']);
				$newReviewDate = \DateTime::createFromFormat('Y-m-d', $newReviewDate);
				if (! $newReviewDate) {
					add_settings_error(
						'bulk_action',
						'bulk_action',
						__('Ongeldige herzieningsdatum geselecteerd.', 'yard-page-guard'),
						'error'
					);

					return;
				}
				foreach ($ids as $id) {
					$reviewItem = new ReviewItem(get_post($id));
					$reviewItem->setReviewDate(ReviewDateType::CUSTOM, $newReviewDate);
				}
				add_settings_error(
					'bulk_action',
					'bulk_action',
					sprintf(
						_n(
							'%d pagina herzieningsdatum ingesteld op <code>%s</code>.',
							'%d pagina\'s herzieningsdatum ingesteld op <code>%s</code>.',
							count($ids),
							'yard-page-guard'
						),
						count($ids),
						$newReviewDate->format('Y-m-d')
					),
					'success'
				);

				break;
		}
	}

	public function no_items()
	{
		_e('Geen resultaten gevonden.', 'yard-page-guard');
	}
}
