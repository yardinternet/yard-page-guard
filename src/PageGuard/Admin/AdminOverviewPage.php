<?php

namespace Yard\PageGuard\Admin;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;

class AdminOverviewPage
{
    use Text;
    use Date;

    private AdminOverviewService $service;

    public function __construct()
    {
        $this->service = new AdminOverviewService();
    }

    public function init(): void
    {
        add_action('admin_menu', [$this, 'addOverviewPage']);
        add_action('admin_post_ypg_bulk_update', [$this->service, 'handleBulkEdit']);
    }

    public function addOverviewPage(): void
    {
        add_menu_page(
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            __('Houdbaarheids Overzicht', 'yard-page-guard'),
            'manage_options',
            'page-guard-overview',
            [$this, 'renderOverview'],
            'dashicons-visibility',
            20
        );
    }

    public function renderOverview(): void
    {
        $query = $this->service->handleOverviewQuery();
        $wpUsers = get_users(['capability' => 'edit_pages']);
        $externalUsers = get_terms(['taxonomy' => 'ypg_external_content_owner', 'hide_empty' => false]);
        ?>
    <div class="wrap">
        <h1><?= __('Houdbaarheids Overzicht', 'yard-page-guard'); ?></h1>

        <?php if ('success' === ($_GET['ypg_updated'] ?? null)): ?>
            <div class="notice notice-success"><p><?= __('Bulk update uitgevoerd.', 'yard-page-guard'); ?></p></div>
        <?php elseif ('none' === ($_GET['ypg_updated'] ?? null)): ?>
            <div class="notice notice-warning"><p><?= __('Geen items geselecteerd.', 'yard-page-guard'); ?></p></div>
        <?php endif; ?>

		<form method="get" class="ypg-filters">
			<input type="hidden" name="page" value="page-guard-overview" />

			<label for="items-per-page"><?= __('Items per pagina:', 'yard-page-guard'); ?></label>
            <select id="items-per-page" name="items_per_page" onchange="this.form.submit()">
                <?php foreach ([20, 50, 100] as $option): ?>
                    <option value="<?= $option ?>" <?= selected($option, $query['items_per_page'], false) ?>><?= $option ?></option>
                <?php endforeach; ?>
            </select>

			<label for="filter-owner"><?= __('Eigenaar:', 'yard-page-guard') ?></label>
			<select name="ypg_filter_owner" id="filter-owner">
				<option value="none"><?= __('Alle', 'yard-page-guard') ?></option>

				<?php foreach ($wpUsers as $user):
				    $name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;
				    $value = "{$user->ID}|{$name}|{$user->user_email}|user";
				    ?>
					<option value="<?= esc_attr($value) ?>" <?= selected($value, $query['filters']['owner'], false) ?>>
						<?= esc_html($user->display_name) ?>
					</option>
				<?php endforeach; ?>

				<?php foreach ($externalUsers as $user):
				    $email = get_term_meta($user->term_id, 'ypg_external_content_owner_email', true);
				    $value = "{$user->term_id}|{$user->name}|{$email}|external";
				    ?>
					<option value="<?= esc_attr($value) ?>" <?= selected($value, $query['filters']['owner'], false) ?>>
						<?= esc_html($user->name) ?> (<?= __('Extern', 'yard-page-guard') ?>)
					</option>
				<?php endforeach; ?>
			</select>

			<label for="filter-type"><?= __('Type', 'yard-page-guard') ?>:</label>
			<select name="ypg_filter_type" id="filter-type">
				<option value="all" <?= selected('all', $query['filters']['type'], false) ?>><?= __('Alle', 'yard-page-guard') ?></option>

				<?php foreach (apply_filters('yard::page-guard/post-types-to-use', ['page']) as $postType): ?>
					<option value="<?= $postType ?>" <?= selected($postType, $query['filters']['type'], false) ?>><?= get_post_type_labels(get_post_type_object($postType))->singular_name ?></option>
				<?php endforeach; ?>
			</select>

			<label for="filter-status"><?= __('Status', 'yard-page-guard') ?>:</label>
			<select name="ypg_filter_status" id="filter-status">
				<option value="all" <?= selected('all', $query['filters']['status'], false) ?>><?= __('Alle', 'yard-page-guard') ?></option>
				<option value="on_schedule" <?= selected('on_schedule', $query['filters']['status'], false) ?>><?= __('Op schema', 'yard-page-guard') ?></option>
				<option value="overdue" <?= selected('overdue', $query['filters']['status'], false) ?>><?= __('Achterstallig', 'yard-page-guard') ?></option>
			</select>

			<button type="submit" class="button"><?= __('Filteren', 'yard-page-guard') ?></button>
		</form>

        <form method="post" action="<?= admin_url('admin-post.php') ?>">
            <?php wp_nonce_field('ypg_bulk_update'); ?>
            <input type="hidden" name="action" value="ypg_bulk_update">

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th class="ypg-select-all-th"><input type="checkbox" id="ypg-select-all"></th>
                        <th><?= __('Pagina', 'yard-page-guard'); ?></th>
                        <th><?= __('Type', 'yard-page-guard'); ?></th>
                        <th><?= __('Eigenaar', 'yard-page-guard'); ?></th>
                        <th><?= __('Volgende herzieningsdatum', 'yard-page-guard'); ?></th>
                        <th><?= __('Gecontroleerd?', 'yard-page-guard'); ?></th>
                        <th><?= __('Status', 'yard-page-guard'); ?></th>
                    </tr>
                </thead>
                <tbody>
                <?php if ([] === $query['items']): ?>
                    <tr><td colspan="5"><?= __('Geen resultaten gevonden.', 'yard-page-guard'); ?></td></tr>
                <?php else: ?>
                    <?php foreach ($query['items'] as $reviewItem):
                        $contentOwnerType = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_type', true);
                        $contentOwnerId = get_post_meta($reviewItem->ID, 'ypg_post_content_owner_id', true);
                        $reviewDate = get_post_meta($reviewItem->ID, 'ypg_review_date', true);
                        $formattedReviewDate = $this->formatDate($reviewDate);
                        $isVerified = (bool) get_post_meta($reviewItem->ID, 'ypg_is_verified', true) ? __('Ja', 'yard-page-guard') : __('Nee', 'yard-page-guard');
                        $reviewStatus = __('Op schema', 'yard-page-guard');

                        if ($reviewDate && date('Y-m-d') > $reviewDate) {
                            $reviewStatus = __('Achterstallig', 'yard-page-guard');
                        }

                        $contentOwner = (ContentOwnerType::EXTERNAL === $contentOwnerType)
                            ? get_term($contentOwnerId, 'ypg_external_content_owner')
                            : get_user_by('ID', $contentOwnerId);
                        ?>
                        <tr>
                            <td><input type="checkbox" name="post_ids[]" value="<?= $reviewItem->ID ?>"></td>
                            <td><a href="<?= get_edit_post_link($reviewItem->ID) ?>"><?= esc_html($reviewItem->post_title) ?></a></td>
                            <td><?= get_post_type_labels(get_post_type_object(get_post_type($reviewItem->ID)))->singular_name; ?></td>
                            <td>
                                <?php if ($contentOwner): ?>
                                    <a href="<?= ContentOwnerType::EXTERNAL === $contentOwnerType ? get_edit_term_link($contentOwner->term_id) : get_edit_user_link($contentOwner->ID) ?>">
                                        <?= esc_html(ContentOwnerType::EXTERNAL === $contentOwnerType ? $contentOwner->name : $contentOwner->display_name) ?>
                                    </a>
                                <?php endif; ?>
                            </td>
                            <td><?= esc_html($formattedReviewDate) ?></td>
                            <td><?= esc_html($isVerified) ?></td>
                            <td><?= esc_html($reviewStatus) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>

			<div class="ypg-bulk-action-bar-wrapper" aria-hidden="true">
				<div class="ypg-bulk-action-bar">
					<div class="ypg-bulk-review-option-wrapper">
						<label for="ypg-bulk-review-date"><?= __('Nieuwe herzieningsdatum:', 'yard-page-guard'); ?></label>
						<input type="date" min="<?= date('Y-m-d') ?>" name="ypg_review_date" id="ypg-bulk-review-date" />
					</div>

					<div class="ypg-bulk-review-option-wrapper">
						<label for="ypg-post-content-owner"><?= __('Eigenaar', 'yard-page-guard') ?>:</label>

						<select name="ypg_post_content_owner" id="ypg-post-content-owner">
							<option value="none"><?= __('Behouden', 'yard-page-guard') ?></option>
							<?php foreach ($wpUsers as $user):
							    $name = $user->first_name ? $user->first_name . ' ' . $user->last_name : $user->display_name;

							    printf(
							        '<option value="%s|%s|%s|user">%s</option>',
							        esc_attr($user->ID),
							        esc_attr($name),
							        esc_attr($user->user_email),
							        esc_html($user->display_name)
							    );
							    ?>
							<?php endforeach; ?>

							<?php foreach ($externalUsers as $user):
							    $email = get_term_meta($user->term_id, 'ypg_external_content_owner_email', true);

							    printf(
							        '<option value="%s|%s|%s|external">%s (%s)</option>',
							        esc_attr($user->term_id),
							        esc_attr($user->name),
							        esc_attr($email),
							        esc_html($user->name),
							        __('Extern', 'yard-page-guard')
							    );
							    ?>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="ypg-bulk-review-option-wrapper">
						<label for="ypg-review-status"><?= __('Gecontroleerd?', 'yard-page-guard') ?>:</label>

						<select name="ypg_review_status" id="ypg-review-status">
							<option value="none"><?= __('Behouden', 'yard-page-guard') ?></option>
							<option value="1"><?= __('Ja', 'yard-page-guard') ?></option>
							<option value="0"><?= __('Nee', 'yard-page-guard') ?></option>
						</select>
					</div>

					<button type="submit" class="button button-primary"><?= __('Toepassen', 'yard-page-guard'); ?></button>
				</div>
			</div>

            <?php if (1 < $query['total_pages']): ?>
                <div class="ypg-pagination">
				<?php
                $baseUrl = esc_url(remove_query_arg(['paged', 'items_per_page'], $_SERVER['REQUEST_URI'])) . '%_%';

                echo paginate_links([
                    'base' => $baseUrl,
                    'format' => '&paged=%#%',
                    'current' => $query['current_page'],
                    'total' => $query['total_pages'],
                    'prev_text' => '«',
                    'next_text' => '»',
                ]);
                ?>
                    <span class="total-pages"><?= sprintf(__('Totaal aantal items: %d', 'yard-page-guard'), $query['total_items']); ?></span>
                </div>
            <?php endif; ?>
        </form>
    </div>
    <?php
    }
}
