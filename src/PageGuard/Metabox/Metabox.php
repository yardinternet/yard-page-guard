<?php

namespace Yard\PageGuard\Metabox;

use WP_Post;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Date;

class Metabox
{
    use Date;

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
        $contentOwnerId = get_post_meta($post->ID, 'ypg_post_content_owner_id', true);
        $currentOwnerType = get_post_meta($post->ID, 'ypg_post_content_owner_type', true);
        $isVerified = (bool) get_post_meta($post->ID, 'ypg_is_verified', true);
        $reviewDate = get_post_meta($post->ID, 'ypg_review_date', true);
        $reminderDate = get_post_meta($post->ID, 'ypg_reminder_date', true);

        wp_nonce_field(basename(__FILE__), 'yard_page_guard_metaboxes_nonce');

        echo $this->displayMetaboxesHTML($contentOwnerId, $currentOwnerType, $isVerified, $reviewDate, $reminderDate, $post->ID);
    }

    private function displayMetaboxesHTML(string $contentOwnerId, string $contentOwnerType, string $isVerified, string $reviewDate, string $reminderDate, int $postID): string
    {
        $html = sprintf('<p>%s</p>', __('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'));

        if ($this->currentUserHasAccess($postID)) {
            $html = $this->contentOwnerMetabox($html, $contentOwnerId, $contentOwnerType);
            $html = $this->isVerifiedMetabox($html, $isVerified);
            $html = $this->reviewDateMetabox($html, $reviewDate, $isVerified);
            $html = $this->reminderDateMetabox($html, $reminderDate);
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
        $html .= sprintf('<option value="none">%s</option>', __('Maak een keuze', 'yard-page-guard'));

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
                    '<option value="%s|%s|%s|external"%s>%s (%s)</option>',
                    esc_attr($user->term_id),
                    esc_attr($user->name),
                    esc_attr($email),
                    $selected,
                    esc_html($user->name),
                    __('Extern', 'yard-page-guard')
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

    private function reviewDateMetabox(string $html, string $reviewDate, bool $isVerified): string
    {
        $html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_review_date">%s:</label>', $isVerified ? __('Volgende controle datum', 'yard-page-guard') : __('Controle datum', 'yard-page-guard'));
        $html .= sprintf('<input type="date" name="ypg_review_date" id="ypg_review_date" value="%s" min="%s" />', esc_attr($reviewDate), esc_attr(date('Y-m-d')));

        if ($isVerified) {
            $html .= sprintf('<p>%s</p></div>', __('Het vinkje wordt op de datum hierboven weer weggehaald voor een nieuwe controle. Er wordt dan ook een mail verstuurd naar de eigenaar.', 'yard-page-guard'));
        } else {
            $html .= sprintf('<p>%s</p></div>', __('De controle notificatie wordt (of is al) via de e-mail verstuurd op de ingestelde datum.', 'yard-page-guard'));
        }

        return $html;
    }

    private function reminderDateMetabox(string $html, string $reminderDate): string
    {
        $html .= sprintf('<div class="ypg-metabox-wrapper flex-column"><label for="ypg_reminder_date">%s:</label>', __('Volgende herinnering datum', 'yard-page-guard'));
        $html .= sprintf('<input type="date" name="ypg_reminder_date" id="ypg_reminder_date" value="%s" min="%s" />', esc_attr($reminderDate), esc_attr(date('Y-m-d')));
        $html .= sprintf('<p>%s</p></div>', __('De herinnering wordt via de e-mail verstuurd op de ingestelde datum.', 'yard-page-guard'));

        return $html;
    }

    public function saveMetaboxValues(int $postID): void
    {
        if (! $this->shouldSave($postID) || ! isset($_POST['ypg_post_content_owner'])) {
            return;
        }

        $contentOwner = sanitize_text_field($_POST['ypg_post_content_owner']);

        if ('none' === $contentOwner) {
            $this->clearOwnerMeta($postID);

            return;
        }

        $ownerData = $this->parseOwnerData($contentOwner);
        $this->updateOwnerMeta($postID, $ownerData);

        $wasPreviouslyVerified = (bool) get_post_meta($postID, 'ypg_is_verified', true);
        $toBeVerified = isset($_POST['ypg_is_verified']);

        // Remove mail sent status if verified (date will update) OR post is manually being unverified
        if ($toBeVerified || ! $toBeVerified && $wasPreviouslyVerified) {
            delete_post_meta($postID, 'ypg_review_mail_sent');
        }

        $reviewDate = $this->computeReviewDate($postID, $toBeVerified, $wasPreviouslyVerified);
        $reminderDate = $this->computeReminderDate($postID, $reviewDate, $toBeVerified, $wasPreviouslyVerified);

        $this->updateVerificationMeta($postID, $toBeVerified, $reviewDate, $reminderDate);

        do_action('ypg_site_cron');
    }

    private function clearOwnerMeta(int $postID): void
    {
        $keys = [
            'ypg_post_content_owner_id',
            'ypg_post_content_owner_name',
            'ypg_post_content_owner_email',
            'ypg_post_content_owner_type',
            'ypg_review_date',
            'ypg_reminder_date',
        ];

        foreach ($keys as $key) {
            delete_post_meta($postID, $key);
        }
    }

    /**
     * @throws \InvalidArgumentException
     */
    private function parseOwnerData(string $contentOwner): array
    {
        $ownerData = explode('|', $contentOwner);

        if (count($ownerData) !== 4) {
            throw new \InvalidArgumentException('Invalid content owner data format.');
        }

        return [
            'id' => $ownerData[0] ?? '',
            'name' => $ownerData[1] ?? '',
            'email' => $ownerData[2] ?? '',
            'type' => $ownerData[3] ?? '',
        ];
    }


    private function updateOwnerMeta(int $postID, array $ownerData): void
    {
        update_post_meta($postID, 'ypg_post_content_owner_id', $ownerData['id']);
        update_post_meta($postID, 'ypg_post_content_owner_name', $ownerData['name']);
        update_post_meta($postID, 'ypg_post_content_owner_email', $ownerData['email']);
        update_post_meta($postID, 'ypg_post_content_owner_type', $ownerData['type']);
    }

    private function computeReviewDate(int $postID, bool $toBeVerified, bool $wasPreviouslyVerified): string
    {
        $currentReviewDate = get_post_meta($postID, 'ypg_review_date', true);

        return $this->computeDateMeta(
            'ypg_review_date',
            $currentReviewDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            'ypg_review_time_period',
            'ypg_review_time_unit',
        );
    }

    private function computeReminderDate(int $postID, string $reviewDate, bool $toBeVerified, bool $wasPreviouslyVerified): string
    {
        $currentReminderDate = get_post_meta($postID, 'ypg_reminder_date', true);

        $reminderDate = $this->computeDateMeta(
            'ypg_reminder_date',
            $currentReminderDate,
            $toBeVerified,
            $wasPreviouslyVerified,
            'ypg_reminder_time_period',
            'ypg_reminder_time_unit',
            $reviewDate
        );

        if (strtotime($reminderDate) <= strtotime($reviewDate)) {
            $reminderDate = $this->setReminderAfterReview($reviewDate);
        }

        return $reminderDate;
    }

    private function updateVerificationMeta(int $postID, bool $isVerified, string $reviewDate, string $reminderDate): void
    {
        update_post_meta($postID, 'ypg_is_verified', $isVerified);
        update_post_meta($postID, 'ypg_review_date', $reviewDate);
        update_post_meta($postID, 'ypg_reminder_date', $reminderDate);
    }

    private function shouldSave(int $postID): bool
    {
        if (! isset($_POST['yard_page_guard_metaboxes_nonce']) || ! wp_verify_nonce($_POST['yard_page_guard_metaboxes_nonce'], basename(__FILE__))) {
            if (! wp_verify_nonce($_POST[ '_inline_edit' ], 'inlineeditnonce')) {
                if (! wp_verify_nonce($_REQUEST[ '_wpnonce' ], 'bulk-posts')) {
                    return false;
                } else {
                    error_log(print_r($_REQUEST, true));
                }
            }
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
