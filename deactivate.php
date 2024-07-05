<?php

function deactivate(): void
{
	$timestamp = wp_next_scheduled('ypg_site_cron');
	wp_unschedule_event($timestamp, 'ypg_site_cron');
}
