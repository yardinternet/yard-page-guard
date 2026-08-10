<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Enums\TimeUnit;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\ContentOwners;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\PostTypes;

class Metabox
{
	use Date;
	use ContentOwners;
	use PostTypes;

	public const NONCE_FIELD = 'ypg_metaboxes_nonce';
	public const NONCE_ACTION = 'ypg_meta_update';

	public function addMetaboxes(): void
	{
		add_meta_box(
			'yard_page_guard_metabox',
			__('Inhoudscontrole module', 'yard-page-guard'),
			[$this, 'renderMetaBox'],
			$this->getPostTypes(),
			'side',
			'high',
			[ '__back_compat_meta_box' => true ] // Automatically hides this inside Gutenberg
		);
	}

	private function shouldSave(int $postId): bool
	{
		if (! isset($_POST[self::NONCE_FIELD]) || ! wp_verify_nonce($_POST[self::NONCE_FIELD], self::NONCE_ACTION)) {
			return false;
		}

		if (defined('DOING_AUTOSAVE') && \DOING_AUTOSAVE) {
			return false;
		}

		$postTypes = $this->getPostTypes();
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
		$contentOwnerId = get_post_meta($postId, Meta::POST_CONTENT_OWNER_ID, true) ?: '';
		$contentOwnerType = get_post_meta($postId, Meta::POST_CONTENT_OWNER_TYPE, true);
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

	public function renderMetaBox(\WP_Post $post)
	{
		wp_nonce_field('ypg_meta_update', 'ypg_metaboxes_nonce');

		$reviewItem = new ReviewItem($post);

		$contentOwner = $reviewItem->contentOwner();
		$contentOwnerId = $contentOwner ? $contentOwner->id() : '';
		$contentOwnerType = $contentOwner ? $contentOwner->type() : ContentOwnerType::USER;
		?>
	<div>
		<div>
			<h4><?php esc_html_e('Inhoudseigenaar', 'yard-page-guard'); ?></h4>
			<p class="description"><?php esc_html_e('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'); ?></p>
			<?php echo $this->renderInput([
				'type' => 'select',
				'name' => Meta::POST_CONTENT_OWNER_ID,
				'value' => sprintf('%s:%s', $contentOwnerType, $contentOwnerId),
				'options' => $this->getContentOwnerOptions(),
			]); ?>
		</div>
		<hr>
		<div >
			<h4><?php esc_html_e('Herzieningsdatum', 'yard-page-guard'); ?></h4>
			<div
				data-toggle-control
				data-toggle-name="<?php echo esc_attr(Meta::REVIEW_DATE_TYPE); ?>"
				data-toggle-target=".ypg-review-date"
				data-toggle-value="custom"
			>
				<?php echo $this->renderInput(
					['type' => 'radio',
						'name' => Meta::REVIEW_DATE_TYPE,
						'value' => $reviewItem->reviewDateType(),
						'options' => [
							'default' => sprintf(
								'%s <code>%s</code>',
								__('Volgens de standaardinstelling', 'yard-page-guard'),
								esc_html($this->formatPeriod((int) get_option(Settings::REVIEW_TIME_PERIOD), get_option(Settings::REVIEW_TIME_UNIT)))
							),
							'custom' => __('Kies eenmalig een afwijkende datum', 'yard-page-guard'),
						],
						'label' => __('Wanneer moet de inhoudseigenaar de eerste controlemail ontvangen?', 'yard-page-guard'),
					]);?>
			</div>
			<div class="ypg-review-date">
				<?php echo $this->renderInput(
					['type' => 'date',
						'name' => Meta::REVIEW_DATE,
						'value' => $reviewItem->reviewDate() ? $reviewItem->reviewDate()->format('Y-m-d') : '',
						'label' => __('Kies een datum:', 'yard-page-guard'),
						'min' => date('Y-m-d'),
					]
				);?>
			</div>
		</div>
		<hr>
		<div>
			<h4><?php esc_html_e('Herinneringsperiode', 'yard-page-guard'); ?></h4>
			<div
				data-toggle-control
				data-toggle-name="<?php echo esc_attr(Meta::REMINDER_TIME_TYPE); ?>"
				data-toggle-target=".ypg-reminder-interval"
				data-toggle-value="custom"
			>
				<?php echo $this->renderInput(
					['type' => 'radio',
						'name' => Meta::REMINDER_TIME_TYPE,
						'value' => $reviewItem->reminderTimeType(),
						'options' => [
							'default' => sprintf(
								'%s <code>%s</code>',
								__('Volgens de standaardinstelling', 'yard-page-guard'),
								esc_html($this->formatPeriod((int) get_option(Settings::REMINDER_TIME_PERIOD, 1), get_option(Settings::REMINDER_TIME_UNIT)))
							),
							'custom' => __('Kies afwijkende periode:', 'yard-page-guard'),
						],
						'label' => __('Wanneer moet de herinnneringsmail verstuurd worden als de controle nog niet is afgerond?', 'yard-page-guard'),
					]
				);?>
			</div>
			<div class="ypg-reminder-interval">
				<?php echo $this->renderInput(
					['type' => 'number',
						'name' => Meta::REMINDER_TIME_PERIOD,
						'value' => $reviewItem->reminderTimePeriod(),
						'label' => __('Aantal:', 'yard-page-guard'),
						'min' => 1,
					]
				);?>
				<?php echo $this->renderInput(
					['type' => 'select',
						'name' => Meta::REMINDER_TIME_UNIT,
						'value' => $reviewItem->reminderTimeUnit(),
						'options' => TimeUnit::options(),
						'label' => __('Eenheid:', 'yard-page-guard'),
					]
				);?>
			</div>
		</div>
		<hr>
		<div>
			<h4><?php esc_html_e('Status', 'yard-page-guard'); ?></h4>
			<?php echo $this->renderInput(
				[
					'type' => 'text',
					'name' => Meta::LAST_REVIEW_DATE,
					'value' => $reviewItem->lastReviewDateFormatted(),
					'label' => __('Laatst gecontroleerd', 'yard-page-guard'),
					'readonly' => true,
					'disabled' => true,
				]
			);?>
			<?php echo $this->renderInput(
				[
					'type' => 'text',
					'name' => Meta::REVIEW_DATE,
					'value' => $reviewItem->reviewDateFormatted(),
					'label' => __('Volgende herzieningsdatum', 'yard-page-guard'),
					'readonly' => true,
					'disabled' => true,
				]
			);?>


			<?php if ($reviewItem->reviewDate()) : ?>
			<a class="button"  href="<?php echo wp_nonce_url(add_query_arg(['action' => 'mark_as_reviewed', 'post_id' => $post->ID], get_edit_post_link($post->ID, 'post.php')), 'mark_as_reviewed'); ?>"><?php esc_html_e('Markeer als gecontroleerd', 'yard-page-guard'); ?></a>
			<?php endif; ?>
		</div>
	</div>
	<?php
	wp_print_inline_script_tag("
		document.addEventListener('DOMContentLoaded', function() {
			var controls = document.querySelectorAll('[data-toggle-control]');

			function updateVisibility(control) {
				var groupName = control.dataset.toggleName;
				var targetSelector = control.dataset.toggleTarget;
				var expectedValue = control.dataset.toggleValue;
				var selected = null;

				selected = document.querySelector('select[name=\"' + groupName + '\"]') ?? document.querySelector('input[name=\"' + groupName + '\"]:checked');
				if (!selected) {
					selected = document.querySelector('[name=\"' + groupName + '\"]');
				}

				var targets = document.querySelectorAll(targetSelector);

				if (!targets.length) {
					return;
				}

				targets.forEach(function(target) {
					var shouldShow = false;

					if (selected) {
						if (expectedValue === '*') {
							shouldShow = selected.value !== '';
						} else {
							shouldShow = selected.value === expectedValue;
						}
					}

					target.style.display = shouldShow ? 'block' : 'none';
				});
			}

			controls.forEach(function(control) {
				updateVisibility(control);
				control.addEventListener('change', function() {
					updateVisibility(control);
				});
			});
		});
		");
	}

	public function saveMeta(int $postId, \WP_Post $post, bool $update)
	{
		if (! isset($_POST['ypg_metaboxes_nonce']) || ! wp_verify_nonce($_POST['ypg_metaboxes_nonce'], 'ypg_meta_update')) {
			return;
		}
		if (defined('DOING_AUTOSAVE') && \DOING_AUTOSAVE) {
			return;
		}

		if (! current_user_can(apply_filters('yard::page-guard/capability/admin', 'edit_pages'), $postId)) {
			return;
		}

		$reviewItem = new ReviewItem($post);

		$postContentOwner = sanitize_text_field($_POST[Meta::POST_CONTENT_OWNER_ID] ?? '');
		if ('' === $postContentOwner) {
			$reviewItem->removeMetaData();
		} else {
			$postContentOwnerParts = explode(':', $postContentOwner, 2);
			$postContentOwnerType = $postContentOwnerParts[0] ?? null;
			$postContentOwnerId = isset($postContentOwnerParts[1]) ? (int) $postContentOwnerParts[1] : null;

			$reviewDateType = sanitize_text_field($_POST[Meta::REVIEW_DATE_TYPE] ?? '');
			$reviewDate = sanitize_text_field($_POST[Meta::REVIEW_DATE] ?? '');
			$reminderTimeType = sanitize_text_field($_POST[Meta::REMINDER_TIME_TYPE] ?? null);
			$reminderTimePeriod = isset($_POST[Meta::REMINDER_TIME_PERIOD]) ? intval($_POST[Meta::REMINDER_TIME_PERIOD]) : null;
			$reminderTimeUnit = sanitize_text_field($_POST[Meta::REMINDER_TIME_UNIT] ?? null);

			$reviewItem->setContentOwner($postContentOwnerId, $postContentOwnerType);
			if (ReviewDateType::CUSTOM === $reviewDateType || null === $reviewItem->reviewDate()) {
				$reviewItem->setReviewDate($reviewDateType, \DateTime::createFromFormat('Y-m-d', $reviewDate)?: null);
			}
			$reviewItem->setReminderTime($reminderTimeType, $reminderTimePeriod, $reminderTimeUnit);
		}
	}

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
						esc_attr($args['name']),
						esc_attr($optionValue),
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

	public function handleMarkAsReviewed(): void
	{
		if (! isset($_GET['post_id']) || ! isset($_GET['_wpnonce']) || ! wp_verify_nonce($_GET['_wpnonce'], 'mark_as_reviewed')) {
			wp_die(__('Ongeldige aanvraag.', 'yard-page-guard'));
		}

		$postId = (int) $_GET['post_id'];
		if (! current_user_can(apply_filters('yard::page-guard/capability/admin', 'edit_pages'), $postId)) {
			wp_die(__('Je hebt geen toestemming om deze actie uit te voeren.', 'yard-page-guard'));
		}

		$reviewItem = new ReviewItem(get_post($postId));
		$reviewItem->markAsReviewed();

		wp_redirect(add_query_arg(['post' => $postId, 'action' => 'edit'], admin_url('post.php')));
		exit;
	}
}
