<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\TermMeta;
use Yard\PageGuard\Taxonomy\ExternalOwnerTaxonomy;

class ContentOwner
{
	public const COMBINED_ID_SEPARATOR = ':';
	protected int $id; // Not unique (either WP user ID or external user tax term ID)
	protected string $name;
	protected string $email;
	protected string $type;
	protected string $phone;

	private function __construct(int $id, string $name, string $email, string $type, string $phone = '')
	{
		$this->id = $id;
		$this->name = $name;
		$this->email = $email;
		$this->type = $type;
		$this->phone = $phone;
	}

	public static function fromCombinedId(string $combinedId): ?self
	{
		[$type, $id] = explode(self::COMBINED_ID_SEPARATOR, $combinedId, 2);

		if (ContentOwnerType::USER === $type) {
			$user = get_user_by('id', (int) $id);
			if (! $user) {
				return null;
			}

			return self::fromUser($user);
		}
		if (ContentOwnerType::EXTERNAL === $type) {
			$term = get_term((int) $id, ExternalOwnerTaxonomy::TAXONOMY);
			if (! $term || is_wp_error($term)) {
				return null;
			}

			return self::fromTerm($term);
		} else {
			return null;
		}
	}

	public static function fromUser(\WP_User $user): self
	{
		return new self(
			$user->ID,
			$user->display_name,
			$user->user_email,
			ContentOwnerType::USER,
			''
		);
	}

	public static function fromTerm(\WP_Term $term): self
	{
		// check if term is of type external_content_owner, otherwise throw exception
		if (ExternalOwnerTaxonomy::TAXONOMY !== $term->taxonomy) {
			throw new \InvalidArgumentException("Term is not of type external_content_owner: {$term->taxonomy}");
		}

		return new self(
			$term->term_id,
			$term->name,
			get_term_meta($term->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_EMAIL, true) ?: '',
			ContentOwnerType::EXTERNAL,
			get_term_meta($term->term_id, TermMeta::EXTERNAL_CONTENT_OWNER_PHONE_NUMBER, true) ?: ''
		);
	}

	public function combinedId(): string
	{
		return $this->type . self::COMBINED_ID_SEPARATOR . $this->id;
	}

	public function id(): int
	{
		return $this->id;
	}

	public function name(): string
	{
		return $this->name;
	}

	public function displayName(): string
	{
		return ContentOwnerType::EXTERNAL === $this->type ? $this->name . ' (extern)' : $this->name;
	}

	public function email(): string
	{
		return $this->email;
	}

	public function phone(): string
	{
		return $this->phone;
	}

	public function type(): string
	{
		return $this->type;
	}
}
