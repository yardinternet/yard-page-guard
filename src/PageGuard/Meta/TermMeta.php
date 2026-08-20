<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy;

class TermMeta
{
	public const EXTERNAL_CONTENT_OWNER_PHONE_NUMBER = 'ypg_external_content_owner_phone_number';
	public const EXTERNAL_CONTENT_OWNER_EMAIL = 'ypg_external_content_owner_email';

	public function registerMeta(): void
	{
		$metaFields = [
			self::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER => [
				'type' => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default' => '',
			],
			self::EXTERNAL_CONTENT_OWNER_EMAIL => [
				'type' => 'string',
				'sanitize_callback' => 'sanitize_email',
				'default' => '',
			],
		];

		foreach ($metaFields as $metaKey => $args) {
			register_term_meta(
				ExternalOwnerTaxonomy::TAXONOMY,
				$metaKey,
				$args
			);
		}
	}
}
