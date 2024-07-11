<?php

namespace Yard\PageGuard\Support\Traits;

use WP_User;
use Yard\PageGuard\Models\ContentOwnerModel;

trait User
{
    /**
     * @return string|ContentOwnerModel
     */
    public function userToModel(int $userID): ?ContentOwnerModel
    {
        $user = get_user_by('ID', $userID);

        if (! $user instanceof WP_User) {
            return null;
        }

        return new ContentOwnerModel($user);
    }
}
