<?php

namespace Yard\PageGuard\Taxonomy;

use WP_Term;

class ExternalOwnerTaxonomy
{
    public function register(): void
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

    public function addInsertEmailFormField(): void
    {
        ?>
        <div class="form-field">
            <label for="ypg_external_content_owner_email"><?php _e('E-mailadres', 'yard-page-guard'); ?></label>
            <input type="email" name="ypg_external_content_owner_email" id="ypg_external_content_owner_email" />
            <p><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
        </div>
        <?php
    }

    public function addUpdateEmailFormField(WP_Term $term): void
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
					   size="40"
                       value="<?= esc_attr($email); ?>" />
                <p class="description"><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
            </td>
        </tr>
        <?php
    }

    public function handleSaveMeta(int $termId): void
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
