<?php

namespace Yard\PageGuard\Support\Traits;

trait Placeholder
{
    public function replacePlaceholders(string $content, array $values): string
    {
        foreach ($values as $i => $value) {
            $content = str_replace('{' . ($i + 1) . '}', $value, $content);
        }

        return $content;
    }
}
