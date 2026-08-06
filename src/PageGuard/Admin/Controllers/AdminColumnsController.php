<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

/**
 * Exit when accessed directly.
 */
if (! defined('ABSPATH')) {
	exit;
}

use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ReviewItem;

class AdminColumnsController
{
	public const COLUMN_CONTENT_OWNER = 'ypg_post_content_owner';
	public const COLUMN_STATUS = 'ypg_status';
	public const COLUMN_REVIEW_DATE = 'ypg_review_date';

	public function init(): void
	{
		foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
			add_filter("manage_{$postType}_posts_columns", [$this, 'addColumns'], 10, 1);
			add_action("manage_{$postType}_posts_custom_column", [$this, 'renderColumn'], 10, 2);
			add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
		}

		// TODO: term columns for external_content_owner taxonomy
	}

	public function addColumns(array $columns): array
	{
		$columns[self::COLUMN_CONTENT_OWNER] = __('Inhoudseigenaar', 'yard-page-guard');
		$columns[self::COLUMN_STATUS] = __('Status', 'yard-page-guard');
		$columns[self::COLUMN_REVIEW_DATE] = __('Volgende herzieningsdatum', 'yard-page-guard');

		return $columns;
	}

	public function renderColumn(string $columnName, int $postId): void
	{
		$reviewItem = new ReviewItem(get_post($postId));

		switch ($columnName) {
			case self::COLUMN_CONTENT_OWNER:
				echo $reviewItem->contentOwner() ? $reviewItem->contentOwner()->name() : __('Niet ingesteld', 'yard-page-guard');

				break;

			case self::COLUMN_STATUS:
				echo $reviewItem->status();

				break;

			case self::COLUMN_REVIEW_DATE:

				echo $reviewItem->reviewDateFormatted();

				break;
		}
	}

	public function makeCustomColumnsSortable(array $columns): array
	{
		$columns[self::COLUMN_REVIEW_DATE] = Meta::REVIEW_DATE;

		return $columns;
	}
}
