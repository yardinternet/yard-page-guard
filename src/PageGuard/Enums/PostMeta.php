<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

class PostMeta
{
	public const POST_CONTENT_OWNER_ID = 'ypg_post_content_owner_id';
	/** @deprecated	 */
	public const POST_CONTENT_OWNER_NAME = 'ypg_post_content_owner_name';
	/** @deprecated */
	public const POST_CONTENT_OWNER_EMAIL = 'ypg_post_content_owner_email';
	public const POST_CONTENT_OWNER_TYPE = 'ypg_post_content_owner_type';
	/** @deprecated */
	public const POST_CONTENT_OWNER_PHONE_NUMBER = 'ypg_post_content_owner_phone_number';

	public const REVIEW_DATE_TYPE = 'ypg_review_date_type';
	public const REVIEW_DATE = 'ypg_review_date';
	public const REMINDER_DATE = 'ypg_reminder_date';
	/** @deprecated */
	public const IS_VERIFIED = 'ypg_is_verified';

	public const REMINDER_TIME_TYPE = 'ypg_reminder_time_type';
	public const REMINDER_TIME_PERIOD = 'ypg_reminder_time_period';
	public const REMINDER_TIME_UNIT = 'ypg_reminder_time_unit';
	public const REVIEW_MAIL_SENT = 'ypg_review_mail_sent';
	public const LAST_REVIEW_DATE = 'ypg_last_review_date';
	public const LAST_REMINDER_DATE = 'ypg_last_reminder_date';

	public static function all(): array
	{
		return [
			self::POST_CONTENT_OWNER_ID,
			self::POST_CONTENT_OWNER_NAME,
			self::POST_CONTENT_OWNER_EMAIL,
			self::POST_CONTENT_OWNER_TYPE,
			self::POST_CONTENT_OWNER_PHONE_NUMBER,
			self::REVIEW_DATE,
			self::REMINDER_DATE,
			self::IS_VERIFIED,
			self::REMINDER_TIME_PERIOD,
			self::REMINDER_TIME_UNIT,
			self::REVIEW_MAIL_SENT,
			self::LAST_REVIEW_DATE,
			self::LAST_REMINDER_DATE,
		];
	}
}
