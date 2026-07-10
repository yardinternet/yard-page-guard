<?php

declare(strict_types=1);

namespace Yard\PageGuard\EmailLog;

use Yard\PageGuard\Foundation\ServiceProvider;

class EmailLogServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		(new EmailLog())->register();
		(new EmailLogRecorder())->register();
		(new EmailLogRetention())->register();
	}
}
