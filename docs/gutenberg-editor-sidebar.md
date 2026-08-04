# Gutenberg editor sidebar — implementation plan

Status: **implemented** All four sections, `ReviewScheduler`, the
repaired classic metabox and the tests are in place. `pnpm build`, `npx eslint`, `composer test`
(30 tests) and `php-cs-fixer` all pass. Verification step 5 (runtime smoke test in the block editor)
and step 6 (overview columns) still have to be done by hand.

Deviations from the plan as written, all deliberate:

-   **Switching a radio back to "standaard" clears the dependent meta in the same `setMeta` call.**
    `ReviewScheduler` keeps an existing `REVIEW_DATE` rather than recomputing it, so saving a page never
    pushes the review date forward; the cleared value is what makes a recompute happen. Same reasoning
    for the reminder override.
-   **The dead inline toggle script is deleted without replacement.** The classic conditional fields are
    always visible; the value is ignored unless its radio is on "custom", so the outcome is the same.
-   **The metabox's stub `alert()` button became a "mark reviewed" checkbox** handled on save via
    `ReviewScheduler::markReviewed()`, rather than being dropped.
-   **`markReviewed()` resets `REVIEW_DATE_TYPE` to `default`**, because an afwijkende datum is eenmalig.
-   **`VerifyPostController`'s success check now reads the resulting state.** It used
    `update_post_meta()`'s return value, which is `false` when the value did not change — so reviewing
    twice in one day reported a failure.
-   **`eslint.config.js` allows the six `__experimental*` component names** for
    `resources/js/editor-sidebar/**`, since `@wordpress/no-unsafe-wp-apis` rejects the only names that
    exist in 6.8.6.
-   **`tests/bootstrap.php` guards its `WP_CLI` stub with `class_exists()`.** `wp-cli/i18n-command` now
    ships the real class, and the redeclaration was a fatal that blocked the whole suite.
-   **`ReviewItem::contentOwner()` also guards the external branch**, where `get_term_field()` returns a
    `WP_Error` for a deleted term — a `TypeError` against `ContentOwner`'s `string` parameter.
-   `date('Y-m-d')` became `current_time('Y-m-d')` in the review/reminder computations, matching the
    site timezone the rest of the plugin compares against.

## Context

`src/PageGuard/Metabox/Metabox.php` renders the "Inhoudscontrole module" metabox as hand-rolled HTML
via `renderInput()`. It is registered with `__back_compat_meta_box`, so Gutenberg hides it — **the
plugin has no working editing UI in the block editor today**. The metabox is also inert in its own
right:

-   `saveMeta()` (`:451`) writes junk keys (`sec1_select`, `sec2_radio`, …) and **no `PostMeta::*` key at all**.
-   `handleInternalData()` is unreachable: `shouldSave()` requires nonce `ypg_metaboxes_nonce` (`:44`)
    but `renderMetaBox()` emits `my_sections_nonce` (`:337`).
-   The inline script toggles element ids (`sec2_conditional_date`) the markup never outputs.
-   `renderMetaBox()` computes the _review_ default label from the **reminder** options (`:348`);
    `REVIEW_TIME_*` is "Herzieningsperiode", `REMINDER_TIME_*` is "Herinneringsperiode".

Already landed: `Meta/MetaFields.php` + `MetaServiceProvider.php` (declarative, REST-validated meta
registry), `WPJson/Controllers/Editor/*` (`content-owners`, `defaults`, `review-status/<id>`,
`mark-reviewed/<id>`, capability-gated via `Traits\EditorPermissions`), and
`resources/js/editor-sidebar/` with a working owner `SelectControl`.

**Outcome:** all four sections become native Gutenberg components separated by dividers; the classic
metabox is kept _and repaired_ for non-Gutenberg post types; one server-side path owns date
resolution for every caller.

## ⚠️ Known broken, deliberately deferred

**Review and reminder mails do not fire for owners set through the sidebar.** Both cron queries
require the deprecated `ypg_post_content_owner_email` meta to `EXISTS`
(`WPCron/Events/ReviewNotification.php:38-63`, `ReminderNotification.php:38-67`), and **nothing in the
plugin writes that key any more** — `MetaFields::all()` exposes only owner _id_ and _type_. So every
post whose owner is set via this sidebar selects zero rows in both crons. The same key gates the
frontend review token (`WPJson/WPJsonServiceProvider.php:205-208`, `Traits/Token.php:70`).

This plan ships the UI without fixing it, by decision. **Follow-up ticket must:** switch both cron
`meta_query`s to `ypg_post_content_owner_id EXISTS`, resolve the address at send time via
`ReviewItem::contentOwner()->email()`, and make token generation/verification resolve the email the
same way. Until then, treat mail delivery as non-functional for new data.

Related pre-existing defects found while tracing (not fixed here unless noted):

| Defect                                                                                                                                                               | Location                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Post selected with empty owner email → dropped before send, but `REVIEW_MAIL_SENT`/`REMINDER_DATE` never written → **re-selected every daily run forever, silently** | `Email.php:24-28` + `ReviewNotification.php:94-96` |
| `ReviewItem::reviewDate()` returns `'d-m-Y'` or the literal `'Niet ingesteld'`, fed into `computeReminderDate()` → `new DateTime('Niet ingesteld')` **fatal**        | `ReviewItem.php:81-92` → `Date.php:44`             |
| `ReminderNotification` skips `updateModuleMeta()` under WP-CLI → duplicate mail next run                                                                             | `ReminderNotification.php:98`                      |
| `admin.js` handlers bind to ids/selectors no PHP emits (`#ypg-reminder-type-radio`, `input[name="post_ids[]"]`) — dead                                               | `resources/js/admin.js:6-56`                       |

**One crash is fixed here** because the sidebar can produce the triggering state: `ReviewItem::contentOwner()`
only null-guards `id === 0`, so an id with an empty/invalid `owner_type` falls through to the term branch
and `ContentOwner`'s constructor throws `InvalidArgumentException` (`ContentOwner.php:22-24`). Nothing
catches it, and both cron events share one hook — a single bad post kills that day's review _and_
reminder run. Harden `contentOwner()` to return `null` unless `ContentOwnerType::isValid($type)`.

## Decisions

| Decision                    | Choice                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Period input                | `NumberControl` + `SelectControl` — two metas, no string parsing (not `UnitControl`, which is for CSS units) |
| Panels                      | Drop `PanelBody` inside the sidebar; **keep** `PluginDocumentSettingPanel` as entry point                    |
| Owner set back to none      | Clear review meta via the existing, currently unwired `Traits\Meta::clearReviewMeta()`                       |
| Default review date         | Resolved **server-side on save**, shared by sidebar and classic metabox                                      |
| Classic metabox             | Kept for legacy/non-Gutenberg post types, save path repaired                                                 |
| "Mark reviewed"             | One implementation; all three existing callers delegate to it                                                |
| Cron owner-email dependency | Deferred to a separate ticket (see above)                                                                    |

## Component names — verified against WP 6.8.6

`wp.components` in 6.8.6 has a 192-name export map. These are **experimental-only** — the stable name
is `undefined` at runtime:

```js
import {
	DatePicker, // stable
	Notice, // stable
	RadioControl, // stable
	SelectControl, // stable
	Spinner, // stable
	TextControl, // stable
	HStack, // check if experimentl or stable
	VStack, // check if experimentl or stable
	Text, // check if experimentl or stable
	__experimentalDivider as Divider,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
```

Trap: upstream `@wordpress/components` 33.x (pinned in `yard-toolkit/packages/ts-config-wordpress`)
**stabilised** `Divider`, `NumberControl`, `HStack`, `VStack`, `Text`. Editor autocomplete and current
docs will suggest the stable names, which break against 6.8.6.

Aliasing is safe with this build: `@roots/vite-plugin`'s `handleNamedReplacement` splits on `as`, so
the above compiles to `const Divider = wp.components.__experimentalDivider`.

Date field: use **`DatePicker`**. Make sure the date is in the right format.

## Target UI

One scrollable body, four sections separated by `<Divider />`, no panels. Sections 2–4 render only
when an owner is selected.

```
Inhoudseigenaar        SelectControl                                  (built)
──────── Divider ────────
Herzieningsdatum       RadioControl: standaard | eenmalig afwijkend
                       └ afwijkend → DatePicker (min today)
──────── Divider ────────
Herinneringsperiode    RadioControl: standaard | afwijkend
                       └ afwijkend → Row [ NumberControl(min 1), SelectControl(dagen/weken/maanden) ]
──────── Divider ────────
Status                 Text: laatst gecontroleerd op <datum>
                       Button "Ja, ik heb de pagina opnieuw gecontroleerd"
                       Notice: success / error
```

Each "Volgens de standaardinstelling" label shows the resolved default from `GET /editor/defaults`
(`review.label` / `reminder.label`, e.g. `"1 week"`), which already reads the **correct** options per
field — fixing the review/reminder mix-up above.

## Implementation

### 1. Server — one shared scheduler

`Traits\Date::computeDateMeta()` reads `$_POST` directly, but **branch #1 is already unreachable in
every live path** (its only caller is `computeReviewDate()`, invoked from two REST controllers where
`$_POST` never carries `ypg_review_date`). The refactor is therefore behaviour-neutral.

-   **Refactor** `computeDateMeta()` to accept an explicit `?string $submittedValue` instead of reading
    `$_POST[$inputFieldName]`; thread it through `computeReviewDate()`. The classic metabox passes
    `$_POST[PostMeta::REVIEW_DATE] ?? null`; REST callers pass `null`.
-   **New `src/PageGuard/Meta/ReviewScheduler.php`** — the single owner of date resolution:
    -   `syncForPost(int $postId): void`
        -   owner id `0` → `clearReviewMeta($postId)`, return
        -   `REVIEW_DATE_TYPE === 'default'` → recompute `REVIEW_DATE` from `REVIEW_TIME_*` options
        -   `REMINDER_TIME_TYPE === 'default'` → delete the per-post `REMINDER_TIME_*` overrides, so
            `computeReminderDate()`'s existing "both overrides non-empty" check (`Date.php:129-135`) falls
            back to the site options
        -   `type === 'custom'` with `period < 1` → treat as default (schema can't validate across fields)
    -   `markReviewed(int $postId): void` — extracted from `MarkReviewedController`. **All three existing
        callers delegate:** `Editor\MarkReviewedController`, the frontend `VerifyPostController`, and
        `Admin/ListTables/PageGuardListTable::process_bulk_action` (which today computes the date inline via
        `addPeriodToBase`, bypassing `computeReviewDate`, and is the only one that deletes
        `ypg_reminder_date` — pick that behaviour deliberately and apply it uniformly).
-   **Hook from `MetaServiceProvider`**, per enabled post type: `rest_after_insert_{$postType}` (block
    editor, fires after meta is applied) and `save_post_{$postType}` (classic; guard `DOING_AUTOSAVE`,
    revisions, capability).
-   Harden `ReviewItem::contentOwner()` per the crash note above.

### 2. Server — repair the classic metabox

Kept for non-Gutenberg post types; `__back_compat_meta_box` already hides it in Gutenberg.

-   Fix the nonce mismatch so `handleInternalData()` becomes reachable, or align both on one nonce name.
-   Rewrite `saveMeta()` to write the **real** meta keys, driving the key list and sanitizers from
    `MetaFields::all()` so validation cannot drift between the two editors.
-   Split the composite owner value server-side (`"user:12"` → id `12`, type `user`) via a new
    `MetaFields::decodeOwnerValue()`, mirroring `utils/owner-value.js`; unit-test both sides.
-   Delete the dead inline toggle script and the wrong `$defaultReviewData`; use `REVIEW_TIME_*`.

### 3. JS — sections replace panels

| Path                                   | Purpose                                                      |
| -------------------------------------- | ------------------------------------------------------------ |
| `sections/content-owner-section.jsx`   | existing panel, `PanelBody` → fragment                       |
| `sections/review-date-section.jsx`     | radio + conditional date field                               |
| `sections/reminder-period-section.jsx` | radio + conditional `HStack` number/unit                     |
| `sections/status-section.jsx`          | last-checked text, verify button, feedback                   |
| `components/section.jsx`               | heading + `VStack`, consistent spacing                       |
| `hooks/use-defaults.js`                | `fetchDefaults` via existing `useAsyncData`                  |
| `hooks/use-review-status.js`           | `fetchReviewStatus` + `refresh()`                            |
| `hooks/use-mark-reviewed.js`           | POST with `isSaving` / `error` / `success`                   |
| `constants.js`                         | add `REVIEW_DATE_TYPES`, `TIME_UNITS` mirroring `MetaFields` |

-   Move `panels/content-owner-panel.jsx` into `sections/`; delete `panels/`.
-   `index.jsx` composes sections with `<Divider />` between them, gating 2–4 on the owner meta.
-   Setting the owner to `NO_OWNER` clears dependent meta in the same `setMeta` call so editor state
    matches what `ReviewScheduler` persists; the server remains the authority.
-   `editor-sidebar.css`: add the padding `PanelBody` used to provide (`PluginSidebar` children get none)
    plus divider spacing. `resources/css/admin.css` has nothing reusable — it is all classic-admin chrome.

### 4. Status section validation

The button writes to the database immediately while the editor may hold unsaved changes, so guard it:

-   **Disabled while dirty or saving** — `useSelect( ( s ) => s( 'core/editor' ).isEditedPostDirty() )` —
    with help text to save first. Prevents the write being clobbered by a following meta save.
-   **Disabled when the post is not yet persisted** (`isEditedPostNew` / auto-draft): the endpoint needs a
    real post id.
-   On success: `Notice status="success"`, then `refresh()` the review status so last-checked and next
    review date update without a reload.
-   On failure: `Notice status="error"` with `error.message` from the REST body, falling back to a generic
    Dutch string. `WPJsonServiceProvider::forbidden()` already returns a translated message plus
    `rest_authorization_required_code()`, so 401/403 surfaces meaningfully.
-   Reuse `ReviewStatusController::datePayload()`'s `{ date, formatted }` pairs — date formatting stays in
    PHP (`Traits\Date::formatDate()`, `date_i18n`), so no JS date library is needed.

### 5. Meta registry

Keep `REMINDER_TIME_PERIOD`'s schema at `minimum: 0` — per-field schema cannot see sibling fields, so
`ReviewScheduler` enforces the "custom implies ≥ 1" rule instead (unit-tested). Deliberately **do not**
add a "not in the past" constraint to `REVIEW_DATE`: opening an existing page whose review date has
passed would then fail validation on every save. Enforce `min={today}` in the UI as a hint only.

## Verification

1. `pnpm build`, then check `public/assets/editor.deps.json` gained nothing unexpected — in particular
   **no `wp-block-editor`**.
2. `npx eslint resources/js/editor-sidebar` (needs Node ≥ 22 arm64; the nvm builds on this machine are
   x64 and fail on the rolldown binding — use the fnm `v24.14.1` install).
3. `composer test` — extend `tests/Meta/MetaFieldsTest.php`; add `tests/Meta/ReviewSchedulerTest.php`
   covering: no owner clears meta; `type=default` recomputes from `REVIEW_TIME_*`; `type=custom`
   preserves the chosen date; `custom` + `period=0` falls back to site defaults; owner value decode
   parity with the JS codec.
4. `./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --dry-run`.
5. **Runtime smoke test in the block editor** — no pass so far has managed this, so budget time:
    - select owner → sections 2–4 appear; save → `ypg_review_date` populated
    - "afwijkende datum" → pick date → save → that exact date persists
    - reminder custom `3 weken` → save → `period=3`, `unit=weeks`
    - owner → "Geen inhoudseigenaar" → save → review meta cleared
    - verify button → green notice, last-checked = today; button disabled while dirty
    - as a user without `edit_pages` → red notice with the permission message
    - a **classic**-editor post type → metabox renders _and now actually saves_
6. Confirm `AdminServiceProvider::fillCustomColumns` and `PageGuardListTable` still show
   owner/status/review-date — they read the same meta.

## Out of scope

-   The cron owner-email dependency and the pre-existing defects tabled above (except the `contentOwner()`
    crash guard).
-   Deprecated meta (`POST_CONTENT_OWNER_NAME` / `_EMAIL` / `_PHONE_NUMBER`, `IS_VERIFIED`) stays;
    `markReviewed()` keeps writing `IS_VERIFIED` for the overview columns.
-   `handleInternalData()`'s OWC/Fusion/Brave sync logic itself — only its nonce is fixed. Note it reads
    the deprecated name/email/phone meta, so it stays dependent on the deferred ticket.
-   `admin.js`'s dead handlers.
