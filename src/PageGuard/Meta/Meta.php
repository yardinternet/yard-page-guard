<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\ReminderTimeType;
use Yard\PageGuard\Enums\ReviewDateType;
use Yard\PageGuard\Enums\TimeUnit;

class Meta
{
	public const POST_CONTENT_OWNER_ID = 'ypg_post_content_owner_id';
	public const POST_CONTENT_OWNER_TYPE = 'ypg_post_content_owner_type';
	public const REVIEW_DATE_TYPE = 'ypg_review_date_type';
	public const REVIEW_DATE = 'ypg_review_date';
	public const REMINDER_DATE = 'ypg_reminder_date';
	public const REMINDER_TIME_TYPE = 'ypg_reminder_time_type';
	public const REMINDER_TIME_PERIOD = 'ypg_reminder_time_period';
	public const REMINDER_TIME_UNIT = 'ypg_reminder_time_unit';
	public const REVIEW_MAIL_SENT = 'ypg_review_mail_sent';
	public const LAST_REVIEW_DATE = 'ypg_last_review_date';
	public const LAST_REMINDER_DATE = 'ypg_last_reminder_date';

	public function registerMeta(): void
	{
		//TODO: set default values
		$metaFields = [
			self::POST_CONTENT_OWNER_ID => [
				'type' => 'integer',
				'sanitize_callback' => 'absint',
			],
			self::POST_CONTENT_OWNER_TYPE => [
				'type' => 'string',
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, ContentOwnerType::cases(), ''),
			],
			self::REVIEW_DATE_TYPE => [
				'type' => 'string',
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, ReviewDateType::cases(), ReviewDateType::DEFAULT),
				'default' => ReviewDateType::DEFAULT,
			],
			self::REVIEW_DATE => [
				'type' => 'string',
				'sanitize_callback' => [$this, 'sanitizeDate'],
			],
			self::REMINDER_TIME_TYPE => [
				'type' => 'string',
				'default' => ReminderTimeType::DEFAULT,
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, ReminderTimeType::cases(), ReminderTimeType::DEFAULT),
			],
			self::REMINDER_TIME_PERIOD => [
				'type' => 'integer',
				'sanitize_callback' => 'absint',
				'default' => 1,
			],
			self::REMINDER_TIME_UNIT => [
				'type' => 'string',
				'default' => TimeUnit::WEEKS,
				'sanitize_callback' => fn ($value) => $this->sanitizeEnum($value, TimeUnit::cases(), TimeUnit::WEEKS),
			],
			self::LAST_REMINDER_DATE => [
				'type' => 'string',
				'sanitize_callback' => [$this, 'sanitizeDate'],
			],
			self::LAST_REVIEW_DATE => [
				'type' => 'string',
				'sanitize_callback' => [$this, 'sanitizeDate'],
			],
		];

		foreach ($metaFields as $key => $config) {
			$config = wp_parse_args(
				$config,
				[
					'object_subtype' => '',
					'type' => 'string',
					'label' => '',
					'description' => '',
					'single' => false,
					'sanitize_callback' => null,
					'auth_callback' => fn () => current_user_can('edit_posts'),
					'show_in_rest' => false,
					'revisions_enabled' => false,
				]
			);
			//FIXME: loop over supported post types
			register_post_meta('', $key, $config);
		}
	}

	public function sanitizeEnum(string $value, array $allowedValues, string $defaultValue = ''): string
	{
		if (! in_array($value, $allowedValues, true)) {
			return $defaultValue;
		}

		return $value;
	}

	public function sanitizeDate(string $value): string
	{
		$date = \DateTime::createFromFormat('Y-m-d', $value);
		if (! $date) {
			return '';
		}

		return $date->format('Y-m-d');
	}
}
