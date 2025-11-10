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

    private static function minifyHtml(string $html): string
    {
        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);

        return trim($html);
    }


    /**
     * @throws \InvalidArgumentException
     */
    private function parseContentOwnerData(string $contentOwner): array
    {
        $ownerData = explode('|', $contentOwner);

        if (count($ownerData) !== 4) {
            throw new \InvalidArgumentException('Invalid content owner data format.');
        }

        return [
            'id' => $ownerData[0] ?? '',
            'name' => $ownerData[1] ?? '',
            'email' => $ownerData[2] ?? '',
            'type' => $ownerData[3] ?? '',
        ];
    }
}
