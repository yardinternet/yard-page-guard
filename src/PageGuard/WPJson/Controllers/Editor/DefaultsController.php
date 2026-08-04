<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers\Editor;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Enums\Options;
use Yard\PageGuard\Meta\MetaFields;
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
				(int) get_option(Options::REVIEW_TIME_PERIOD, 1),
				(string) get_option(Options::REVIEW_TIME_UNIT, 'weeks')
			),
			'reminder' => $this->period(
				(int) get_option(Options::REMINDER_TIME_PERIOD, 1),
				(string) get_option(Options::REMINDER_TIME_UNIT, 'weeks')
			),
		]);
	}

	/**
	 * @return array<string, mixed>
	 */
	private function period(int $period, string $unit): array
	{
		$period = max(1, $period);
		$unit = in_array($unit, MetaFields::TIME_UNITS, true) ? $unit : 'weeks';

		$date = $this->addPeriodToBase(current_time('Y-m-d'), $period, $unit);

		return [
			'period' => $period,
			'unit' => $unit,
			'label' => $this->formatPeriod($period, $unit),
			'date' => $date,
			'formatted' => $this->formatDate($date),
		];
	}
}
