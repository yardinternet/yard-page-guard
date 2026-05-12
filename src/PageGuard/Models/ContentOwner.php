<?php

declare(strict_types=1);

namespace Yard\PageGuard\Models;

use InvalidArgumentException;
use Yard\PageGuard\Enums\ContentOwnerType;

/**
 * Immutable value object describing the content owner of a post.
 *
 * Construction enforces the invariants that callers previously had to check by hand:
 * - $type must be a known {@see ContentOwnerType} value.
 * - $name and $email must be non-empty trimmed strings.
 * - $id must be positive (WP user IDs and taxonomy term IDs are both positive).
 *
 * Phone number is optional and may be an empty string.
 *
 * Once constructed, an instance is guaranteed to represent a valid owner — whether it
 * was reconstructed from stored post meta or parsed from a form payload.
 */
final class ContentOwner
{
	private int $id;
	private string $name;
	private string $email;
	private string $type;
	private string $phoneNumber;

	/**
	 * @throws InvalidArgumentException when any field violates the invariants above.
	 */
	public function __construct(int $id, string $name, string $email, string $type, string $phoneNumber = '')
	{
		if (0 >= $id) {
			throw new InvalidArgumentException(sprintf('Content owner id must be positive, got %d.', $id));
		}

		$name = trim($name);
		if ('' === $name) {
			throw new InvalidArgumentException('Content owner name must not be empty.');
		}

		$email = trim($email);
		if ('' === $email) {
			throw new InvalidArgumentException('Content owner email must not be empty.');
		}

		$this->id = $id;
		$this->name = $name;
		$this->email = $email;
		$this->type = ContentOwnerType::from($type);
		$this->phoneNumber = trim($phoneNumber);
	}

	/**
	 * Reconstruct a {@see ContentOwner} from a post's stored meta. Returns null when
	 * no owner is stored or when the stored values cannot form a valid owner.
	 */
	public static function fromPostMeta(int $postId): ?self
	{
		$id = get_post_meta($postId, 'ypg_post_content_owner_id', true);
		$name = get_post_meta($postId, 'ypg_post_content_owner_name', true);
		$email = get_post_meta($postId, 'ypg_post_content_owner_email', true);
		$type = get_post_meta($postId, 'ypg_post_content_owner_type', true);
		$phoneNumber = get_post_meta($postId, 'ypg_post_content_owner_phone_number', true);

		if ('' === $id || false === $id || null === $id) {
			return null;
		}

		try {
			return new self((int) $id, (string) $name, (string) $email, (string) $type, (string) $phoneNumber);
		} catch (InvalidArgumentException $e) {
			return null;
		}
	}

	/**
	 * Parse the pipe-separated payload coming from the metabox / quick-edit / bulk-edit forms.
	 * Format: "{id}|{name}|{email}|{type}|{phoneNumber?}".
	 *
	 * @throws InvalidArgumentException when the payload is malformed or its fields are invalid.
	 */
	public static function fromString(string $packed): self
	{
		$parts = explode('|', $packed);

		if (count($parts) < 4) {
			throw new InvalidArgumentException('[yard-page-guard] Invalid content owner data format.');
		}

		return new self(
			(int) $parts[0],
			(string) $parts[1],
			(string) $parts[2],
			(string) $parts[3],
			(string) ($parts[4] ?? '')
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

	public function email(): string
	{
		return $this->email;
	}

	public function type(): string
	{
		return $this->type;
	}

	public function phoneNumber(): string
	{
		return $this->phoneNumber;
	}

	public function isExternal(): bool
	{
		return ContentOwnerType::EXTERNAL === $this->type;
	}

	public function isUser(): bool
	{
		return ContentOwnerType::USER === $this->type;
	}

	/**
	 * Returns the owner's salutation with capitalized name parts.
	 */
	public function salutation(): string
	{
		$name = $this->firstName() ?: $this->name;
		$capitalizedParts = array_map('ucfirst', explode(' ', $name));

		return implode(' ', $capitalizedParts);
	}

	public function firstName(): string
	{
		$nameParts = explode(' ', $this->name);

		return $nameParts[0] ?? '';
	}
}
