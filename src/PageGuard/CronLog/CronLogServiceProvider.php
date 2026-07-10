<?php

declare(strict_types=1);

namespace Yard\PageGuard\CronLog;

use Yard\PageGuard\Foundation\ServiceProvider;

class CronLogServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		(new CronLog())->register();
		(new CronLogRecorder())->register();
		(new CronLogRetention())->register();
	}
}
