<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use Yard\PageGuard\Enums\ContentOwnerType;

class ContentOwner
{
	protected int $id; // Not unique (either WP user ID or external user tax term ID)
	protected string $name;
	protected string $email;
	protected string $type;

	public function __construct(int $id, string $name, string $email, string $type)
	{
		$this->id = $id;
		$this->name = $name;
		$this->email = $email;

		if (! ContentOwnerType::isValid($type)) {
			throw new \InvalidArgumentException("Invalid content owner type: $type");
		}
		
		$this->type = $type;
	}

	public function id(): int
	{
		return $this->id;
	}

	public function name(): string
	{
		return $this->name;
	}

	public function email(): string
	{
		return $this->email;
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
