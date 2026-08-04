/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Label for a "volgens de standaardinstelling" radio option, built from one of the
 * period objects `GET /editor/defaults` returns.
 *
 * @param {?Object} periodDefaults `review` or `reminder` from the defaults endpoint.
 * @param {boolean} withDate       Append the resolved date to the period.
 * @return {string} Translated label, falling back to the bare text while the
 *                  defaults are still loading.
 */
export const defaultSettingLabel = ( periodDefaults, withDate = false ) => {
	if ( ! periodDefaults?.label ) {
		return __( 'Volgens de standaardinstelling', 'yard-page-guard' );
	}

	if ( withDate && periodDefaults.formatted ) {
		return sprintf(
			/* translators: 1: default period, e.g. "1 week". 2: resolved date. */
			__(
				'Volgens de standaardinstelling (%1$s, %2$s)',
				'yard-page-guard'
			),
			periodDefaults.label,
			periodDefaults.formatted
		);
	}

	return sprintf(
		/* translators: %s: resolved default period, e.g. "1 week". */
		__( 'Volgens de standaardinstelling (%s)', 'yard-page-guard' ),
		periodDefaults.label
	);
};
