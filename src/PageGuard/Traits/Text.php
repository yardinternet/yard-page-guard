<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

use Yard\PageGuard\Models\ContentOwner;

trait Text
{
	/**
	 * @param array<string, string> $values
	 */
	private function replacePlaceholders(string $content, array $values): string
	{
		foreach ($values as $key => $value) {
			$content = str_replace('{' . $key . '}', $value, $content);
		}

		return $content;
	}

	private static function minifyHtml(string $html): string
	{
		$html = preg_replace('/\s+/', ' ', $html);
		$html = preg_replace('/>\s+</', '><', $html);

		return trim($html);
	}

	private static function getUnitOptions(): array
	{
		return ['days' => __('Dagen', 'yard-page-guard'), 'weeks' => __('Weken', 'yard-page-guard'), 'months' => __('Maanden', 'yard-page-guard')];
	}

	/**
	 * @throws \InvalidArgumentException
	 */
	private function parseContentOwnerData(string $contentOwner): ContentOwner
	{
		return ContentOwner::fromString($contentOwner);
	}
}
