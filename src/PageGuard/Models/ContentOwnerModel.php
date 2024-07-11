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
     * Returns the user's salutation with capitalized name parts.
     * Tries the first name first; if not available, uses the username.
     */
    public function salutation(): string
    {
        $name = $this->firstName() ?: $this->user->user_login;
        $nameParts = explode(' ', $name);
        $capitalizedParts = array_map('ucfirst', $nameParts);

        return implode(' ', $capitalizedParts);
    }

    public function firstName(): string
    {
        $firstName = get_user_meta($this->id(), 'first_name', true);

        return is_string($firstName) && ! empty($firstName) ? $firstName : '';
    }
}
