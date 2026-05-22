import '../css/admin.css';
import { mountAllLexical } from './lexical-editor.js';

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

wp.domReady(() => {
	initBulkActions();
	initInlineEditOverride();
	initReminderRadioToggle();
	mountAllLexical();
});
