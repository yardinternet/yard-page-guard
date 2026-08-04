/**
 * Local getters on purpose: `toISOString()` shifts to UTC, off by a day part of every day.
 *
 * @param {Date|string} value
 * @return {string} Y-m-d, or an empty string when the value is not a date.
 */
export const toYmd = ( value ) => {
	const date = value instanceof Date ? value : new Date( value );

	if ( Number.isNaN( date.getTime() ) ) {
		return '';
	}

	const month = String( date.getMonth() + 1 ).padStart( 2, '0' );
	const day = String( date.getDate() ).padStart( 2, '0' );

	return `${ date.getFullYear() }-${ month }-${ day }`;
};

/**
 * @return {string} Today in Y-m-d
 */
export const todayYmd = () => toYmd( new Date() );
