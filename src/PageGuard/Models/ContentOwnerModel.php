<?php

namespace Yard\PageGuard\Models;

use WP_User;

class ContentOwnerModel
{
	protected WP_User $user;

	public function __construct(WP_User $user)
	{
		$this->user = $user;
	}

	public function ID(): int
	{
		return $this->user->ID;
	}

	public function email()
	{
		return $this->user->user_email;
	}

	/**
	 * Tries the firstname first, otherwise the username.
	 */
	public function salutation(): string
	{
		return $this->firstName() ? $this->firstName() : $this->user->user_login;
	}

	public function firstName(): string
	{
		$firstName = get_user_meta($this->id(), 'first_name', true);

		return is_string($firstName) && ! empty($firstName) ? $firstName : '';
	}
}
