<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

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
				'sanitize' => 'absint'
			],
			self::POST_CONTENT_OWNER_TYPE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field', //TODO: sanitize callback should validate against allowed values
				],
			self::REVIEW_DATE_TYPE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field',
				'default' => 'default'
				], // FIXME: sanitize callback should validate against allowed values
			self::REVIEW_DATE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field'
			],
			self::REMINDER_TIME_TYPE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field',
				'default' => 'default'
			], //FIXME: sanitize callback should validate against allowed values
			self::REMINDER_TIME_PERIOD => [
				'type' => 'integer',
				'sanitize' => 'absint',
				'default' => 1
			],
			self::REMINDER_TIME_UNIT => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field',
				'default' => TimeUnit::WEEKS
			], //FIXME: sanitize callback should validate against allowed values
			self::LAST_REMINDER_DATE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field'
			], //TODO: sanitize date
			self::LAST_REVIEW_DATE => [
				'type' => 'string',
				'sanitize' => 'sanitize_text_field'
			], // TODO: sanitize date
		];

		foreach ($metaFields as $key => $config) {
			$config = wp_parse_args(
				$config,
				[
					'object_subtype'    => '',
					'type'              => 'string',
					'label'             => '',
					'description'       => '',
					'default'           => '',
					'single'            => false,
					'sanitize_callback' => null,
					'auth_callback'     => fn() => current_user_can('edit_posts'),
					'show_in_rest'      => false,
					'revisions_enabled' => false,
				]
			);
			register_post_meta('page', $key, $config);
		}
	}
}
