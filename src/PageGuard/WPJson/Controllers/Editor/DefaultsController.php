<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Settings\Settings;
use Yard\PageGuard\Traits\Date;

/**
 * Returns the site wide review and reminder defaults, so the editor can show
 * what "volgens de standaardinstelling" resolves to without duplicating the
 * settings logic in JavaScript.
 */
class DefaultsController
{
	use Date;

	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		return new WP_REST_Response([
			'review' => $this->period(
				(int) get_option(Settings::REVIEW_TIME_PERIOD, 1),
				(string) get_option(Settings::REVIEW_TIME_UNIT, 'weeks')
			),
			'reminder' => $this->period(
				(int) get_option(Settings::REMINDER_TIME_PERIOD, 1),
				(string) get_option(Settings::REMINDER_TIME_UNIT, 'weeks')
			),
		]);
	}

	/**
	 * @return array<string, mixed>
	 */
	private function period(int $period, string $unit): array
	{
		$reminderInterval = \DateInterval::createFromDateString("{$period} {$unit}");
		$date = (new \DateTime('now', wp_timezone()))->add($reminderInterval);

		return [
			'period' => $period,
			'unit' => $unit,
			'label' => $this->formatPeriod($period, $unit),
			'date' => $date->format('Y-m-d'),
			'formatted' => wp_date(get_option('date_format', 'd-m-Y'),  $date->getTimestamp()),
		];
	}
}
