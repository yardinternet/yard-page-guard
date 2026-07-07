# Yard Page Guard

Assign a content owner to every WordPress page (or any other post type you opt in), schedule a review date, and let the plugin email the owner when the content is due for a check. Owners can confirm a page is still accurate from the live site with a single signed click — no WordPress login required.

## Requirements

- PHP `>= 7.4`
- WordPress (tested on the current major release)
- For PDC/Pub cross-site setups: a shared `YPG_AUTH_SALT` (a `wp-config.php` constant or environment variable)

## Installation

### Through Composer (recommended)

```
composer require plugin/yard-page-guard
```

Then activate the plugin via **Plugins → Installed Plugins** in `/wp-admin`.

### Through `/wp-admin`

1. Upload the [plugin .zip](https://github.com/yardinternet/yard-page-guard/archive/refs/heads/main.zip) via **Plugins → Add New → Upload Plugin**.
2. Activate.

## How it works

Two types of **content owners** can be assigned to a post:

- a **WordPress user** with the `edit_pages` capability, or
- an **external owner**, stored as a term in the `ypg_external_content_owner` taxonomy with an email and optional phone number.

When you assign an owner and check **Gecontroleerd?** in the metabox, the plugin stores a **review date** (next time the page needs a check) and a **reminder date** that follows it. Both dates are computed from the site-wide period/unit settings, or per-post overrides for the reminder.

A daily cron (`ypg_site_cron`, default 06:00 in the site timezone — configurable via the **Tijdstip van versturen** setting) does two things:

1. **Review notification** — for every post whose `ypg_review_date` is today or earlier and that has not yet been notified, email the owner a list of pages to review. Each link carries an HMAC-signed token (`ypg_review_token`) so the owner can confirm the page from the public side.
2. **Reminder notification** — for every post whose `ypg_reminder_date` has passed, send a follow-up. Reminders use the per-post period/unit override if set, otherwise the site default.

The same cron sweeps the email log (see below), purging entries older than the configured retention window.

When the owner clicks **Gecontroleerd en akkoord** on the review modal, the `verify-post` REST endpoint flips the post back to verified and rolls both dates forward.

The plugin also mirrors the assigned owner into a few third-party fields used by Yard themes/plugins (Fusion portal, Fusion PDC, Brave ACF) so editors see the owner alongside other internal page info.

## Configuration

Most behavior is configurable from **Inhoudseigenarenmodule → Instellingen** (`/wp-admin/options-general.php?page=page-guard-settings`):

- **Email afzender** — from name, from address, optional BCC for reminders.
- **Periodes** — review period + unit (`days` / `weeks` / `months`), reminder period + unit, and the daily send time.
- **Herzieningsmail** + **Herinneringsmail** — subject and body. Bodies are edited in WordPress' bundled TinyMCE editor with `{name}` (owner salutation) and `{item_list}` (item list) placeholder chips in the toolbar.
- **Controleer venster** — modal footer shown on the verify-page modal. The footer editor also exposes a **▢ Knop** toolbar action that wraps selected text in `<a class="ypg-button">…</a>` for the styled call-to-action.
- **Toegang** — `Show internal data on review`: when enabled, an unauthenticated reviewer is briefly logged in as a dedicated `ypg_review_user` so internal-only blocks render during the review.

The **Inhoudseigenarenmodule** menu (`/wp-admin/admin.php?page=ypg-overview`) groups four pages: the overview itself (every page with an assigned owner, with overdue flags and a bulk-edit form), the **Externe inhoudseigenaren** taxonomy, the **Email log**, and **Instellingen**.

### wp-config.php constants

A few values are read from `wp-config.php` constants, each falling back to its `$_ENV` equivalent.

**Authentication salt** — signs review tokens. For a cross-site PDC/Pub connection this value must be identical on all connected sites.

```php
define('YPG_AUTH_SALT', 'your-secret-salt');
```

Falls back to `$_ENV['YPG_AUTH_SALT']`, then the WordPress core `AUTH_SALT` constant, and then `$_ENV['AUTH_SALT']`.

**External endpoint URLs (Fusion PDC / OpenPub)** — required when this site connects to an external Fusion PDC or OpenPub installation.

```php
define('OPENPDC_ENDPOINT', 'https://pdc.example.com/');
define('OPENPUB_ENDPOINT', 'https://pub.example.com/');
```

Falls back to `$_ENV['OPENPDC_ENDPOINT']` / `$_ENV['OPENPUB_ENDPOINT']`.

### Email log

Every outgoing review/reminder mail is captured in the `ypg_email_log` custom post type and surfaced under **Inhoudseigenarenmodule → Email log**. Each entry shows recipient, status (Verstuurd / Mislukt), the list of pages the mail concerned (clickable, with their review date), and the rendered body. The CPT is read-only — "Add New" is disabled and capabilities are mapped to the same admin cap that gates the other plugin pages.

Entries older than 60 days are purged on the daily cron. Tune the window with the `yard::page-guard/email-log-retention-days` filter (return `0` to disable purging entirely).

## Security

- Plugin admin pages (Inhoudseigenarenmodule, Email log, Instellingen) require the `yard_manage_page_guard` capability. The cap is added to the configured roles (`yard::page-guard/admin-roles`, default `administrator`) on plugin activation and stripped again on deactivation; installs that were already active are topped up once via a guarded migration. The gate's cap name is swappable to an existing cap via `yard::page-guard/admin-capability` (e.g. `edit_others_pages`) — when changed away from the default, the plugin leaves role grants untouched since the site already owns that cap.
- Metaboxes are visible to anyone with `edit_pages` while no owner is assigned. Once an owner is in place, only the post author, the assigned WP-user owner, and any holder of `yard_manage_page_guard` can edit the page-guard fields. External owners can never edit via `/wp-admin` — they only verify via the public review link.
- Review links are signed with HMAC-SHA256 over `post_id|owner_email|review_date`, base64url-encoded. The HMAC key comes from `YPG_AUTH_SALT` (see [wp-config.php constants](#wp-configphp-constants)); PDC/Pub cross-site setups must share the same value.
- All `$_GET`/`$_POST` reads pass through `sanitize_text_field`, `isset` guards, and explicit type checks (see [Traits/Token.php](src/PageGuard/Traits/Token.php) and [Metabox/MetaboxAccess.php](src/PageGuard/Metabox/MetaboxAccess.php)).

## Hooks

```php
// Post types that get the page-guard metabox + cron coverage.
apply_filters('yard::page-guard/post-types-to-use', ['page']);

// Post statuses scanned by the daily cron when looking for owners to notify.
apply_filters('yard::page-guard/post-statusses-to-use', ['publish', 'draft', 'future']);

// Roles that receive the `yard_manage_page_guard` cap on activation. Cap holders
// reach the admin pages and bypass the owner/author metabox check.
apply_filters('yard::page-guard/admin-roles', ['administrator', 'superuser', 'yard_superuser', 'super-user']);

// Point the admin gate at a different (existing) capability. When changed away
// from the default, the plugin leaves role grants untouched — the site owns it.
apply_filters('yard::page-guard/admin-capability', 'yard_manage_page_guard');

// Override the login name of the dummy review user whose admin bar is hidden on
// the review modal.
apply_filters('yard::page-guard/review-user-login', 'ypg_review_user');

// Whether the owner is mirrored into third-party internal-data fields (Fusion
// Portal, Fusion PDC, Brave/ACF). Defaults to true only when a Fusion PDC /
// OpenPub host is detected; return false to disable entirely.
apply_filters('yard::page-guard/enable-internal-data-sync', true);

// Days to keep email-log entries. Return 0 to disable purging.
apply_filters('yard::page-guard/email-log-retention-days', 60);

// Fires after every plugin-sent email. EmailLogRecorder subscribes here to
// persist the CPT entry; unhook it to disable admin-visible logging.
do_action('ypg/email_sent', bool $sent, string $to, string $subject, string $message, array $headers, array $context);

// Fires after owner info is written to / removed from internal-data fields.
do_action('yard::page-guard/after-internal-data-synced', int $postId, string $ownerLink, string $title);
do_action('yard::page-guard/after-internal-data-removed', int $postId);
```

## Architecture

```
src/PageGuard/
├── Admin/            Settings + overview controllers, custom post columns, bulk edit, one-off migrations
├── EmailLog/         ypg_email_log CPT, the `ypg/email_sent` recorder, retention sweep
├── Enums/            ContentOwnerType, DateUnit — closed sets of valid strings
├── Foundation/       Plugin bootstrapping, service-provider plumbing, AdminCapability
├── Frontend/         The review modal rendered on public pages
├── Metabox/          MetaboxAccess (auth), MetaboxRenderer (HTML), MetaboxSaver (save_post),
│                     InternalDataSync (3rd-party mirror) + InternalDataSyncMigration
├── Models/           ContentOwner, ReviewItem
├── Taxonomy/         External-owner taxonomy + meta fields
├── Traits/           Date, Email, Meta, ReviewUser, Text, Token — reused by controllers/events
├── WPCron/           Daily ypg_site_cron event + ReviewNotification, ReminderNotification
└── WPJson/           REST endpoints: verify-post and modal-info
```

Service providers are registered in [config/core.php](config/core.php). [Foundation\Plugin](src/PageGuard/Foundation/Plugin.php) boots them on `after_setup_theme`. The [AdminCapability](src/PageGuard/Foundation/AdminCapability.php) cap is added to roles on activation and removed on deactivation, so admin access lives in the database rather than being recomputed per request.

The settings page editors reuse WordPress' bundled TinyMCE via the `wp.editor` API ([resources/js/tinymce-editor.js](resources/js/tinymce-editor.js)); PHP renders a `<textarea>` carrying the option value, and JS calls `wp.editor.initialize()` on it with a trimmed toolbar plus custom buttons for the `{name}`/`{item_list}` placeholders and the `ypg-button` CTA. TinyMCE writes back to the textarea on every change, so the standard WP form submit path is untouched. The button is styled inside the editor iframe via `content_style` so it reads the same as the frontend `.ypg-button`.

## Testing

The plugin ships with a PHPUnit suite that uses [10up/wp_mock](https://github.com/10up/wp_mock) to stub WordPress functions, so tests run without a WordPress install.

Run the full suite:

```
composer test
```

Tests live under [tests/](tests/) and mirror the source tree:

- `tests/Enums/` — value validation for `ContentOwnerType` and `DateUnit`.
- `tests/Foundation/` — `AdminCapability` role-grant logic.
- `tests/Models/` — `ContentOwner` invariants and the `fromString` / `fromPostMeta` factories.
- `tests/Traits/` — `Date`, `Text`, and `Token` traits, including the date-recalculation rules and review-token HMAC.
- `tests/Metabox/` — the `MetaboxAccess` save/auth gate.

When adding new code, prefer extending the existing `Yard\PageGuard\Tests\TestCase` base — it wires `WP_Mock::setUp()` / `tearDown()` for you and exposes a reflection helper for invoking non-public methods.

## Local development

The daily cron makes notification flows awkward to iterate on. To speed things up, register a short custom interval and re-schedule the event against it. Inside the `register` method of [WPCron/WPCronServiceProvider.php](src/PageGuard/WPCron/WPCronServiceProvider.php):

```php
add_filter('cron_schedules', function ($schedules) {
    $schedules['five_seconds'] = [
        'interval' => 5,
        'display' => '5 seconden',
    ];

    return $schedules;
});

wp_schedule_event(time(), 'five_seconds', 'ypg_site_cron');
```

The event will then fire every 5 seconds. Make sure your dev environment intercepts outgoing email (Mailpit, MailHog, or similar) and that at least one post has a content owner + review date assigned so a notification is actually generated. While iterating, the **Email log** submenu shows every send (recipient, items, status, body) so you don't need to dig through the SMTP catcher to see what was produced.

### Frontend assets

Editor JS/CSS lives under [resources/](resources/) and is bundled by Vite to [build/](build/). After touching either, run `pnpm run build` (or `pnpm run lint:fix` for prettier/eslint).

## About us

[![banner](https://raw.githubusercontent.com/yardinternet/.github/refs/heads/main/profile/assets/small-banner-github.svg)](https://www.yard.nl/werken-bij/)
