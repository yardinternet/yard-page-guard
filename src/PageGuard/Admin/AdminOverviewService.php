<?php

namespace Yard\PageGuard\Admin;

use WP_Query;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;

class AdminOverviewService
{
    use Text;
    use Date;

    public function handleBulkEdit(): void
    {
        if (! current_user_can('manage_options')) {
            wp_die(__('U heeft geen toegang tot deze pagina.', 'yard-page-guard'));
        }

        check_admin_referer('ypg_bulk_update');

        $postIds = array_map('intval', $_POST['post_ids'] ?? []);
        $reviewDate = sanitize_text_field(! empty($_POST['ypg_review_date']) ? $_POST['ypg_review_date'] : 'none');
        $reviewStatus = sanitize_text_field(! empty($_POST['ypg_review_status']) ? $_POST['ypg_review_status'] : 'none');
        $contentOwner = sanitize_text_field(! empty($_POST['ypg_post_content_owner']) ? $_POST['ypg_post_content_owner'] : 'none');

        if ([] === $postIds) {
            wp_redirect(add_query_arg('ypg_updated', 'none', wp_get_referer()));
            exit;
        }

        if ('none' !== $contentOwner) {
            $contentOwner = $this->parseContentOwnerData($contentOwner);
        }

        foreach ($postIds as $postId) {
            $previouslyVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);
            $toBeVerified = (bool) intval($reviewStatus);

            if ('none' !== $reviewStatus) {
                update_post_meta($postId, 'ypg_is_verified', $toBeVerified);

                if ($toBeVerified) {
                    delete_post_meta($postId, 'ypg_review_mail_sent');
                }

                if ('none' === $reviewDate && $toBeVerified) {
                    $calculatedReviewDate = $this->computeReviewDate($postId, $toBeVerified, $previouslyVerified);
                    $calculatedReminderDate = $this->computeReminderDate($postId, $calculatedReviewDate, $toBeVerified, $previouslyVerified);

                    update_post_meta($postId, 'ypg_review_date', $calculatedReviewDate);
                    update_post_meta($postId, 'ypg_reminder_date', $calculatedReminderDate);
                }
            }

            if ('none' !== $reviewDate && $this->isValidDate($reviewDate)) {
                update_post_meta($postId, 'ypg_review_date', $reviewDate);

                $isVerified = (bool) get_post_meta($postId, 'ypg_is_verified', true);

                update_post_meta($postId, 'ypg_reminder_date', $this->computeReminderDate($postId, $reviewDate, $isVerified, $previouslyVerified));
            }

            if (is_array($contentOwner)) {
                update_post_meta($postId, 'ypg_post_content_owner_id', $contentOwner['id']);
                update_post_meta($postId, 'ypg_post_content_owner_name', $contentOwner['name']);
                update_post_meta($postId, 'ypg_post_content_owner_email', $contentOwner['email']);
                update_post_meta($postId, 'ypg_post_content_owner_type', $contentOwner['type']);
            }
        }

        wp_redirect(add_query_arg('ypg_updated', 'success', wp_get_referer()));
        exit;
    }

    public function handleOverviewQuery(): array
    {
        // Pagination
        $currentPage = max(1, intval($_GET['paged'] ?? 1));
        $itemsPerPage = max(1, intval($_GET['items_per_page'] ?? 20));

        // Filters
        $filterOwner = sanitize_text_field($_GET['ypg_filter_owner'] ?? 'none');
        $filterType = sanitize_text_field($_GET['ypg_filter_type'] ?? 'all');
        $filterStatus = sanitize_text_field($_GET['ypg_filter_status'] ?? 'all');

        $metaQuery = [
            [
                'key' => 'ypg_post_content_owner_email',
                'compare' => 'EXISTS',
            ],
        ];

        if ('none' !== $filterOwner) {
            $owner = $this->parseContentOwnerData($filterOwner);

            $metaQuery[] = [
                'key' => 'ypg_post_content_owner_id',
                'value' => $owner['id'],
                'compare' => '=',
            ];

            $metaQuery[] = [
                'key' => 'ypg_post_content_owner_type',
                'value' => $owner['type'],
                'compare' => '=',
            ];
        }

        $today = date('Y-m-d');

        if ('on_schedule' === $filterStatus) {
            $metaQuery[] = [
                'key' => 'ypg_review_date',
                'value' => $today,
                'compare' => '>=',
                'type' => 'DATE',
            ];
        } elseif ('overdue' === $filterStatus) {
            $metaQuery[] = [
                'key' => 'ypg_review_date',
                'value' => $today,
                'compare' => '<',
                'type' => 'DATE',
            ];
        }

        $query = new WP_Query([
            'post_type' => 'all' !== $filterType ? $filterType : apply_filters('yard::page-guard/post-types-to-use', ['page']),
            'posts_per_page' => $itemsPerPage,
            'paged' => $currentPage,
            'post_status' => apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']),
            'meta_key' => 'ypg_review_date',
            'orderby' => 'meta_value',
            'order' => 'ASC',
            'meta_query' => $metaQuery,
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
        ]);

        return [
            'items' => $query->posts,
            'items_per_page' => $itemsPerPage,
            'total_pages' => max(1, $query->max_num_pages),
            'total_items' => $query->found_posts,
            'current_page' => $currentPage,
            'filters' => [
                'owner' => $filterOwner,
                'type' => $filterType,
                'status' => $filterStatus,
            ],
            'filter_status' => $filterStatus,
        ];
    }
}
