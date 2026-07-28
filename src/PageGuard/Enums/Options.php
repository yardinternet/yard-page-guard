<?php

declare(strict_types=1);

namespace Yard\PageGuard\Enums;

class Options
{
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
}
