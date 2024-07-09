<?php

namespace Yard\PageGuard\Support\Traits;

trait EditPostLink
{
    public function editPostLink(int $postID, string $postType): string
    {
        $postTypeObject = get_post_type_object($postType);

        if (! $postTypeObject) {
            return '';
        }

        return admin_url(sprintf($postTypeObject->_edit_link . '&action=edit', $postID));
    }
}
