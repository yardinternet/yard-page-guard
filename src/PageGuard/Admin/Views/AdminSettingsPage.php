<?php
/**
 * @uses Yard\PageGuard\Traits\Text
 */
$host = (string) wp_parse_url(home_url(), PHP_URL_HOST);
$hostParts = explode('.', $host);
$baseHost = count($hostParts) > 2 ? implode('.', array_slice($hostParts, -2)) : $host;
$defaultFromAddress = 'houdbaarheid@' . $baseHost;

$renderEditor = static function (string $name, string $value, string $variables = '', int $rows = 10, string $features = ''): void {
	// wpautop normalises legacy plain-text content with bare newlines into the
	// `<p>` / `<br>` HTML the editor can parse back into block nodes — without
	// this stored options that pre-date the rich editor collapse onto one line.
	$html = wpautop($value);

	$dataAttrs = '';

	if ('' !== $variables) {
		$dataAttrs .= ' data-variables="' . esc_attr($variables) . '"';
	}
	if ('' !== $features) {
		$dataAttrs .= ' data-features="' . esc_attr($features) . '"';
	}

	printf(
		'<div class="ypg-rte" data-ypg-editor%s><textarea id="%s" name="%s" rows="%d">%s</textarea></div>',
		$dataAttrs,
		esc_attr($name),
		esc_attr($name),
		$rows,
		esc_textarea($html)
	);
};
?>

<div class="wrap ypg-settings-page">
	<h1 class="ypg-settings-title"><?= esc_html(__('Inhoudseigenarenmodule Instellingen', 'yard-page-guard')) ?></h1>

	<form method="post" action="options.php" class="ypg-settings-form">
		<?php settings_fields('ypg_settings'); ?>
		<?php do_settings_sections('ypg_settings'); ?>

		<?php
			$cronLastRun = \Yard\PageGuard\WPCron\WPCronServiceProvider::lastRun();
$cronNextRun = \Yard\PageGuard\WPCron\WPCronServiceProvider::nextRun();
$cronDateTimeFormat = trim(get_option('date_format', 'd F Y') . ' ' . get_option('time_format', 'H:i'));
?>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Geplande controle', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Status van de dagelijkse controle die de herzienings- en herinneringsmails verstuurt.', 'yard-page-guard')) ?>
					<a href="<?= esc_url(admin_url('edit.php?post_type=' . \Yard\PageGuard\CronLog\CronLog::POST_TYPE)) ?>"><?= esc_html(__('Bekijk het controle log', 'yard-page-guard')) ?></a>
				</p>
			</header>
			<div class="ypg-settings-grid">
				<div class="ypg-cron-stat">
					<span class="ypg-cron-stat__label"><?= esc_html(__('Laatste controle', 'yard-page-guard')) ?></span>
					<span class="ypg-cron-stat__value">
						<?= null !== $cronLastRun
					? esc_html(wp_date($cronDateTimeFormat, $cronLastRun))
					: esc_html(__('Nog niet uitgevoerd', 'yard-page-guard')) ?>
					</span>
				</div>
				<div class="ypg-cron-stat">
					<span class="ypg-cron-stat__label"><?= esc_html(__('Volgende controle', 'yard-page-guard')) ?></span>
					<span class="ypg-cron-stat__value"><?= esc_html(wp_date($cronDateTimeFormat, $cronNextRun)) ?></span>
					<span class="ypg-cron-stat__countdown" data-ypg-cron-countdown="<?= esc_attr((string) $cronNextRun) ?>" aria-live="polite"></span>
				</div>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Email afzender', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint"><?= esc_html(__('Hoe herzienings- en herinneringsmails worden verstuurd. Staat versturen uit, dan blijven openstaande items wachten tot het weer aan staat.', 'yard-page-guard')) ?></p>
			</header>
			<div class="ypg-field">
				<label class="ypg-toggle">
					<input type="checkbox" name="ypg_emails_enabled" <?= checked(get_option('ypg_emails_enabled', true)) ?> />
					<span><?= esc_html(__('Automatische e-mails versturen', 'yard-page-guard')) ?></span>
				</label>
			</div>
			<div class="ypg-settings-grid">
				<div class="ypg-field">
					<label for="ypg_email_from_name"><?= esc_html(__('Afzendnaam', 'yard-page-guard')) ?></label>
					<input type="text" id="ypg_email_from_name" name="ypg_email_from_name" value="<?= esc_attr(get_option('ypg_email_from_name', get_bloginfo('name'))); ?>" />
				</div>
				<div class="ypg-field">
					<label for="ypg_email_from_address"><?= esc_html(__('Afzend emailadres', 'yard-page-guard')) ?></label>
					<input type="email" id="ypg_email_from_address" name="ypg_email_from_address" value="<?= esc_attr(get_option('ypg_email_from_address', $defaultFromAddress)); ?>" />
				</div>
				<div class="ypg-field">
					<label for="ypg_reminder_email_bcc"><?= esc_html(__('BCC voor herinneringsmails', 'yard-page-guard')) ?></label>
					<input type="email" id="ypg_reminder_email_bcc" name="ypg_reminder_email_bcc" value="<?= esc_attr(get_option('ypg_reminder_email_bcc', '')); ?>" />
				</div>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Periodes', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint"><?= esc_html(__('De standaard herzienings- en herinneringsperiodes.', 'yard-page-guard')) ?></p>
			</header>
			<div class="ypg-settings-grid">
				<div class="ypg-field">
					<label for="ypg_review_time_period"><?= esc_html(__('Herzieningsperiode', 'yard-page-guard')) ?></label>
					<div class="ypg-input-group">
						<input type="number" id="ypg_review_time_period" name="ypg_review_time_period" value="<?= esc_attr(get_option('ypg_review_time_period', 2)); ?>" min="1" />
						<select name="ypg_review_time_unit" aria-label="<?= esc_attr(__('Eenheid herzieningsperiode', 'yard-page-guard')) ?>">
							<?php
						$selected_unit = get_option('ypg_review_time_unit', 'weeks');
foreach ($this->getUnitOptions() as $key => $label) {
	echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
}
?>
						</select>
					</div>
				</div>
				<div class="ypg-field">
					<label for="ypg_reminder_time_period"><?= esc_html(__('Herinneringsperiode', 'yard-page-guard')) ?></label>
					<div class="ypg-input-group">
						<input type="number" id="ypg_reminder_time_period" name="ypg_reminder_time_period" value="<?= esc_attr(get_option('ypg_reminder_time_period', 1)); ?>" min="1" />
						<select name="ypg_reminder_time_unit" aria-label="<?= esc_attr(__('Eenheid herinneringsperiode', 'yard-page-guard')) ?>">
							<?php
		$selected_unit = get_option('ypg_reminder_time_unit', 'weeks');
foreach ($this->getUnitOptions() as $key => $label) {
	echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
}
?>
						</select>
					</div>
				</div>
				<div class="ypg-field">
					<label for="ypg_cron_send_time" title="<?= esc_html(__('Tijdstip waarop de dagelijkse controle voor herzienings- en herinneringsmails wordt uitgevoerd.', 'yard-page-guard')) ?>"><?= esc_html(__('Tijdstip van controle', 'yard-page-guard')) ?></label>
					<input type="text" inputmode="numeric" maxlength="5" pattern="\d{2}:\d{2}" placeholder="00:00" autocomplete="off" data-ypg-time id="ypg_cron_send_time" name="ypg_cron_send_time" class="ypg-time-input" value="<?= esc_attr(get_option('ypg_cron_send_time', '06:00')); ?>" />
				</div>
			</div>
		</section>



		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Herzieningsmail', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Wordt verstuurd zodra een pagina toe is aan een herziening, met het verzoek aan de inhoudseigenaar om de inhoud te controleren.', 'yard-page-guard')) ?>
				</p>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Beschikbare variabelen:', 'yard-page-guard')) ?>
					<code>{name}</code> <?= esc_html(__('naam inhoudseigenaar', 'yard-page-guard')) ?>,
					<code>{item_list}</code> <?= esc_html(__('lijst te controleren items', 'yard-page-guard')) ?>
				</p>
			</header>
			<div class="ypg-field">
				<label for="ypg_review_email_subject"><?= esc_html(__('Onderwerp', 'yard-page-guard')) ?></label>
				<input type="text" id="ypg_review_email_subject" name="ypg_review_email_subject" value="<?= esc_attr(get_option('ypg_review_email_subject', __('Controleer jouw webpagina(\'s)', 'yard-page-guard'))); ?>" />
			</div>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_review_email_content"><?= esc_html(__('Inhoud', 'yard-page-guard')) ?></label>
				<?php $renderEditor('ypg_review_email_content', (string) get_option('ypg_review_email_content', ''), 'name,item_list'); ?>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Herinneringsmail', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Periodieke herinnering aan inhoudseigenaren met achterstallige items die nog gecontroleerd moeten worden. Wordt alleen verstuurd zolang er openstaande herzieningen zijn.', 'yard-page-guard')) ?>
				</p>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Beschikbare variabelen:', 'yard-page-guard')) ?>
					<code>{name}</code> <?= esc_html(__('naam inhoudseigenaar', 'yard-page-guard')) ?>,
					<code>{item_list}</code> <?= esc_html(__('lijst van achterlopende items', 'yard-page-guard')) ?>
				</p>
			</header>
			<div class="ypg-field">
				<label for="ypg_reminder_email_subject"><?= esc_html(__('Onderwerp', 'yard-page-guard')) ?></label>
				<input type="text" id="ypg_reminder_email_subject" name="ypg_reminder_email_subject" value="<?= esc_attr(get_option('ypg_reminder_email_subject', __('Herinnering controle webpagina(\'s)', 'yard-page-guard'))); ?>" />
			</div>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_reminder_email_content"><?= esc_html(__('Inhoud', 'yard-page-guard')) ?></label>
				<?php $renderEditor('ypg_reminder_email_content', (string) get_option('ypg_reminder_email_content', ''), 'name,item_list'); ?>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Controleer venster', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint"><?= esc_html(__('Wordt getoond aan inhoudseigenaren tijdens de controle van hun pagina\'s.', 'yard-page-guard')) ?></p>
			</header>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_modal_footer_content"><?= esc_html(__('Footer inhoud', 'yard-page-guard')) ?></label>
				<?php $renderEditor('ypg_modal_footer_content', (string) get_option('ypg_modal_footer_content', ''), '', 6, 'button'); ?>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Toegang', 'yard-page-guard')) ?></h2>
			</header>
			<div class="ypg-field">
				<label class="ypg-toggle">
					<input type="checkbox" name="ypg_show_internal_data_on_review" <?= checked(get_option('ypg_show_internal_data_on_review', false)) ?> />
					<span><?= esc_html(__('Externe eigenaren kunnen interne data inzien', 'yard-page-guard')) ?></span>
				</label>
			</div>
		</section>

		<?php submit_button(); ?>
	</form>
</div>
