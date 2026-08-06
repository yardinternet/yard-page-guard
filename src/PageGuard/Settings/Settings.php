<?php

declare(strict_types=1);

namespace Yard\PageGuard\Settings;

use Yard\PageGuard\Enums\TimeUnit;

class Settings
{
	public const OPTION_GROUP = 'ypg_settings';

	public const REVIEW_TIME_PERIOD = 'ypg_review_time_period';
	public const REVIEW_TIME_UNIT = 'ypg_review_time_unit';
	public const REMINDER_TIME_PERIOD = 'ypg_reminder_time_period';
	public const REMINDER_TIME_UNIT = 'ypg_reminder_time_unit';
	public const EMAIL_FROM_NAME = 'ypg_email_from_name';
	public const EMAIL_FROM_ADDRESS = 'ypg_email_from_address';
	public const REMINDER_EMAIL_BCC = 'ypg_reminder_email_bcc';
	public const REVIEW_EMAIL_CONTENT = 'ypg_review_email_content';
	public const REMINDER_EMAIL_CONTENT = 'ypg_reminder_email_content';
	public const REVIEW_EMAIL_SUBJECT = 'ypg_review_email_subject';
	public const REMINDER_EMAIL_SUBJECT = 'ypg_reminder_email_subject';
	public const MODAL_FOOTER_CONTENT = 'ypg_modal_footer_content';
	public const SHOW_INTERNAL_DATA_ON_REVIEW = 'ypg_show_internal_data_on_review';

	public function registerSettings(): void
	{
		$settings = [
			self::REVIEW_TIME_PERIOD => [
				'sanitize_callback' => 'absint',
				'default' => 1,
			],
			self::REVIEW_TIME_UNIT => [
				'default' => TimeUnit::DAYS,
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, TimeUnit::cases(), TimeUnit::DAYS),
			],
			self::REMINDER_TIME_PERIOD => [
				'sanitize_callback' => 'absint',
				'default' => 1,
			],
			self::REMINDER_TIME_UNIT => [
				'default' => TimeUnit::WEEKS,
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, TimeUnit::cases(), TimeUnit::WEEKS),
			],
			self::EMAIL_FROM_NAME => [
				'sanitize_callback' => 'sanitize_text_field',
				'default' => get_bloginfo('name'),
			],
			self::EMAIL_FROM_ADDRESS => [
				'sanitize_callback' => 'sanitize_email',
			],
			self::REMINDER_EMAIL_BCC => [
				'sanitize_callback' => 'sanitize_email',
			],
			self::REVIEW_EMAIL_CONTENT => [],
			self::REMINDER_EMAIL_CONTENT => [],
			self::REVIEW_EMAIL_SUBJECT => [
				'sanitize_callback' => 'sanitize_text_field',
			],
			self::REMINDER_EMAIL_SUBJECT => [
				'sanitize_callback' => 'sanitize_text_field',
			],
			self::MODAL_FOOTER_CONTENT => [],
			self::SHOW_INTERNAL_DATA_ON_REVIEW => [
				'sanitize_callback' => fn ($value) => ! empty($value) ? 1 : 0,
			],
		];

		foreach ($settings as $key => $config) {
			$config = wp_parse_args(
				$config,
				[
					'type' => 'string',
					'label' => '',
					'description' => '',
					'sanitize_callback' => null,
					'show_in_rest' => true,
					'default' => null,
				]
			);

			register_setting(self::OPTION_GROUP, $key, $config);
		}
	}

	public function sanitizeEnum(string $value, array $allowedValues, string $default): string
	{
		return in_array($value, $allowedValues, true) ? $value : $default;
	}
}
