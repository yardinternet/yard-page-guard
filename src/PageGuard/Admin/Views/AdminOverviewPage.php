<?php

use Yard\PageGuard\Admin\Services\AdminOverviewService;

$service = new AdminOverviewService();
$query = $service->handleOverviewQuery();
?>

<div class="wrap">
	<h1><?= __('Houdbaarheids Overzicht', 'yard-page-guard'); ?></h1>

	<?php if ('success' === ($_GET['ypg_updated'] ?? null)): ?>
		<div class="notice notice-success">
			<p><?= __('Bulk update uitgevoerd.', 'yard-page-guard'); ?></p>
		</div>
	<?php elseif ('none' === ($_GET['ypg_updated'] ?? null)): ?>
		<div class="notice notice-warning">
			<p><?= __('Geen items geselecteerd.', 'yard-page-guard'); ?></p>
		</div>
	<?php endif; ?>

	<form method="get" class="ypg-filters">
		<input type="hidden" name="page" value="ypg-overview" />

		<label for="items-per-page"><?= __('Items per pagina:', 'yard-page-guard'); ?></label>
		<select id="items-per-page" name="items_per_page" onchange="this.form.submit()">
			<?php foreach ([20, 50, 100] as $option): ?>
				<option value="<?= $option ?>" <?= selected($option, $query['items_per_page'], false) ?>><?= $option ?></option>
			<?php endforeach; ?>
		</select>

		<label for="filter-owner"><?= __('Eigenaar:', 'yard-page-guard') ?></label>
		<select name="ypg_filter_owner" id="filter-owner">
			<option value="none"><?= __('Alle', 'yard-page-guard') ?></option>
			<?php $service->buildUserList($query['filters']['owner']) ?>
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
			<option value="on_schedule" <?= selected('on_schedule', $query['filters']['status'], false) ?>><?= __('Gecontroleerd', 'yard-page-guard') ?></option>
			<option value="overdue" <?= selected('overdue', $query['filters']['status'], false) ?>><?= __('Achterstallig', 'yard-page-guard') ?></option>
		</select>

		<button type="submit" class="button"><?= __('Filteren', 'yard-page-guard') ?></button>
	</form>

	<form method="post" action="<?= admin_url('admin-post.php') ?>">
		<?php wp_nonce_field('ypg_bulk_update'); ?>
		<input type="hidden" name="action" value="ypg_bulk_update">

		<table class="ypg-overview-table wp-list-table widefat fixed striped">
			<thead>
				<tr>
					<th class="ypg-select-all-th"><input type="checkbox" id="ypg-select-all"></th>
					<th><?= __('Pagina', 'yard-page-guard'); ?></th>
					<th><?= __('Type', 'yard-page-guard'); ?></th>
					<th><?= __('Eigenaar', 'yard-page-guard'); ?></th>
					<th><?= __('Laatst gecontroleerd op', 'yard-page-guard'); ?></th>
					<th><?= __('Laatste herinneringmail', 'yard-page-guard'); ?></th>
					<th><?= __('Volgende herzieningsdatum', 'yard-page-guard'); ?></th>
					<th><?= __('Status', 'yard-page-guard'); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ([] === $query['items']): ?>
					<tr>
						<td colspan="8"><?= __('Geen resultaten gevonden.', 'yard-page-guard'); ?></td>
					</tr>
				<?php else: $service->buildTableRows($query['items']) ?>
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
						<option value="keep"><?= __('Behouden', 'yard-page-guard') ?></option>
						<option value="none"><?= __('Geen (weghalen)', 'yard-page-guard') ?></option>
						<?php $service->buildUserList(); ?>
					</select>
				</div>

				<div class="ypg-bulk-review-option-wrapper">
					<label for="ypg-review-status"><?= __('Gecontroleerd?', 'yard-page-guard') ?>:</label>

					<select name="ypg_review_status" id="ypg-review-status">
						<option value="keep"><?= __('Behouden', 'yard-page-guard') ?></option>
						<option value="1"><?= __('Ja', 'yard-page-guard') ?></option>
						<option value="0"><?= __('Nee', 'yard-page-guard') ?></option>
					</select>
				</div>

				<button type="submit" class="button button-primary"><?= __('Toepassen', 'yard-page-guard'); ?></button>
			</div>
		</div>

		<?php if (1 < $query['total_pages']): ?>
			<div class="ypg-pagination">
				<?= $service->buildPagination($query) ?>
				<span class="total-pages"><?= sprintf(__('Totaal aantal items: %d', 'yard-page-guard'), $query['total_items']); ?></span>
			</div>
		<?php endif; ?>
	</form>
</div>
