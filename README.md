# Yard Page Guard

## Description

Assign content owners to WordPress pages (or other post types), allowing them to mark pages as 'verified' and receive automated review reminders based on user-defined dates.

## Installation through `/wp-admin`

1. Upload [plugin .zip](https://github.com/yardinternet/yard-page-guard/archive/refs/heads/main.zip) through the 'Upload plugin' button
2. Activate the plugin

## Installation through Composer

1. Install this package with Composer:

```
composer require plugin/yard-page-guard
```

2. Activate the plugin through the 'Plugins' menu in WordPress

## Security

Access to the metaboxes is granted to all users with the `edit_pages` capability initially. Once an author and content owner are connected to a post object, only these two entities will have access. Besides that, admin roles (see item #3 under the Hooks paragraph) also have access to the metaboxes. As well as the admin overview

## Configuration

Add the following constants to `wp-config.php` as needed. All constants fall back to `$_ENV` equivalents.

### Authentication salt

Used to sign review tokens. For a cross-site PDC/Pub connection this value must be identical on all connected sites.

```php
define('YPG_AUTH_SALT', 'your-secret-salt');
```

Falls back to `$_ENV['YPG_AUTH_SALT']`, then the WordPress core `AUTH_SALT` constant, and then `$_ENV['AUTH_SALT']`.

### External endpoint URLs (Fusion PDC / OpenPub)

Required when this site connects to an external Fusion PDC or OpenPub installation.

```php
define('OPENPDC_ENDPOINT', 'https://pdc.example.com/');
define('OPENPUB_ENDPOINT', 'https://pub.example.com/');
```

Falls back to `$_ENV['OPENPDC_ENDPOINT']` / `$_ENV['OPENPUB_ENDPOINT']`.

## Hooks

1. Post types which will have the page guard metaboxes registered:

```php
add_filter('yard::page-guard/post-types-to-use', function (array $postTypes): array {
  return array_merge($postTypes, ['custom_post_type']);
});
```

2. Post statuses that will be used to find posts and the associated content owners who need to receive a notification:

```php
add_filter('yard::page-guard/post-statusses-to-use', function (array $statuses): array {
  return array_merge($statuses, ['private']);
});
```

3. Roles that are allowed to bypass (in addition to the post author and content owner):

```php
add_filter('yard::page-guard/admin-roles', function (array $roles): array {
  return array_merge($roles, ['editor']);
});
```

4. Override the login name of the dummy WordPress user whose admin bar is hidden on the review modal:

```php
add_filter('yard::page-guard/review-user-login', function (string $login): string {
  return 'ypg_review_user';
});
```

5. Disable writing content owner information to internal data fields (Fusion Portal, Fusion PDC, Brave/ACF):

```php
add_filter('yard::page-guard/enable-internal-data-sync', '__return_false');
```

6. Fires after content owner information has been written to internal data fields:

```php
add_action('yard::page-guard/after-internal-data-synced', function (int $postId, string $ownerLink, string $title): void {
  // your code here
}, 10, 3);
```

7. Fires after content owner information has been removed from internal data fields:

```php
add_action('yard::page-guard/after-internal-data-removed', function (int $postId): void {
  // your code here
});
```

4. Modify the review permalink 

```php
apply_filters('yard::page-guard/review-permalink', get_permalink($this->ID()), $this->ID());
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

## About us

[![banner](https://raw.githubusercontent.com/yardinternet/.github/refs/heads/main/profile/assets/small-banner-github.svg)](https://www.yard.nl/werken-bij/)
