<?php

declare(strict_types=1);

namespace Yard\PageGuard\Metabox;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Enums\TimeUnit;
use Yard\PageGuard\Meta\Meta;
use Yard\PageGuard\Models\ContentOwner;
use Yard\PageGuard\Models\ReviewItem;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\AdminPermissions;
use Yard\PageGuard\Traits\ContentOwners;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\FormField;
use Yard\PageGuard\Traits\PostTypes;

class Metabox
{
	use AdminPermissions;
	use Date;
	use ContentOwners;
	use PostTypes;
	use FormField;

	public const NONCE_FIELD = 'ypg_metaboxes_nonce';
	public const NONCE_ACTION = 'ypg_meta_update';
	public const REVIEWED_QUERY_PARAM = '_ypg_reviewed';

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

	private function currentUserHasAccess(int $postId): bool
	{
		$post = get_post($postId);
		$reviewItem = new ReviewItem($post);
		$contentOwner = $reviewItem->contentOwner();

		$currentUser = wp_get_current_user();

		// Make admin roles filterable
		$defaultRoles = ['administrator', 'yard_superuser', 'super-user', 'superuser'];
		$adminRoles = apply_filters('yard::page-guard/admin-roles', $defaultRoles);

		// Regardless of content owner type: newly created posts, allowed roles, current user is author or no content owner set
		if (
			0 === strlen($post->post_name)
			|| count(array_intersect($adminRoles, (array) $currentUser->roles)) > 0
			|| '' === $contentOwner->id()
			|| $currentUser->ID === $post->post_author
		) {
			return true;
		}

		return (int) $contentOwner->id() === $currentUser->ID && ContentOwnerType::USER === $contentOwner->type();
	}

	public function renderMetaBox(\WP_Post $post)
	{
		wp_nonce_field(self::NONCE_ACTION, self::NONCE_FIELD);
		$reviewItem = new ReviewItem($post);
		$contentOwner = $reviewItem->contentOwner();
		?>
	<div class="form-wrap">
		<div>
			<h4><?php esc_html_e('Inhoudseigenaar', 'yard-page-guard'); ?></h4>
			<p class="description"><?php esc_html_e('Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.', 'yard-page-guard'); ?></p>
			<?php echo $this->renderInput([
				'type' => 'select',
				'name' => Meta::POST_CONTENT_OWNER_ID,
				'value' => $contentOwner ? $contentOwner->combinedId() : '',
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
					'name' => Meta::LAST_REVIEW_DATE . '_display',
					'value' => $reviewItem->lastReviewDateFormatted(),
					'label' => __('Laatst gecontroleerd', 'yard-page-guard'),
					'readonly' => true,
					'disabled' => true,
				]
			);?>
			<?php echo $this->renderInput(
				[
					'type' => 'text',
					'name' => Meta::REVIEW_DATE . '_display',
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
		if (defined('DOING_AUTOSAVE') && \DOING_AUTOSAVE) {
			return;
		}

		check_admin_referer(self::NONCE_ACTION, self::NONCE_FIELD);

		if (! current_user_can($this->adminCapability(), $postId)) {
			return;
		}

		$reviewItem = new ReviewItem($post);

		$postContentOwner = sanitize_text_field($_POST[Meta::POST_CONTENT_OWNER_ID] ?? '');
		$contentOwner = ContentOwner::fromCombinedId($postContentOwner);

		if (null === $contentOwner) {
			$reviewItem->removeMetaData();
		} else {
			$reviewDateType = sanitize_text_field($_POST[Meta::REVIEW_DATE_TYPE] ?? '');
			$reviewDate = sanitize_text_field($_POST[Meta::REVIEW_DATE] ?? '');
			$reminderTimeType = sanitize_text_field($_POST[Meta::REMINDER_TIME_TYPE] ?? null);
			$reminderTimePeriod = isset($_POST[Meta::REMINDER_TIME_PERIOD]) ? intval($_POST[Meta::REMINDER_TIME_PERIOD]) : null;
			$reminderTimeUnit = sanitize_text_field($_POST[Meta::REMINDER_TIME_UNIT] ?? null);

			$reviewItem->setContentOwner($contentOwner->id(), $contentOwner->type());
			if (ReviewDateType::CUSTOM === $reviewDateType || null === $reviewItem->reviewDate()) {
				$reviewItem->setReviewDate($reviewDateType, \DateTime::createFromFormat('Y-m-d', $reviewDate)?: null);
			}
			$reviewItem->setReminderTime($reminderTimeType, $reminderTimePeriod, $reminderTimeUnit);
		}
	}

	public function handleMarkAsReviewed(): void
	{
		check_admin_referer('mark_as_reviewed');

		$postId = (int) $_GET['post_id'];

		if (0 >= $postId || ! get_post($postId)) {
			wp_die(__('Ongeldige post ID.', 'yard-page-guard'));
		}

		if (! current_user_can($this->adminCapability(), $postId)) {
			wp_die(__('Je hebt geen toestemming om deze actie uit te voeren.', 'yard-page-guard'));
		}

		// $postTypes = $this->getPostTypes();
		// if (! isset($_POST['post_type']) || ! in_array($_POST['post_type'], $postTypes, true)) {
		// 	return false;
		// }

		// if (! $this->currentUserHasAccess($postId)) {
		// 	return false;
		// }

		$reviewItem = new ReviewItem(get_post($postId));
		$reviewItem->markAsReviewed();

		wp_redirect(add_query_arg(['post' => $postId, 'action' => 'edit', self::REVIEWED_QUERY_PARAM => '1'], admin_url('post.php')));
		exit;
	}

	public function displayAdminNotices(): void
	{
		if (isset($_GET[self::REVIEWED_QUERY_PARAM]) && '1' === $_GET[self::REVIEWED_QUERY_PARAM]) {
			wp_admin_notice(
				esc_html__('De inhoud is gemarkeerd als gecontroleerd.', 'yard-page-guard'),
				[
					'type' => 'success',
					'dismissible' => true,
				]
			);
		}
	}
}
