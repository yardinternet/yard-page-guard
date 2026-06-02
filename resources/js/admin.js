import '../css/admin.css';
import { mountAllEditors } from './tiptap-editor.js';

/**
 * Functionality for bulk actions on plugin overview page
 */
function initBulkActions() {
	const selectAllCheckbox = document.querySelector('#ypg-select-all');
	const postCheckboxes = document.querySelectorAll(
		'input[name="post_ids[]"]'
	);
	const bulkActionBar = document.querySelector(
		'.ypg-bulk-action-bar-wrapper'
	);

	//Show bulk edit bar if at least 1 checkbox is checked
	const updateBulkBarVisibility = () => {
		if (!bulkActionBar) return;
		const anyChecked = Array.from(postCheckboxes).some((cb) => cb.checked);
		bulkActionBar.setAttribute('aria-hidden', !anyChecked);
	};

	// Toggle all checkboxes
	if (selectAllCheckbox) {
		selectAllCheckbox.addEventListener('click', (e) => {
			postCheckboxes.forEach((cb) => (cb.checked = e.target.checked));
			updateBulkBarVisibility();
		});
	}

	postCheckboxes.forEach((cb) =>
		cb.addEventListener('click', updateBulkBarVisibility)
	);

	// Initialize visibility on page load
	updateBulkBarVisibility();
}

/**
 * Necessary changes for handling yard-page-guard meta changes through quick edit
 */
function initInlineEditOverride() {
	if (!window.inlineEditPost) {
		return;
	}

	const { __ } = wp.i18n;
	const originalInlineEdit = window.inlineEditPost.edit;

	window.inlineEditPost.edit = function (postId) {
		originalInlineEdit.apply(this, arguments);

		if (typeof postId === 'object') {
			postId = parseInt(this.getId(postId), 10);
		}

		const editRow = document.getElementById(`edit-${postId}`);
		const postRow = document.getElementById(`post-${postId}`);
		if (!editRow || !postRow) return;

		const getText = (selector, context = document) =>
			context.querySelector(selector)?.innerText.trim() || '';

		// Content Owner
		const contentOwner = getText('.ypg_post_content_owner', postRow);
		const ownerSelect = editRow.querySelector(
			'select[name="ypg_post_content_owner"]'
		);
		if (ownerSelect) {
			const option = Array.from(ownerSelect.options).find(
				(opt) => opt.text.trim() === contentOwner
			);
			ownerSelect.value = option?.value || '';
		}

		// Verified Checkbox
		const verifiedCheckbox = editRow.querySelector(
			'input[name="ypg_is_verified"]'
		);
		if (verifiedCheckbox) {
			verifiedCheckbox.checked =
				getText('.ypg_is_verified', postRow) ===
				__('Ja', 'yard-page-guard');
		}

		// Review Date
		const reviewDateInput = editRow.querySelector(
			'input[name="ypg_review_date"]'
		);
		if (reviewDateInput) {
			reviewDateInput.value =
				editRow.querySelector('.review-date-wrapper')?.dataset.date ||
				'';
		}
	};
}

/**
 * Makes edit post metabox reminder type radio show/hide the date input
 */
function initReminderRadioToggle() {
	const reminderRadioGroup = document.querySelector(
		'#ypg-reminder-type-radio'
	);
	const customDateWrapper = document.querySelector(
		'.ypg-reminder-date-input-wrapper'
	);

	if (!reminderRadioGroup || !customDateWrapper) return;

	reminderRadioGroup.querySelectorAll('input').forEach((radio) => {
		radio.addEventListener('change', (e) => {
			customDateWrapper.ariaHidden = e.target.value !== 'custom';
		});
	});
}

/**
 * Locale-independent 24-hour time field. The native <input type="time"> renders
 * a 12-hour AM/PM clock in some browsers/locales; masking a plain text input
 * keeps the field reading and writing HH:MM in 24-hour form everywhere.
 */
function initTimeFields() {
	const pad = (value, max) =>
		String(Math.min(parseInt(value, 10) || 0, max)).padStart(2, '0');

	document.querySelectorAll('input[data-ypg-time]').forEach((field) => {
		// Keep only digits and re-insert the colon after the hours.
		field.addEventListener('input', () => {
			const digits = field.value.replace(/\D/g, '').slice(0, 4);
			field.value =
				digits.length > 2
					? `${digits.slice(0, 2)}:${digits.slice(2)}`
					: digits;
		});

		// Normalise to a zero-padded, in-range HH:MM when leaving the field.
		field.addEventListener('blur', () => {
			if (!field.value) return;
			const [hours = '', minutes = ''] = field.value.split(':');
			field.value = `${pad(hours, 23)}:${pad(minutes, 59)}`;
		});
	});
}

/**
 * Live "next run" countdown on the settings page. WP-Cron fires on site
 * traffic, so a target already in the past is shown as due on the next visit
 * rather than as a negative timer.
 */
function initCronCountdown() {
	const el = document.querySelector('[data-ypg-cron-countdown]');
	if (!el) return;

	const target = parseInt(el.dataset.ypgCronCountdown, 10) * 1000;
	if (!target) return;

	const { __, _n, sprintf } = wp.i18n;
	const pad = (value) => String(value).padStart(2, '0');

	const render = () => {
		const remaining = target - Date.now();

		if (remaining <= 0) {
			el.textContent = __(
				'wordt uitgevoerd bij het volgende paginabezoek',
				'yard-page-guard'
			);
			return false;
		}

		const totalSeconds = Math.floor(remaining / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const clock = [
			Math.floor((totalSeconds % 86400) / 3600),
			Math.floor((totalSeconds % 3600) / 60),
			totalSeconds % 60,
		]
			.map(pad)
			.join(':');

		const daysText =
			days > 0
				? sprintf(
						// translators: %d: number of days remaining.
						_n('%d dag', '%d dagen', days, 'yard-page-guard'),
						days
					) + ' '
				: '';

		el.textContent = sprintf(
			// translators: %s: remaining time, e.g. "2 dagen 12:34:56".
			__('over %s', 'yard-page-guard'),
			daysText + clock
		);

		return true;
	};

	if (render()) {
		const timer = setInterval(() => {
			if (!render()) clearInterval(timer);
		}, 1000);
	}
}

wp.domReady(() => {
	initBulkActions();
	initInlineEditOverride();
	initReminderRadioToggle();
	initTimeFields();
	initCronCountdown();
	mountAllEditors();
});
