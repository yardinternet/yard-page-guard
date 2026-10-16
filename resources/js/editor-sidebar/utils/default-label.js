/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Label for a "volgens de standaardinstelling" radio option.
 *
 * @param {?Object} periodDefaults `review` or `reminder` from the defaults endpoint.
 * @return {string} Translated label, falling back to bare text while loading.
 */
export const defaultSettingLabel = ( periodDefaults ) => {
	if ( ! periodDefaults?.label ) {
		return __( 'Volgens de standaardinstelling', 'yard-page-guard' );
	}

	return sprintf(
		/* translators: %s: resolved default period, e.g. "1 week". */
		__( 'Volgens de standaardinstelling (%s)', 'yard-page-guard' ),
		periodDefaults.label
	);
};
