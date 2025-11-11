import '../css/admin.css';

document.addEventListener('DOMContentLoaded', () => {
	const selectAll = document.querySelector('#ypg-select-all');
	const checkboxes = document.querySelectorAll('input[name="post_ids[]"]');
	const bulkBar = document.querySelector('.ypg-bulk-action-bar-wrapper');

	const updateBulkBarVisibility = () => {
		const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
		if (bulkBar) {
			bulkBar.setAttribute('aria-hidden', !anyChecked);
		}
	};

	// Toggle all checkboxes when "select all" is clicked
	if (selectAll) {
		selectAll.addEventListener('click', (e) => {
			checkboxes.forEach((cb) => (cb.checked = e.target.checked));
			updateBulkBarVisibility();
		});
	}

	// Update bulk bar when individual checkboxes are clicked
	checkboxes.forEach((cb) => {
		cb.addEventListener('click', updateBulkBarVisibility);
	});

	// Initialize on page load
	updateBulkBarVisibility();

	const { __ } = wp.i18n;
	const originalInlineEdit = window.inlineEditPost.edit;

	// Override inline edit
	window.inlineEditPost.edit = function (postId) {
		// Call original inline edit first
		originalInlineEdit.apply(this, arguments);

		// Handle object-style postId
		if (typeof postId === 'object') {
			postId = parseInt(this.getId(postId), 10);
		}

		const editRow = document.getElementById('edit-' + postId);
		const postRow = document.getElementById('post-' + postId);

		if (!editRow || !postRow) return;

		// Helper to get node innertext
		const getText = (selector, context = document) =>
			context.querySelector(selector)?.innerText.trim() || '';

		// Get values through post overview columns for population
		const contentOwner = getText('.ypg_post_content_owner', postRow);
		const contentOwnerValue =
			Array.from(
				editRow.querySelectorAll(
					'select[name="ypg_post_content_owner"] option'
				)
			).find((option) => option.innerText.trim() === contentOwner)
				?.value || '';

		const isVerified =
			getText('.ypg_is_verified', postRow) ===
			__('Ja', 'yard-page-guard');

		const reviewDate =
			editRow.querySelector('.review-date-wrapper')?.dataset.date || '';

		// Populate quick edit fields
		const ownerSelect = editRow.querySelector(
			'select[name="ypg_post_content_owner"]'
		);
		if (ownerSelect) ownerSelect.value = contentOwnerValue;

		const verifiedCheckbox = editRow.querySelector(
			'input[name="ypg_is_verified"]'
		);
		if (verifiedCheckbox) verifiedCheckbox.checked = isVerified;

		const reviewDateInput = editRow.querySelector(
			'input[name="ypg_review_date"]'
		);
		if (reviewDateInput) reviewDateInput.value = reviewDate;
	};
});

wp.domReady(() => {
	const reminderRadio = document.querySelector('#ypg-reminder-type-radio');
	const customReminderWrapper = document.querySelector(
		'.ypg-reminder-date-input-wrapper'
	);

	if (reminderRadio && customReminderWrapper) {
		reminderRadio.querySelectorAll('input').forEach((radio) => {
			radio.addEventListener('change', (e) => {
				if (e.target.value === 'custom' && e.target.checked) {
					customReminderWrapper.ariaHidden = false;
				} else {
					customReminderWrapper.ariaHidden = true;
				}
			});
		});
	}
});
