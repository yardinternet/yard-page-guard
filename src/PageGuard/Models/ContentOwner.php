<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Enums\TermMeta;

class ContentOwner
{
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
		if ('ypg_external_content_owner' !== $term->taxonomy) {
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

	/**
	 * Returns the owner's salutation with capitalized name parts.
	 */
	public function salutation(): string
	{
		$name = $this->firstName() ?: $this->name;
		$nameParts = explode(' ', $name);
		$capitalizedParts = array_map('ucfirst', $nameParts);

		return implode(' ', $capitalizedParts);
	}

	public function firstName(): string
	{
		$nameParts = explode(' ', $this->name);

		return isset($nameParts[0]) ? $nameParts[0] : '';
	}
}
