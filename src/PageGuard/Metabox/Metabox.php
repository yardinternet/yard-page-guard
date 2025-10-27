<?php

namespace Yard\PageGuard\Metabox;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;

class Metabox
{
    public function addMetaboxes(): void
    {
        add_meta_box(
            'yard_page_guard_metaboxes',
            __('Houdbaarsheidsmodule', 'yard-page-guard'),
            [$this, 'displayMetaboxes'],
            apply_filters('yard::page-guard/post-types-to-use', ['page']),
            'side',
            'high'
        );
    }

    public function displayMetaboxes(WP_Post $post): void
    {
        // Retrieve current meta values.
        $contentOwnerId = get_post_meta($post->ID, 'ypg_post_content_owner_id', true);
        $currentOwnerType = get_post_meta($post->ID, 'ypg_post_content_owner_type', true);
        $isVerified = get_post_meta($post->ID, 'ypg_is_verified', true);
        $reviewDate = get_post_meta($post->ID, 'ypg_review_date', true);

        // Security nonce field.
        wp_nonce_field(basename(__FILE__), 'yard_page_guard_metaboxes_nonce');

        echo $this->displayMetaboxesHTML($contentOwnerId, $currentOwnerType, $isVerified, $reviewDate, $post->ID);
    }

    private function displayMetaboxesHTML(string $contentOwnerId, string $contentOwnerType, string $isVerified, string $reviewDate, int $postID): string
    {
        $html = sprintf('<p>%s</p>', __('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'));

        if ($this->currentUserHasAccess($postID)) {
            $html = $this->contentOwnerMetabox($html, $contentOwnerId, $contentOwnerType);
            $html = $this->isVerifiedMetabox($html, $isVerified);
            $html = $this->reviewDatedMetabox($html, $reviewDate);
        } else {
            $html .= sprintf('<p><b>%s</b></p>', __('U heeft geen toestemming om de houdbaarsheids module te bewerken.', 'yard-page-guard'));
        }

        return $html;
    }

    private function contentOwnerMetabox(string $html, string $contentOwnerId, string $contentOwnerType): string
    {
        $wpUsers = get_users([
            'capability' => 'edit_pages',
        ]);

        $externalUsers = get_terms([
            'taxonomy' => 'ypg_external_content_owner',
            'hide_empty' => false,
        ]);

        $html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_post_content_owner">%s:</label>', __('Inhoudseigenaar', 'yard-page-guard'));
        $html .= '<select name="ypg_post_content_owner" id="ypg_post_content_owner">';
        $html .= sprintf('<option value="">%s</option>', __('Maak een keuze', 'yard-page-guard'));

        foreach ($wpUsers as $user) {
            $name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;
            $selected = ($contentOwnerId == $user->ID && ContentOwnerType::USER === $contentOwnerType) ? ' selected="selected"' : '';

            $html .= sprintf(
                '<option value="%s|%s|%s|user"%s>%s</option>',
                esc_attr($user->ID),
                esc_attr($name),
                esc_attr($user->user_email),
                $selected,
                esc_html($user->display_name)
            );
        }

        if (! is_wp_error($externalUsers)) {
            foreach ($externalUsers as $user) {
                $email = get_term_meta($user->term_id, 'ypg_external_content_owner_email', true);
                $selected = ($contentOwnerId == $user->term_id && ContentOwnerType::EXTERNAL === $contentOwnerType) ? ' selected="selected"' : '';

                $html .= sprintf(
                    '<option value="%s|%s|%s|external"%s>%s</option>',
                    esc_attr($user->term_id),
                    esc_attr($user->name),
                    esc_attr($email),
                    $selected,
                    esc_html($user->name)
                );
            }
        }

        $html .= '</select></div>';

        return $html;
    }

    private function isVerifiedMetabox(string $html, string $isVerified): string
    {
        $html .= '<div class="ypg-metabox-wrapper"><label for="ypg_is_verified">';
        $html .= sprintf('<input type="checkbox" name="ypg_is_verified" id="ypg_is_verified" value="1"%s />', checked($isVerified, 1, false));
        $html .= sprintf(' %s</label></div>', __('Gecontroleerd?', 'yard-page-guard'));

        return $html;
    }

    private function reviewDatedMetabox(string $html, string $reviewDate): string
    {
        $html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_review_date">%s:</label>', __('Herinnering', 'yard-page-guard'));
        $html .= sprintf('<input type="date" name="ypg_review_date" id="ypg_review_date" value="%s" />', esc_attr($reviewDate));
        $html .= sprintf('<p>%s</p></div>', __('De herinnering wordt via de e-mail verstuurd op de ingestelde datum.', 'yard-page-guard'));

        return $html;
    }

    public function saveMetaboxValues(int $postID): void
    {
        if (! $this->shouldSave($postID) || ! isset($_POST['ypg_post_content_owner'])) {
            return;
        }

        $contentOwner = sanitize_text_field($_POST['ypg_post_content_owner']);

        // Expected format: id|name|email|type
        $ownerData = explode('|', $contentOwner);

        if (count($ownerData) !== 4) {
            throw new \InvalidArgumentException('Invalid content owner data format.');
        }

        $ownerId = $ownerData[0] ?? '';
        $ownerName = $ownerData[1] ?? '';
        $ownerEmail = $ownerData[2] ?? '';
        $ownerType = $ownerData[3] ?? '';

        update_post_meta($postID, 'ypg_post_content_owner_id', $ownerId);
        update_post_meta($postID, 'ypg_post_content_owner_name', $ownerName);
        update_post_meta($postID, 'ypg_post_content_owner_email', $ownerEmail);
        update_post_meta($postID, 'ypg_post_content_owner_type', $ownerType);

        // Sanitize and save the verified status
        $isVerified = (isset($_POST['ypg_is_verified']) ? 1 : 0);
        update_post_meta($postID, 'ypg_is_verified', $isVerified);

        // Sanitize and save the review date
        $reviewDate = (isset($_POST['ypg_review_date']) ? sanitize_text_field($_POST['ypg_review_date']) : '');
        update_post_meta($postID, 'ypg_review_date', $reviewDate);
    }

    private function shouldSave(int $postID): bool
    {
        if (! isset($_POST['yard_page_guard_metaboxes_nonce']) || ! wp_verify_nonce($_POST['yard_page_guard_metaboxes_nonce'], basename(__FILE__))) {
            return false;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return false;
        }

        if (! in_array($_POST['post_type'], apply_filters('yard::page-guard/post-types-to-use', ['page']))) {
            return false;
        }

        if (! current_user_can('edit_pages', $postID)) {
            return false;
        }

        if (! $this->currentUserHasAccess($postID)) {
            return false;
        }

        return true;
    }

    private function currentUserHasAccess(int $postID): bool
    {
        $post = get_post($postID);
        $contentOwnerId = get_post_meta($postID, 'ypg_post_content_owner_id', true) ?: '';
        $contentOwnerType = get_post_meta($postID, 'ypg_post_content_owner_type', true);
        $currentUser = wp_get_current_user();

        // Regardless of content owner type: newly created posts, administrators, current user is author or no content owner set
        if (0 === strlen($post->post_name) || in_array('administrator', $currentUser->roles) || '' === $contentOwnerId || $currentUser->ID === $post->post_author) {
            return true;
        }

        return (int) $contentOwnerId === $currentUser->ID && ContentOwnerType::USER === $contentOwnerType;
    }
}
