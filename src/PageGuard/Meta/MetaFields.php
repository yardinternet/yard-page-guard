<?php

declare(strict_types=1);

namespace Yard\PageGuard\Meta;

use DateTime;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\PostMeta;

/**
 * Single source of truth for the post meta the block editor reads and writes.
 *
 * Every field declares its own type, default, sanitization and REST schema, so
 * adding a field to the editor is a matter of adding one entry here. Values are
 * validated twice on purpose: the REST schema rejects bad requests before they
 * reach the database, the sanitize callback also covers writes coming from PHP.
 */
class MetaFields
{
	public const DATE_TYPE_DEFAULT = 'default';
	public const DATE_TYPE_CUSTOM = 'custom';

	public const DATE_TYPES = [
		self::DATE_TYPE_DEFAULT,
		self::DATE_TYPE_CUSTOM,
	];

	public const TIME_UNITS = [
		'days',
		'weeks',
		'months',
	];

	public const OWNER_TYPES = [
		ContentOwnerType::USER,
		ContentOwnerType::EXTERNAL,
	];

	/**
	 * Pattern shared by the date fields: an empty string (not set) or Y-m-d.
	 */
	private const DATE_PATTERN = '^(\d{4}-\d{2}-\d{2})?$';

	/**
	 * @return array<string, array<string, mixed>>
	 */
	public static function all(): array
	{
		return [
			/**
			 * Either a WP user ID or an ypg_external_content_owner term ID. Which
			 * one it is, is stored separately in POST_CONTENT_OWNER_TYPE, so this
			 * value stays a plain integer for meta queries and owner lookups.
			 */
			PostMeta::POST_CONTENT_OWNER_ID => [
				'type' => 'integer',
				'default' => 0,
				'sanitize_callback' => 'absint',
				'schema' => [ 'minimum' => 0 ],
			],
			PostMeta::POST_CONTENT_OWNER_TYPE => [
				'type' => 'string',
				'default' => '',
				'sanitize_callback' => fn ($value) => self::sanitizeEnum($value, self::OWNER_TYPES),
				'schema' => [ 'enum' => array_merge([''], self::OWNER_TYPES) ],
			],
			PostMeta::REVIEW_DATE_TYPE => [
				'type' => 'string',
				'default' => self::DATE_TYPE_DEFAULT,
				'sanitize_callback' => fn ($value) => self::sanitizeEnum($value, self::DATE_TYPES, self::DATE_TYPE_DEFAULT),
				'schema' => [ 'enum' => self::DATE_TYPES ],
			],
			PostMeta::REVIEW_DATE => [
				'type' => 'string',
				'default' => '',
				'sanitize_callback' => fn ($value) => self::sanitizeDate($value),
				'schema' => [ 'pattern' => self::DATE_PATTERN ],
			],
			PostMeta::REMINDER_TIME_TYPE => [
				'type' => 'string',
				'default' => self::DATE_TYPE_DEFAULT,
				'sanitize_callback' => fn ($value) => self::sanitizeEnum($value, self::DATE_TYPES, self::DATE_TYPE_DEFAULT),
				'schema' => [ 'enum' => self::DATE_TYPES ],
			],
			PostMeta::REMINDER_TIME_PERIOD => [
				'type' => 'integer',
				'default' => 0,
				'sanitize_callback' => 'absint',
				'schema' => [ 'minimum' => 0 ],
			],
			PostMeta::REMINDER_TIME_UNIT => [
				'type' => 'string',
				'default' => '',
				'sanitize_callback' => fn ($value) => self::sanitizeEnum($value, self::TIME_UNITS),
				'schema' => [ 'enum' => array_merge([''], self::TIME_UNITS) ],
			],
			/**
			 * Written by the review flow, never by the editor. Exposed read only so
			 * the sidebar can show when the page was last checked.
			 */
			PostMeta::LAST_REVIEW_DATE => [
				'type' => 'string',
				'default' => '',
				'sanitize_callback' => fn ($value) => self::sanitizeDate($value),
				'schema' => [ 'pattern' => self::DATE_PATTERN, 'readonly' => true ],
			],
		];
	}

	/**
	 * Returns the value when it is one of the allowed values, the fallback otherwise.
	 */
	private static function sanitizeEnum($value, array $allowed, string $fallback = ''): string
	{
		$value = sanitize_text_field((string) $value);

		return in_array($value, $allowed, true) ? $value : $fallback;
	}

	/**
	 * Returns a Y-m-d date, or an empty string when the value is not a real date.
	 */
	private static function sanitizeDate($value): string
	{
		$value = sanitize_text_field((string) $value);

		if ('' === $value) {
			return '';
		}

		$date = DateTime::createFromFormat('Y-m-d', $value);

		return $date && $date->format('Y-m-d') === $value ? $value : '';
	}
}
