<?php
/**
 * @uses Yard\PageGuard\Traits\Text
 */
?>

<div class="wrap">
	<h1><?= __('Houdbaarheidsmodule Instellingen', 'yard-page-guard') ?></h1>
	<form method="post" action="options.php">
		<?php settings_fields('ypg_settings'); ?>
		<?php do_settings_sections('ypg_settings'); ?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><?= __('Afzend naam', 'yard-page-guard') ?></th>
				<td>
					<input type="text" name="ypg_email_from_name" value="<?= esc_attr(get_option('ypg_email_from_name', get_bloginfo('name'))); ?>" />
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Afzend emailadres', 'yard-page-guard') ?></th>
				<td>
					<input type="email" name="ypg_email_from_address" value="<?= esc_attr(get_option('ypg_email_from_address', 'houdbaarheid@' . $_SERVER['HTTP_HOST'])); ?>" />
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Herinneringmail BCC emailadres', 'yard-page-guard') ?></th>
				<td>
					<input type="email" name="ypg_reminder_email_bcc" value="<?= esc_attr(get_option('ypg_reminder_email_bcc', '')); ?>" />
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Herzieningsperiode', 'yard-page-guard') ?></th>
				<td class="d-flex">
					<input type="number" name="ypg_review_time_period" value="<?= esc_attr(get_option('ypg_review_time_period', 2)); ?>" min="1" />
					<select name="ypg_review_time_unit">
						<?php
						$selected_unit = get_option('ypg_review_time_unit', 'weeks');
foreach ($this->getUnitOptions() as $key => $label) {
	echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
}
?>
					</select>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Herinneringsperiode', 'yard-page-guard') ?></th>
				<td class="d-flex">
					<input type="number" name="ypg_reminder_time_period" value="<?= esc_attr(get_option('ypg_reminder_time_period', 1)); ?>" min="1" />
					<select name="ypg_reminder_time_unit">
						<?php
$selected_unit = get_option('ypg_reminder_time_unit', 'weeks');
foreach ($this->getUnitOptions() as $key => $label) {
	echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
}
?>
					</select>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Herzieningsmail inhoud', 'yard-page-guard') ?></th>
				<td>
					<?php
					$notificationContent = get_option('ypg_review_email_content', '');
wp_editor($notificationContent, 'ypg_review_email_content', [
	'textarea_name' => 'ypg_review_email_content',
	'textarea_rows' => 8,
	'media_buttons' => false,
	'teeny' => true,
]);
?>
					<div class="description">
						<p><?= __('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard') ?></p>
						<ol>
							<li><?= __('Naam van inhoudseigenaar', 'yard-page-guard') ?></li>
							<li><?= __('Lijst van items die gecontroleerd moeten worden', 'yard-page-guard') ?></li>
						</ol>
					</div>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?= __('Herinneringsmail inhoud', 'yard-page-guard') ?></th>
				<td>
					<?php
$reminderContent = get_option('ypg_reminder_email_content', '');
wp_editor($reminderContent, 'ypg_reminder_email_content', [
	'textarea_name' => 'ypg_reminder_email_content',
	'textarea_rows' => 8,
	'media_buttons' => false,
	'teeny' => true,
]);
?>
					<div class="description">
						<p><?= __('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard') ?></p>
						<ol>
							<li><?= __('Naam van inhoudseigenaar', 'yard-page-guard') ?></li>
							<li><?= __('Lijst van achterlopende items', 'yard-page-guard') ?></li>
						</ol>
					</div>
				</td>
			</tr>
		</table>
		<?php submit_button(); ?>
	</form>
</div>
