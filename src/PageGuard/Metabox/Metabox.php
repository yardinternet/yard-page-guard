<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Enums\PostMeta;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Meta;
use Yard\PageGuard\Traits\Text;

class Metabox
{
	use Date;
	use Text;
	use Meta;

	public function addMetaboxes(): void
	{
		add_meta_box(
			'yard_page_guard_metabox',
			__('Inhoudscontrole module', 'yard-page-guard'),
			[$this, 'renderMetaBox'],
			apply_filters('yard::page-guard/post-types-to-use', ['page']),
			'side',
			'high',
			[ '__back_compat_meta_box' => true ] // Automatically hides this inside Gutenberg
		);
	}


	private function shouldSave(int $postId): bool
	{
		// Check save location
		if (isset($_POST['ypg_metaboxes_nonce'])) {
			if (! wp_verify_nonce($_POST['ypg_metaboxes_nonce'], basename(__FILE__))) {
				return false;
			}
		} else {
			return false;
		}

		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return false;
		}

		$postTypes = apply_filters('yard::page-guard/post-types-to-use', ['page']);
		if (! isset($_POST['post_type']) || ! in_array($_POST['post_type'], $postTypes, true)) {
			return false;
		}

		if (! current_user_can(apply_filters('yard::page-guard/capability/admin', 'edit_pages'), $postId)) {
			return false;
		}

		if (! $this->currentUserHasAccess($postId)) {
			return false;
		}

		return true;
	}

	private function currentUserHasAccess(int $postId): bool
	{
		$post = get_post($postId);
		$contentOwnerId = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_ID, true) ?: '';
		$contentOwnerType = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_TYPE, true);
		$currentUser = wp_get_current_user();

		// Make admin roles filterable
		$defaultRoles = ['administrator', 'yard_superuser', 'super-user', 'superuser'];
		$adminRoles = apply_filters('yard::page-guard/admin-roles', $defaultRoles);

		// Regardless of content owner type: newly created posts, allowed roles, current user is author or no content owner set
		if (
			0 === strlen($post->post_name)
			|| count(array_intersect($adminRoles, (array) $currentUser->roles)) > 0
			|| '' === $contentOwnerId
			|| $currentUser->ID === $post->post_author
		) {
			return true;
		}

		return (int) $contentOwnerId === $currentUser->ID && ContentOwnerType::USER === $contentOwnerType;
	}

	public function handleInternalData(int $postId): void
	{
		if (! $this->shouldSave($postId)) {
			return;
		}

		if (! isset($_POST['ypg_post_content_owner'])) {
			return;
		}

		$contentOwnerName = trim((string) (get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, true) ?: ''));

		if ('' === $contentOwnerName) {
			$this->removeInternalData($postId);

			return;
		}

		$internalDataSyncEnabled = (bool) apply_filters('yard::page-guard/enable-internal-data-sync', $this->owcInternalDataPluginsActive());

		if (! $internalDataSyncEnabled) {
			return;
		}

		$this->addInternalData($postId);
	}

	private function owcInternalDataPluginsActive(): bool
	{
		static $cached = null;

		if (null !== $cached) {
			return $cached;
		}

		if (! function_exists('is_plugin_active') && defined('ABSPATH')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if (function_exists('is_plugin_active')) {
			if (is_plugin_active('pdc-internal-products/pdc-internal-products.php') || is_plugin_active('openpub-internal-data/pub-internal-products.php')) {
				return $cached = true;
			}
		}

		foreach (get_declared_classes() as $class) {
			if (strpos($class, 'Yard\\OWC\\') === 0) {
				return $cached = true;
			}
		}

		return $cached = false;
	}

	private function addInternalData(int $postId): void
	{
		$ownerName = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_NAME, true) ?: '';
		$ownerEmail = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_EMAIL, true) ?: '';
		$ownerPhone = get_post_meta($postId, PostMeta::POST_CONTENT_OWNER_PHONE_NUMBER, true) ?: '';

		$title = __('Inhoudscontrole module', 'yard-page-guard');
		$label = __('Inhoudseigenaar', 'yard-page-guard') . ': ';

		$ownerLink = sprintf(
			'%s <a href="mailto:%s">%s</a>',
			$label,
			esc_attr($ownerEmail),
			esc_html($ownerName)
		);

		if ('' !== $ownerPhone) {
			$telNumber = $this->formatPhoneForTel($ownerPhone);
			$phoneDisplay = null !== $telNumber
				? sprintf('<a href="tel:%s">%s</a>', esc_attr($telNumber), esc_html($ownerPhone))
				: esc_html($ownerPhone);
			$ownerLink .= sprintf(' (%s)', $phoneDisplay);
		}

		/**
		 * Fusion portal internal information
		 */
		if (! metadata_exists('post', $postId, '_ys_post_information_internal_title')) {
			update_post_meta($postId, '_ys_post_information_internal_title', $title);
		}

		if (metadata_exists('post', $postId, '_ys_post_information_internal')) {
			$currentValue = get_post_meta($postId, '_ys_post_information_internal', true);

			if (strpos($currentValue, 'mailto:') !== false) {
				$newValue = preg_replace(
					'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?/i',
					$ownerLink,
					$currentValue
				);
			} else {
				$newValue = empty($currentValue)
					? $ownerLink
					: $currentValue . $ownerLink;
			}

			update_post_meta($postId, '_ys_post_information_internal', $newValue);
		} else {
			update_post_meta($postId, '_ys_post_information_internal', $ownerLink);
		}

		/**
		 * Fusion PDC internal information
		 */
		$key = '_owc_pdc_internaldata';
		$current = get_post_meta($postId, $key, true);
		$current = is_array($current) ? $current : [];

		$newValue = [
			'internaldata_key' => $title,
			'internaldata_value' => $ownerLink,
		];

		$updated = false;
		foreach ($current as $i => $row) {
			if (($row['internaldata_key'] ?? '') === $title) {
				$current[$i] = $newValue;
				$updated = true;

				break;
			}
		}

		if (! $updated) {
			$current[] = $newValue;
		}

		update_post_meta($postId, $key, $current);

		/**
		 * Brave internal information
		 */
		if (function_exists('get_field') && function_exists('update_field')) {
			$rows = get_field('internal_information', $postId);
			$rows = is_array($rows) ? $rows : [];

			$updated = false;
			foreach ($rows as $i => $row) {
				if (($row['internal_information_title'] ?? '') === $title) {
					$rows[$i]['internal_information_content'] = $ownerLink;
					$updated = true;

					break;
				}
			}

			if (! $updated) {
				$rows[] = [
					'internal_information_title' => $title,
					'internal_information_content' => $ownerLink,
				];
			}

			update_field('internal_information', $rows, $postId);
		}

		do_action('yard::page-guard/after-internal-data-synced', $postId, $ownerLink, $title);
	}

	private function removeInternalData(int $postId): void
	{
		$newTitle = __('Inhoudscontrole module', 'yard-page-guard');

		/**
		 * Remove entry from single meta fields (fusion portal)
		 */
		if (metadata_exists('post', $postId, '_ys_post_information_internal_title')) {
			$currentTitle = get_post_meta($postId, '_ys_post_information_internal_title', true);

			if ($currentTitle === $newTitle) {
				delete_post_meta($postId, '_ys_post_information_internal_title');
			}
		}

		if (metadata_exists('post', $postId, '_ys_post_information_internal')) {
			$value = get_post_meta($postId, '_ys_post_information_internal', true);

			// Remove the Inhoudseigenaar block (email link + optional phone link)
			$value = preg_replace(
				'/<p>\s*Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?\s*<\/p>|Inhoudseigenaar.*?<a href="mailto:.*?<\/a>(\s*\(.*?\))?/i',
				'',
				$value
			);

			update_post_meta($postId, '_ys_post_information_internal', $value);
		}

		/**
		 * Remove entry from Fusion PDC repeater
		 */
		$pdcKey = '_owc_pdc_internaldata';
		$pdcEntries = get_post_meta($postId, $pdcKey, true);

		if (is_array($pdcEntries)) {
			$pdcEntries = array_values(array_filter($pdcEntries, function ($entry) use ($newTitle) {
				return ! (isset($entry['internaldata_key']) && $entry['internaldata_key'] === $newTitle);
			}));

			update_post_meta($postId, $pdcKey, $pdcEntries);
		}

		/**
		 * Remove entry from Brave ACF repeater "internal_information"
		 */
		if (function_exists('get_field') && function_exists('update_field')) {
			$acfRows = get_field('internal_information', $postId);

			if (is_array($acfRows)) {
				$acfRows = array_values(array_filter($acfRows, function ($row) use ($newTitle) {
					return ! (isset($row['internal_information_title']) &&
							  $row['internal_information_title'] === $newTitle);
				}));

				update_field('internal_information', $acfRows, $postId);
			}
		}

		do_action('yard::page-guard/after-internal-data-removed', $postId);
	}

	private function formatPhoneForTel(string $phone): ?string
	{
		$cleaned = preg_replace('/[\s\-\.\(\)]/', '', $phone);

		if (str_starts_with($cleaned, '0')) {
			$cleaned = '+31' . substr($cleaned, 1);
		}

		if (preg_match('/^\+\d{7,15}$/', $cleaned)) {
			return $cleaned;
		}

		return null;
	}

	// TODO: move out of admin scoped code, since this is also used in REST API
	public function registerMeta(): void
	{
		//TODO: set default values
		$meta_fields = [
			PostMeta::POST_CONTENT_OWNER_ID => [ 'type' => 'string', 'sanitize' => 'sanitize_text_field' ],
			PostMeta::REVIEW_DATE_TYPE => [ 'type' => 'string', 'sanitize' => 'sanitize_text_field' ], // Fixme: sanitize callback should validate against allowed values
			PostMeta::REVIEW_DATE => [ 'type' => 'string', 'sanitize' => 'sanitize_text_field' ],
			PostMeta::REMINDER_TIME_TYPE => [ 'type' => 'string', 'sanitize' => 'sanitize_text_field' ], //FIXME: sanitize callback should validate against allowed values
			PostMeta::REMINDER_TIME_PERIOD => [ 'type' => 'integer', 'sanitize' => 'absint' ],
			PostMeta::REMINDER_TIME_UNIT => [ 'type' => 'string', 'sanitize' => 'sanitize_text_field' ], //FIXME: sanitize callback should validate against allowed values
		];

		foreach ($meta_fields as $key => $config) {
			register_post_meta(
				'',
				$key,
				[
					'show_in_rest' => true,
					'single' => true,
					'type' => $config['type'],
					'sanitize_callback' => $config['sanitize'],
					'auth_callback' => function () {
						return current_user_can('edit_posts');
					},
				]
			);
		}
	}

	public function renderMetaBox(\WP_Post $post)
	{
		wp_nonce_field('my_sections_nonce_action', 'my_sections_nonce');

		// Pull values
		$contentOwnerId = get_post_meta($post->ID, PostMeta::POST_CONTENT_OWNER_ID, true);
		$reviewDateType = get_post_meta($post->ID, PostMeta::REVIEW_DATE_TYPE, true) ?: 'opt1';
		$reviewDate = get_post_meta($post->ID, PostMeta::REVIEW_DATE, true);
		$lastReviewDate = get_post_meta($post->ID, PostMeta::LAST_REVIEW_DATE, true);
		$reminderTimeType = get_post_meta($post->ID, PostMeta::REMINDER_TIME_TYPE, true) ?: 'opt1';
		$reminderTypePeriod = get_post_meta($post->ID, PostMeta::REMINDER_TIME_PERIOD, true);
		$reminderTypeUnit = get_post_meta($post->ID, PostMeta::REMINDER_TIME_UNIT, true) ?: 'days';

		$defaultReviewData = get_post_meta($post->ID, PostMeta::REVIEW_DATE, true) ?: $this->addPeriodToBase(date('Y-m-d'), (int) get_option(Options::REMINDER_TIME_PERIOD, 1), get_option(Options::REMINDER_TIME_UNIT, 'weeks'));
		$defaultReminderData = get_option(Options::REMINDER_TIME_PERIOD, 1) . ' ' . get_option(Options::REMINDER_TIME_UNIT, 'weeks');
		?>
	<div>
		<div>
			<h4><?php esc_html_e('Inhoudseigenaar', 'yard-page-guard'); ?></h4>
			<p class="description"><?php esc_html_e('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'); ?></p>
			<?php echo $this->renderInput([
				'type' => 'select',
				'name' => PostMeta::POST_CONTENT_OWNER_ID,
				'value' => $contentOwnerId,
				'options' => $this->getContentOwnerOptions(),
			]); ?>
		</div>
		<hr>
		<div>
			<h4><?php esc_html_e('Herzieningsdatum', 'yard-page-guard'); ?></h4>
			<?php echo $this->renderInput(
				['type' => 'radio',
					'name' => PostMeta::REVIEW_DATE_TYPE,
					'value' => $reviewDateType,
					'options' => [
						'default' => __('Volgens de standaardinstelling', 'yard-page-guard') . sprintf('<code>%s</code>', esc_html($defaultReviewData)),
						'custom' => __('Kies eenmalig een afwijkende datum', 'yard-page-guard'),
					],
					'label' => __('Wanneer moet de inhoudseigenaar de eerste controlemail ontvangen?', 'yard-page-guard'),
				]);?>
			<?php 		echo $this->renderInput(
				['type' => 'date',
					'name' => PostMeta::REVIEW_DATE,
					'value' => $reviewDate,
					'label' => __('Kies een datum:', 'yard-page-guard'),
					'min' => date('Y-m-d'),
				]
			);
		?>
		</div>
		<hr>
		<div>
			<h4><?php esc_html_e('Herinneringsperiode', 'yard-page-guard'); ?></h4>
			<?php echo $this->renderInput(
				['type' => 'radio',
					'name' => PostMeta::REMINDER_TIME_TYPE,
					'value' => $reminderTimeType,
					'options' => [
						'default' => __('Volgens de standaardinstelling', 'yard-page-guard') . sprintf('<code>%s</code>', esc_html($defaultReminderData)),
						'custom' => __('Kies afwijkende periode:', 'yard-page-guard'),
					],
					'label' => __('Wanneer moet de herinnneringsmail verstuurd worden als de controle nog niet is afgerond?', 'yard-page-guard'),
				]
			);?>
			<?php echo $this->renderInput(
				['type' => 'number',
					'name' => PostMeta::REMINDER_TIME_PERIOD,
					'value' => $reminderTypePeriod,
					'label' => __('Aantal:', 'yard-page-guard'),
					'min' => 1,
				]
			);?>
			<?php echo $this->renderInput(
				['type' => 'select',
					'name' => PostMeta::REMINDER_TIME_UNIT,
					'value' => $reminderTypeUnit,
					'options' => [
						'days' => __('Dagen', 'yard-page-guard'),
						'weeks' => __('Weken', 'yard-page-guard'),
						'months' => __('Maanden', 'yard-page-guard'),
					],
					'label' => __('Eenheid:', 'yard-page-guard'),
				]
			);?>

		</div>
		<hr>
		<div>
			<h4>Status</h4>
			<?php echo $this->renderInput(
				[
					'type' => 'date',
					'name' => 'last_review_date',
					'value' => $lastReviewDate ?: __('No date chosen', 'yard-page-guard'),
					'label' => __('Wanneer voor het laatst gecontroleerd?', 'yard-page-guard'),
					'readonly' => true,
					'disabled' => true,
					'description' => '',
				]
			);?>
			<button type="button" class="button" onclick="alert('Action Triggered!')"><?php esc_html_e('Ik heb de pagina opnieuw gecontroleerd', 'yard-page-guard'); ?></button>
		</div>
	</div>
	<?php
	wp_print_inline_script_tag("
		document.addEventListener('change', function(e) {
			if(e.target && e.target.name === 'sec2_radio') {
				document.getElementById('sec2_conditional_date').style.display = (e.target.value === 'opt2') ? 'block' : 'none';
			}
			if(e.target && e.target.name === 'sec3_radio') {
				document.getElementById('sec3_conditional_interval').style.display = (e.target.value === 'opt2') ? 'block' : 'none';
			}
		});
		");
	}

	public function saveMeta($post_id)
	{
		if (! isset($_POST['my_sections_nonce']) || ! wp_verify_nonce($_POST['my_sections_nonce'], 'my_sections_nonce_action')) {
			return;
		}
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return;
		}

		$fields = [ 'sec1_select', 'sec2_radio', 'sec2_date', 'sec3_radio', 'sec3_interval_num', 'sec3_interval_unit' ];
		foreach ($fields as $field) {
			if (isset($_POST[$field])) {
				$val = ('sec3_interval_num' === $field) ? absint($_POST[$field]) : sanitize_text_field($_POST[$field]);
				update_post_meta($post_id, $field, $val);
			}
		}
	}

	// TODO: move to to trait?
	protected function renderInput(array $args): string
	{
		$args = wp_parse_args($args, [
			'type' => 'text',
			'name' => '',
			'value' => '',
			'label' => '',
			'description' => '',
			'options' => [],
			'min' => null,
			'max' => null,
			'step' => null,
			'disabled' => null,
			'readonly' => null,
		]);

		$attributes = wp_array_slice_assoc($args, ['min', 'max', 'step', 'disabled', 'readonly']);
		$attributeString = '';
		foreach ($attributes as $key => $value) {
			if (null !== $value) {
				$attributeString .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
			}
		}

		switch ($args['type']) {
			case 'text':
			case 'email':
			case 'phone':
			case 'number':
			case 'date':
				return sprintf(
					'<p><label for="%1$s">%2$s</label><input type="%5$s" name="%1$s" value="%3$s" class="widefat" %6$s/><span class="description">%4$s</span></p>',
					esc_attr($args['name']),
					esc_html($args['label']),
					esc_attr($args['value']),
					esc_html($args['description']),
					esc_attr($args['type']),
					$attributeString
				);
			case 'select':
				$optionsHtml = '';
				foreach ($args['options'] as $optionValue => $optionLabel) {
					$selected = selected($args['value'], $optionValue, false);
					$optionsHtml .= sprintf('<option value="%s" %s>%s</option>', esc_attr($optionValue), $selected, esc_html($optionLabel));
				}

				return sprintf(
					'<p><label for="%1$s">%2$s</label><select id="%1$s" name="%1$s">%3$s</select><span class="description">%4$s</span></p>',
					esc_attr($args['name']),
					esc_html($args['label']),
					$optionsHtml,
					esc_html($args['description'])
				);
			case 'radio':
				$radioHtml = sprintf('<strong style="display: block; margin-bottom: 5px;">%s</strong>', esc_html($args['label']));
				foreach ($args['options'] as $optionValue => $optionLabel) {
					$radioHtml .= sprintf(
						'<label style="display: block; margin-bottom: 5px;"><input type="radio" name="%1$s" value="%2$s" %3$s/>%4$s</label>',
						$args['name'],
						$optionValue,
						checked($args['value'], $optionValue, false),
						wp_kses_post($optionLabel)
					);
				}

				return sprintf(
					'<p>%s</p>',
					$radioHtml
				);
			default:
				return '';
		}
	}

	protected function getContentOwnerOptions(): array
	{
		$wpUsers = get_users([
			'capability' => apply_filters('yard::page-guard/capability/admin', 'edit_pages'),
		]);
		$wpUsers = array_map(function (\WP_User $user) {
			return [
				'id' => "user_{$user->ID}",
				'name' => $user->display_name,
			];
		}, $wpUsers);

		$externalUsers = get_terms([
			'taxonomy' => 'ypg_external_content_owner',
			'hide_empty' => false,
		]);
		$externalUsers = array_map(function (\WP_Term $term) {
			return [
				'id' => "term_{$term->term_id}",
				'name' => sprintf('%s (extern)', $term->name),
			];
		}, $externalUsers);
		$contentOwnerOptions = array_merge($wpUsers, $externalUsers);

		return array_column($contentOwnerOptions, 'name', 'id');
	}
}
