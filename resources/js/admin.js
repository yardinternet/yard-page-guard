import '../css/admin.css';

/**
 * Functionality for bulk actions on plugin overview page
 */
function initBulkActions() {
	const selectAllCheckbox = document.querySelector( '#ypg-select-all' );
	const postCheckboxes = document.querySelectorAll(
		'input[name="post_ids[]"]'
	);
	const bulkActionBar = document.querySelector(
		'.ypg-bulk-action-bar-wrapper'
	);

	//Show bulk edit bar if at least 1 checkbox is checked
	const updateBulkBarVisibility = () => {
		if ( ! bulkActionBar ) {
			return;
		}
		const anyChecked = Array.from( postCheckboxes ).some(
			( cb ) => cb.checked
		);
		bulkActionBar.setAttribute( 'aria-hidden', ! anyChecked );
	};

	// Toggle all checkboxes
	if ( selectAllCheckbox ) {
		selectAllCheckbox.addEventListener( 'click', ( e ) => {
			postCheckboxes.forEach(
				( cb ) => ( cb.checked = e.target.checked )
			);
			updateBulkBarVisibility();
		} );
	}

	postCheckboxes.forEach( ( cb ) =>
		cb.addEventListener( 'click', updateBulkBarVisibility )
	);

	// Initialize visibility on page load
	updateBulkBarVisibility();
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

	if ( ! reminderRadioGroup || ! customDateWrapper ) {
		return;
	}

	reminderRadioGroup.querySelectorAll( 'input' ).forEach( ( radio ) => {
		radio.addEventListener( 'change', ( e ) => {
			customDateWrapper.ariaHidden = e.target.value !== 'custom';
		} );
	} );
}

wp.domReady( () => {
	initBulkActions();
	initReminderRadioToggle();
} );
