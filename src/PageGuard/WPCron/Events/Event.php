<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPCron\Events;

abstract class Event
{
	public static function init(): void
	{
		(new static())->execute();
	}

	abstract protected function execute(): void;
}
