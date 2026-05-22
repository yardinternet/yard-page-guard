<?php
/**
 * @uses Yard\PageGuard\Traits\Text
 */
$host = $_SERVER['HTTP_HOST'] ?? '';
$hostParts = explode('.', $host);
$baseHost = count($hostParts) > 2 ? implode('.', array_slice($hostParts, -2)) : $host;
$defaultFromAddress = 'houdbaarheid@' . $baseHost;

$renderLexical = static function (string $name, string $value, string $variables = '', int $rows = 10): void {
	printf(
		'<div class="ypg-lex-wrapper" data-ypg-lexical%s><textarea id="%s" name="%s" rows="%d">%s</textarea></div>',
		'' !== $variables ? ' data-variables="' . esc_attr($variables) . '"' : '',
		esc_attr($name),
		esc_attr($name),
		$rows,
		esc_textarea($value)
	);
};
?>

<div class="wrap ypg-settings-page">
	<h1 class="ypg-settings-title"><?= esc_html(__('Inhoudseigenarenmodule Instellingen', 'yard-page-guard')) ?></h1>

	<form method="post" action="options.php" class="ypg-settings-form">
		<?php settings_fields('ypg_settings'); ?>
		<?php do_settings_sections('ypg_settings'); ?>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Email afzender', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint"><?= esc_html(__('Hoe herinneringsmails worden verstuurd.', 'yard-page-guard')) ?></p>
			</header>
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
				<p class="ypg-settings-card__hint"><?= esc_html(__('Hoe vaak content gecontroleerd moet worden en wanneer de herinneringsmail wordt verstuurd.', 'yard-page-guard')) ?></p>
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
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Herzieningsmail', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Beschikbare variabelen:', 'yard-page-guard')) ?>
					<code>{1}</code> <?= esc_html(__('inhoudseigenaar', 'yard-page-guard')) ?>,
					<code>{2}</code> <?= esc_html(__('lijst te controleren items', 'yard-page-guard')) ?>
				</p>
			</header>
			<div class="ypg-field">
				<label for="ypg_review_email_subject"><?= esc_html(__('Onderwerp', 'yard-page-guard')) ?></label>
				<input type="text" id="ypg_review_email_subject" name="ypg_review_email_subject" value="<?= esc_attr(get_option('ypg_review_email_subject', __('Controleer jouw webpagina(\'s)', 'yard-page-guard'))); ?>" />
			</div>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_review_email_content"><?= esc_html(__('Inhoud', 'yard-page-guard')) ?></label>
				<?php $renderLexical('ypg_review_email_content', (string) get_option('ypg_review_email_content', ''), '1,2'); ?>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Herinneringsmail', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint">
					<?= esc_html(__('Beschikbare variabelen:', 'yard-page-guard')) ?>
					<code>{1}</code> <?= esc_html(__('inhoudseigenaar', 'yard-page-guard')) ?>,
					<code>{2}</code> <?= esc_html(__('lijst van achterlopende items', 'yard-page-guard')) ?>
				</p>
			</header>
			<div class="ypg-field">
				<label for="ypg_reminder_email_subject"><?= esc_html(__('Onderwerp', 'yard-page-guard')) ?></label>
				<input type="text" id="ypg_reminder_email_subject" name="ypg_reminder_email_subject" value="<?= esc_attr(get_option('ypg_reminder_email_subject', __('Herinnering controle webpagina(\'s)', 'yard-page-guard'))); ?>" />
			</div>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_reminder_email_content"><?= esc_html(__('Inhoud', 'yard-page-guard')) ?></label>
				<?php $renderLexical('ypg_reminder_email_content', (string) get_option('ypg_reminder_email_content', ''), '1,2'); ?>
			</div>
		</section>

		<section class="ypg-settings-card">
			<header class="ypg-settings-card__header">
				<h2><?= esc_html(__('Controleer venster', 'yard-page-guard')) ?></h2>
				<p class="ypg-settings-card__hint"><?= esc_html(__('Inhoud onderaan het venster dat verschijnt wanneer een externe eigenaar een pagina controleert.', 'yard-page-guard')) ?></p>
			</header>
			<div class="ypg-field ypg-field--full">
				<label for="ypg_modal_footer_content"><?= esc_html(__('Footer inhoud', 'yard-page-guard')) ?></label>
				<?php $renderLexical('ypg_modal_footer_content', (string) get_option('ypg_modal_footer_content', ''), '', 6); ?>
				<p class="ypg-help"><?= esc_html(__('Een knop kan aangemaakt worden door een link op een nieuwe regel toe te voegen en deze dikgedrukt te maken.', 'yard-page-guard')) ?></p>
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
