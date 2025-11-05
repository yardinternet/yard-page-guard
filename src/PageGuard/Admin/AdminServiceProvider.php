<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\Date;

class AdminServiceProvider extends ServiceProvider
{
    use Date;

    public function register(): void
    {
        $adminSettingsPage = new AdminSettingsPage();
        $adminOverviewPage = new AdminOverviewPage();
        $adminSettingsPage->init();
        $adminOverviewPage->init();

        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);

        add_action('admin_enqueue_scripts', function (string $hook): void {
            if ('settings_page_page-guard-settings' === $hook) {
                $this->enqueueEditorAssets();
            }

            if (('edit-tags.php' === $hook || 'term.php' === $hook) && isset($_GET['taxonomy']) && 'ypg_external_content_owner' === $_GET['taxonomy']) {
                $this->enqueueEditorAssets();
            }
        });

        add_action('init', function () {
            foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
                add_filter("manage_{$postType}_posts_columns", [$this, 'manageCustomColumns']);
                add_action("manage_{$postType}_posts_custom_column", [$this, 'fillCustomColumns'], 10, 2);
                add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
            }
        });

        add_filter('manage_edit-ypg_external_content_owner_columns', function (array $columns) {
            unset($columns['description']);

            $orderedColumns = [];
            foreach ($columns as $key => $value) {
                $orderedColumns[$key] = $value;

                if ('name' === $key) {
                    $orderedColumns['email'] = __('Email', 'yard-page-guard');
                }
            }

            return $orderedColumns;
        });

        add_filter('manage_ypg_external_content_owner_custom_column', function (string $content, string $columnName, int $termId) {
            if ('email' === $columnName) {
                $content = get_term_meta($termId, 'ypg_external_content_owner_email', true);
            }

            return $content;
        }, 10, 3);

        add_action('pre_get_posts', [$this, 'sortCustomColumns']);
    }

    public function enqueueEditorAssets(): void
    {
        wp_enqueue_style(
            'ypg-editor-styles',
            $this->plugin->resourceUrl('editor.css'),
            [],
            filemtime($this->plugin->resourcePath('editor.css')),
        );
    }

    public function manageCustomColumns(array $columns): array
    {
        $columns['ypg_post_content_owner'] = __('Inhoudseigenaar', 'yard-page-guard');
        $columns['ypg_is_verified'] = __('Gecontroleerd?', 'yard-page-guard');
        $columns['ypg_review_date'] = __('Controle datum', 'yard-page-guard');

        return $columns;
    }

    public function fillCustomColumns(string $column, int $postID): void
    {
        if ('ypg_post_content_owner' === $column) {
            $contentOwner = get_post_meta($postID, 'ypg_post_content_owner_name', true);

            if (false === $contentOwner || '' === $contentOwner) {
                echo __('Onbekend', 'yard-page-guard');
            } else {
                echo $contentOwner;
            }
        }

        if ('ypg_is_verified' === $column) {
            $isVerified = get_post_meta($postID, 'ypg_is_verified', true);
            echo '1' === $isVerified ? __('Ja', 'yard-page-guard') : __('Nee', 'yard-page-guard');
        }

        if ('ypg_review_date' === $column) {
            $reviewDate = get_post_meta($postID, 'ypg_review_date', true);
            echo $reviewDate ? $this->formatDate($reviewDate) : __('Niet ingesteld', 'yard-page-guard');
        }
    }

    public function makeCustomColumnsSortable(array $columns): array
    {
        $columns['ypg_is_verified'] = 'ypg_is_verified';
        $columns['ypg_review_date'] = 'ypg_review_date';

        return $columns;
    }

    public function sortCustomColumns(WP_Query $query): void
    {
        if (! is_admin() || ! $query->is_main_query()) {
            return;
        }

        $orderby = $query->get('orderby');
        $order = $query->get('order');

        if ('ypg_is_verified' === $orderby) {
            $query->set('meta_query', [
                'relation' => 'OR',
                [
                    'key' => 'ypg_is_verified',
                    'compare' => 'EXISTS',
                ],
                [
                    'key' => 'ypg_is_verified',
                    'compare' => 'NOT EXISTS',
                ],
            ]);
            $query->set('orderby', [
                'meta_value' => $order,
                'date' => 'DESC',
            ]);
        }

        if ('ypg_review_date' === $orderby) {
            $query->set('meta_query', [
                'relation' => 'OR',
                [
                    'key' => 'ypg_review_date',
                    'compare' => 'EXISTS',
                    'type' => 'DATE',
                ],
                [
                    'key' => 'ypg_review_date',
                    'compare' => 'NOT EXISTS',
                    'type' => 'DATE',
                ],
            ]);
            $query->set('orderby', [
                'meta_value' => $order,
                'date' => 'DESC',
            ]);
        }
    }
}
