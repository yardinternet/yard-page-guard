/**
 * A select holds one scalar, but a content owner is an id plus the type telling
 * whether that id is a WP user or an external owner term. The composite value
 * therefore exists in the UI only: it is split again before it is stored, so the
 * post meta keeps a plain integer id and a separate owner type, which is what
 * the review queries, overview columns and notification mails read.
 */
const SEPARATOR = ':';

export const NO_OWNER = '';

/**
 * @param {number} id   Owner id.
 * @param {string} type Owner type: 'user' or 'external'.
 * @return {string} Composite select value, empty when there is no owner.
 */
export const encodeOwnerValue = ( id, type ) => {
	const numericId = Number.parseInt( id, 10 );

	if ( ! numericId || ! type ) {
		return NO_OWNER;
	}

	return `${ type }${ SEPARATOR }${ numericId }`;
};

/**
 * @param {string} value Composite select value.
 * @return {{id: number, type: string}} Owner id and type, zeroed when empty.
 */
export const decodeOwnerValue = ( value ) => {
	const [ type, id ] = String( value ?? '' ).split( SEPARATOR );
	const numericId = Number.parseInt( id, 10 );

	if ( ! type || ! numericId ) {
		return { id: 0, type: '' };
	}

	return { id: numericId, type };
};
