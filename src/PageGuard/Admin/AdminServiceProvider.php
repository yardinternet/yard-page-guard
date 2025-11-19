<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Admin\Controllers\AdminOverviewController;
use Yard\PageGuard\Admin\Controllers\AdminSettingsController;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Foundation\Plugin;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Traits\Date;

class AdminServiceProvider extends ServiceProvider
{
    use Date;

    private AdminSettingsController $adminSettingsController;
    private AdminOverviewController $adminOverviewController;

    public function __construct(Plugin $plugin)
    {
        parent::__construct($plugin);

        $this->adminSettingsController = new AdminSettingsController();
        $this->adminOverviewController = new AdminOverviewController();
    }

    public function register(): void
    {
        $this->adminSettingsController->init();
        $this->adminOverviewController->init();

        add_action('enqueue_block_editor_assets', [$this, 'enqueueAdminAssets']);

        /**
         * Enqueue admin scripts where necessary
         */
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssetsPerHook']);

        /**
         * Add post type overview columns
         */
        foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
            add_filter("manage_{$postType}_posts_columns", [$this, 'manageCustomColumns']);
            add_action("manage_{$postType}_posts_custom_column", [$this, 'fillCustomColumns'], 10, 2);
            add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
        }

        /**
         * Add post type quick/bulk edit functionality
         */
        add_action('quick_edit_custom_box', [$this, 'manageQuickEditFields'], 10, 2);
        add_action('bulk_edit_custom_box', [$this, 'manageQuickEditFields'], 10, 2);

        /**
         * Replace description column with email for external_content_owner taxonomy
         */
        add_filter('manage_edit-ypg_external_content_owner_columns', [$this, 'manageExternalContentOwnerColumns']);

        /**
         * Fill custom email column (see filter above) for external_content_owner taxonomy
         */
        add_filter('manage_ypg_external_content_owner_custom_column', function (string $content, string $columnName, int $termId) {
            if ('email' === $columnName) {
                $content = get_term_meta($termId, 'ypg_external_content_owner_email', true);
            }

            return $content;
        }, 10, 3);

        /**
         * Handle custom column sorting
         */
        add_action('pre_get_posts', [$this, 'sortCustomColumns']);
    }

    public function enqueueAdminAssets(): void
    {
        wp_enqueue_style(
            'ypg-editor-styles',
            $this->plugin->resourceUrl('admin.css'),
            [],
            filemtime($this->plugin->resourcePath('admin.css')),
        );

        wp_enqueue_script(
            'ypg-editor-scripts',
            $this->plugin->resourceUrl('admin.js'),
            ['wp-dom-ready'],
            filemtime($this->plugin->resourcePath('admin.js')),
        );
    }

    public function enqueueAdminAssetsPerHook(string $hook): void
    {
        // Settings & overview page
        if ('settings_page_page-guard-settings' === $hook || 'toplevel_page_ypg-overview' === $hook) {
            $this->enqueueAdminAssets();
        }

        // External content owner term list & detail page
        if (('edit-tags.php' === $hook || 'term.php' === $hook) && isset($_GET['taxonomy']) && 'ypg_external_content_owner' === $_GET['taxonomy']) {
            $this->enqueueAdminAssets();
        }

        // Edit post page
        if ('edit.php' === $hook && isset($_GET['post_type'])) {
            if (in_array($_GET['post_type'], apply_filters('yard::page-guard/post-types-to-use', ['page']), true)) {
                $this->enqueueAdminAssets();
            }
        }
    }

    public function manageExternalContentOwnerColumns(array $columns): array
    {
        unset($columns['description']);

        $orderedColumns = [];
        foreach ($columns as $key => $value) {
            $orderedColumns[$key] = $value;

            if ('name' === $key) {
                $orderedColumns['email'] = __('Email', 'yard-page-guard');
            }
        }

        return $orderedColumns;
    }

    public function manageQuickEditFields(string $columnName, string $postType)
    {
        if (! in_array($postType, apply_filters('yard::page-guard/post-types-to-use', ['page']))) {
            return;
        }

        switch ($columnName) {
            case 'ypg_post_content_owner': {
                $wpUsers = get_users([
                    'capability' => 'edit_pages',
                ]);

                $externalUsers = get_terms([
                    'taxonomy' => 'ypg_external_content_owner',
                    'hide_empty' => false,
                ]);

                if (is_wp_error($externalUsers)) {
                    return;
                }

                ?>
					<fieldset class="inline-edit-col-right">
					<div class="ypg-quick-edit-fields inline-edit-col">
						<label for="ypg-post-content-owner"><?= __('Inhoudseigenaar', 'yard-page-guard') ?></label>
						<select name="ypg_post_content_owner" id="ypg-post-content-owner">
							<option value="none"><?= __('Selecteer een eigenaar', 'yard-page-guard') ?></option>
							<?php
                                foreach ($wpUsers as $user) {
                                    $name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;

                                    printf(
                                        '<option value="%s|%s|%s|user">%s</option>',
                                        esc_attr($user->ID),
                                        esc_attr($name),
                                        esc_attr($user->user_email),
                                        esc_html($user->display_name)
                                    );
                                }
                ?>

							<?php
                    foreach ($externalUsers as $user) {
                        $email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');

                        printf(
                            '<option value="%s|%s|%s|external">%s (%s)</option>',
                            esc_attr($user->term_id),
                            esc_attr($user->name),
                            esc_attr($email),
                            esc_html($user->name),
                            __('Extern', 'yard-page-guard')
                        );
                    }
                ?>
						</select>
					</div>
					<?php
                break;
            }

            case 'ypg_is_verified': {
                ?>
					<div class="ypg-quick-edit-fields inline-edit-col">
						<label>
							<input type="checkbox" id="ypg-is-verified" name="ypg_is_verified"> <?= __('Gecontroleerd?', 'yard-page-guard') ?>
						</label>
					</div>
				<?php
                break;
            }

            case 'ypg_review_date': {
                ?>
						<div class="ypg-quick-edit-fields inline-edit-col">
							<label><?= __('Herzieningsdatum', 'yard-page-guard') ?></label>
							<input type="date" id="ypg-review-date" name="ypg_review_date" min="<?= date('Y-m-d') ?>">
						</div>
					</fieldset>
				<?php
                break;
            }
        }
    }

    public function manageCustomColumns(array $columns): array
    {
        $columns['ypg_post_content_owner'] = __('Eigenaar', 'yard-page-guard');
        $columns['ypg_is_verified'] = __('Status', 'yard-page-guard');
        $columns['ypg_review_date'] = __('Volgende herzieningsdatum', 'yard-page-guard');

        return $columns;
    }

    public function fillCustomColumns(string $column, int $postId): void
    {
        if ('ypg_post_content_owner' === $column) {
            $contentOwner = get_post_meta($postId, 'ypg_post_content_owner_name', true);

            if (false === $contentOwner || '' === $contentOwner) {
                echo __('Niet ingesteld', 'yard-page-guard');
            } else {
                echo $contentOwner . (get_post_meta($postId, 'ypg_post_content_owner_type', true) === ContentOwnerType::EXTERNAL ? ' (' . __('Extern', 'yard-page-guard') . ')' : '');
            }
        }

        $reviewDate = get_post_meta($postId, 'ypg_review_date', true);

        if ('ypg_is_verified' === $column) {
            $isVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
            echo $isVerified ? __('Gecontroleerd', 'yard-page-guard') : ($reviewDate && date('Y-m-d') > $reviewDate ? __('Achterstallig', 'yard-page-guard') : __('N.v.t.', 'yard-page-guard'));
        }

        if ('ypg_review_date' === $column) {
            echo $reviewDate ? "<span class='review-date-wrapper' data-date='$reviewDate'>{$this->formatDate($reviewDate)}</span>" : __('Niet ingesteld', 'yard-page-guard');
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
