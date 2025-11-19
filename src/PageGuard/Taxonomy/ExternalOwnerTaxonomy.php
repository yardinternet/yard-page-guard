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
            'show_in_menu' => false,
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

    public function addUpdateEmailFormField(WP_Term $user): void
    {
        $email = (string) (get_term_meta($user->term_id, 'ypg_external_content_owner_email', true) ?: '');
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
					   required
                       value="<?= esc_attr($email); ?>" />
                <p class="description"><?php _e('Voer het e-mailadres van de externe inhoudseigenaar in.', 'yard-page-guard'); ?></p>
            </td>
        </tr>
        <?php
    }

    public function handleSaveMeta(int $termId): void
    {
        if (! isset($_POST['ypg_external_content_owner_email'])) {
            return;
        }

        $email = sanitize_email($_POST['ypg_external_content_owner_email']);

        if ('' === $email || ! is_email($email)) {
            delete_term_meta($termId, 'ypg_external_content_owner_email');

            return;
        }

        update_term_meta($termId, 'ypg_external_content_owner_email', $email);
    }
}
