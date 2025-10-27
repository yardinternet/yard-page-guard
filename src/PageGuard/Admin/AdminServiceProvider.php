<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use WP_Term;
use Yard\PageGuard\Foundation\ServiceProvider;
use Yard\PageGuard\Support\Traits\Date;

class AdminServiceProvider extends ServiceProvider
{
    use Date;

    public function register(): void
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorScripts']);

        add_action('init', function () {
            foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType) {
                add_filter("manage_{$postType}_posts_columns", [$this, 'manageCustomColumns']);
                add_action("manage_{$postType}_posts_custom_column", [$this, 'fillCustomColumns'], 10, 2);
                add_filter("manage_edit-{$postType}_sortable_columns", [$this, 'makeCustomColumnsSortable']);
            }

            $this->registerExternalContentOwnerTaxonomy();
            add_action('ypg_external_content_owner_add_form_fields', [$this, 'addExternalContentOwnerEmailFormField']);
            add_action('ypg_external_content_owner_edit_form_fields', [$this, 'editExternalContentOwnerEmailFormField']);
            add_action('created_ypg_external_content_owner', [$this, 'saveExternalContentOwnerMeta'], 10, 1);
            add_action('edited_ypg_external_content_owner', [$this, 'saveExternalContentOwnerMeta'], 10, 1);
        });

        add_action('pre_get_posts', [$this, 'sortCustomColumns']);
    }

    public function enqueueEditorScripts(): void
    {
        $path = $this->plugin->resourcePath('editor.asset.php');
        $scriptAsset = file_exists($path) ? require $path : ['dependencies' => [], 'version' => round(microtime(true))];

        wp_enqueue_style(
            'ypg-editor-styles',
            $this->plugin->resourceUrl('style-editor.css'),
            [],
            $scriptAsset['version']
        );
    }

    public function manageCustomColumns(array $columns): array
    {
        $columns['ypg_post_content_owner'] = __('Inhoudseigenaar', 'yard-page-guard');
        $columns['ypg_is_verified'] = __('Gecontroleerd?', 'yard-page-guard');
        $columns['ypg_review_date'] = __('Herinnering', 'yard-page-guard');

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

    public function registerExternalContentOwnerTaxonomy(): void
    {
        register_taxonomy('ypg_external_content_owner', apply_filters('yard::page-guard/post-types-to-use', ['page']), [
            'label' => __('Externe inhoudseigenaren', 'yard-page-guard'),
            'public' => false,
            'show_ui' => true,
            'show_in_quick_edit' => false,
            'show_admin_column' => false,
            'hierarchical' => false,
            'rewrite' => [
                'slug' => 'ypg-external-content-owner',
                'with_front' => false,
            ],
            'capabilities' => [
                'manage_terms' => 'manage_categories',
                'edit_terms' => 'manage_categories',
                'delete_terms' => 'manage_categories',
                'assign_terms' => 'edit_pages',
            ],
        ]);
    }

    public function addExternalContentOwnerEmailFormField(): void
    {
        ?>
        <div class="ypg-form-field">
            <label for="ypg_external_content_owner_email"><?php _e('E-mailadres', 'yard-page-guard'); ?></label>
            <input type="email" name="ypg_external_content_owner_email" id="ypg_external_content_owner_email" />
            <p><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
        </div>
        <?php
    }

    public function editExternalContentOwnerEmailFormField(WP_Term $term): void
    {
        $email = get_term_meta($term->term_id, 'ypg_external_content_owner_email', true);
        ?>
        <tr class="form-field">
            <th scope="row">
                <label for="ypg_external_content_owner_email"><?php _e('E-mailadres', 'yard-page-guard'); ?></label>
            </th>
            <td>
                <input type="email" 
                       name="ypg_external_content_owner_email" 
                       id="ypg_external_content_owner_email" 
                       value="<?php echo esc_attr($email); ?>" />
                <p class="description"><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
            </td>
        </tr>
        <?php
    }

    public function saveExternalContentOwnerMeta(int $termId): void
    {
        if (isset($_POST['ypg_external_content_owner_email'])) {
            $email = sanitize_email($_POST['ypg_external_content_owner_email']);
            
            if ('' !== $email) {
                update_term_meta($termId, 'ypg_external_content_owner_email', $email);
            } else {
                delete_term_meta($termId, 'ypg_external_content_owner_email');
            }
        }
    }
}
