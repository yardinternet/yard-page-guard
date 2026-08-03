<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use Yard\PageGuard\Enums\PostMeta;

class Meta
{
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
}
