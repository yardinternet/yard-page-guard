<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Date;

class AdminOverviewPage
{
    use Date;

    public function init(): void
    {
        add_action('admin_menu', [$this, 'add_overview_subpage']);
    }

    public function add_overview_subpage(): void
    {
        add_menu_page(
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            'manage_options',
            'page-guard-overview',
            [$this, 'render_overview_page'],
            'dashicons-visibility',
            20
        );
    }

    public function render_overview_page(): void
    {
        $reviewItemsQuery = new WP_Query([
            'post_type' => apply_filters('yard::page-guard/post-types-to-use', ['page']),
            'posts_per_page' => -1,
            'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
            'meta_query' => [
                'relation' => 'AND',
                [
                    'key' => 'ypg_post_content_owner_email',
                    'compare' => 'EXISTS',
                ],
            ],
            // Performance
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
        ]);

        $reviewItems = $reviewItemsQuery->posts;
        ?>
        <div class="wrap">
            <h1><?= __('Houdbaarheidsmodule Overzicht', 'yard-page-guard'); ?></h1>

            <div class="filter-buttons" style="margin-bottom: 20px;">
                <button class="button"><?= __('Alle items', 'yard-page-guard'); ?></button>
                <button class="button"><?= __('Achterstallig', 'yard-page-guard'); ?></button>
                <button class="button"><?= __('Binnenkort te herzien', 'yard-page-guard'); ?></button>
            </div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?= __('Pagina', 'yard-page-guard'); ?></th>
                        <th><?= __('Eigenaar', 'yard-page-guard'); ?></th>
                        <th><?= __('Herzieningsdatum', 'yard-page-guard'); ?></th>
                        <th><?= __('Status', 'yard-page-guard'); ?></th>
                    </tr>
                </thead>
                <tbody>
					<?php
                    foreach ($reviewItems as $reviewItem):
                        $contentOwnerType = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_type', true);
                        $contentOwnerId = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_id', true);
                        $reviewDate = get_post_meta($reviewItem->ID, 'ypg_review_date', true);
                        $formattedReviewDate = $this->formatDate(get_post_meta($reviewItem->ID, 'ypg_review_date', true));
                        $reviewStatus = __('Op schema', 'yard-page-guard');

                        if ($reviewDate) {
                            $today = date('Y-m-d');
                            if ($reviewDate < $today) {
                                $reviewStatus = __('Achterstallig', 'yard-page-guard');
                            }
                        }

                        if (ContentOwnerType::EXTERNAL === $contentOwnerType) {
                            $contentOwner = get_term($contentOwnerId, 'ypg_external_content_owner');
                        } else {
                            $contentOwner = get_user_by('ID', $contentOwnerId);
                        }
                        ?>
                    <tr>
                        <td><a href="<?= get_edit_post_link($reviewItem->ID) ?>"><?= $reviewItem->post_title ?></a></td>
                        <td><a href="<?= ContentOwnerType::EXTERNAL === $contentOwnerType ? get_edit_term_link($contentOwner->term_id) : get_edit_user_link($contentOwner->ID) ?>"><?= ContentOwnerType::EXTERNAL === $contentOwnerType ? $contentOwner->name : $contentOwner->display_name ?></a></td>
                        <td><?= $formattedReviewDate ?></td>
                        <td><?= $reviewStatus ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
