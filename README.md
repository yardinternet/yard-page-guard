# Yard Page Guard

- Tags: content owners, notifications
- Requires at least: 6.4
- Tested up to: 6.8.3
- Requires PHP: 7.4
- Stable tag: 1.1.0
- License: EUPL v.1.2
- License URI: <https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12>

## Description

Assign content owners to WordPress pages (or other post types), allowing them to mark pages as 'verified' and receive automated review reminders based on user-defined dates.

## Installation

1. Upload plugin directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

## Installation Brave

1. Add the following to the repositories section of your composer.json:

```json
{
	"type": "vcs",
	"url": "git@github.com:yardinternet/yard-page-guard.git"
}
```

2. Install this package with Composer:

```
composer require plugin/yard-page-guard
```

3. Activate the plugin through the 'Plugins' menu in WordPress

## Security

Access to the metaboxes is granted to all users with the `edit_pages` capability initially. Once an author and content owner are connected to a post object, only these two entities will have access.

## Hooks

1. Post types which will have the page guard metaboxes registered:

```php
apply_filters('yard::page-guard/post-types-to-use', ['page']);
```

2. Post statuses that will be used to find posts and the associated content owners who need to receive a notification.:

```php
apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']);
```

## Local Development

The scheduled event `ypg_site_cron` is executed once a day, which can make testing a bit difficult. However, you can temporarily alter the code in your local development environment to make testing easier.
Inside the `register` method of the `Yard\PageGuard\WPCron\WPCronServiceProvider` class, the event is scheduled as follows:

```php
wp_schedule_event($this->timeToExecute(), 'daily', 'ypg_site_cron');
```

To make testing easier, first ensure you use the filter below before scheduling the event:

```php
  add_filter('cron_schedules', function ($schedules) {
   $schedules['five_seconds'] = [
    'interval' => 5,
    'display' => '5 seconden',
   ];

   return $schedules;
  });
```

Then schedule the event like this:

```php
wp_schedule_event(time(), 'five_seconds', 'ypg_site_cron');
```

The event will be executed every 5 seconds. Make sure your local development environment intercepts the sent emails.
Don't forget to configure a post so that a notification is sent to the configured content owner.
