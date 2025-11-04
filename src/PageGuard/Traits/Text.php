<?php

namespace Yard\PageGuard\Traits;

trait Text
{
    /**
     * @param array<int, string> $values
     */
    private function replacePlaceholders(string $content, array $values): string
    {
        foreach ($values as $i => $value) {
            $content = str_replace('{' . ($i + 1) . '}', $value, $content);
        }

        return $content;
    }

    private function minifyHtml(string $html): string
    {
        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);

        return trim($html);
    }
}
