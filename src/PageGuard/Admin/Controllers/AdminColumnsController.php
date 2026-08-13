<?php

declare(strict_types=1);

namespace Yard\PageGuard\Admin\Controllers;

/**
 * Exit when accessed directly.
 */
if (! defined('ABSPATH')) {
	exit;
}

use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy;
use Yard\PageGuard\Traits\PostTypes;

class AdminColumnsController
{
	use PostTypes;

	public const COLUMN_CONTENT_OWNER = 'ypg_post_content_owner';
	public const COLUMN_STATUS = 'ypg_status';
	public const COLUMN_REVIEW_DATE = 'ypg_review_date';

	public function init(): void
	{
		foreach ($this->getPostTypes() as $postType) {
			add_filter("manage_{$postType}_posts_columns", [$this, 'addColumns'], 10, 1);
			add_action("manage_{$postType}_posts_custom_column", [$this, 'renderColumn'], 10, 2);
			add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
		}

		//TODO: misschien in een aparte controller zetten, want dit is niet echt een column voor een post type
		add_filter('manage_edit-' . ExternalOwnerTaxonomy::TAXONOMY . '_columns', [$this, 'manageExternalContentOwnerColumns']);
		add_filter('manage_' . ExternalOwnerTaxonomy::TAXONOMY . '_custom_column', [$this, 'renderExternalContentOwnerColumn'], 10, 3);
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
				echo $reviewItem->contentOwner() ? $reviewItem->contentOwner()->name() : '&mdash;';

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

	public function manageExternalContentOwnerColumns(array $columns): array
	{
		unset($columns['description']);
		unset($columns['slug']);
		unset($columns['posts']); // 'posts' is the key for the count column

		$orderedColumns = [];
		foreach ($columns as $key => $value) {
			$orderedColumns[$key] = $value;

			if ('name' === $key) {
				$orderedColumns['email'] = __('Email', 'yard-page-guard');
				$orderedColumns['phone_number'] = __('Telefoonnummer', 'yard-page-guard');
			}
		}

		return $orderedColumns;
	}

	public function renderExternalContentOwnerColumn(string $content, string $columnName, int $termId): string
	{
		switch ($columnName) {
			case 'email':
				$content = get_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true);

				break;
			case 'phone_number':
				$content = get_term_meta($termId, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, true);

				break;
		}

		return $content;
	}
}
