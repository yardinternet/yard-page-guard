/**
 * Internal dependencies
 */
import { OWNER_TYPES } from '../config/constants';

/**
 * Composite id+type value for the owner select; split back into separate
 * meta fields before storage. Kept in sync with MetaFields::encodeOwnerValue()
 * / ::decodeOwnerValue().
 */
const SEPARATOR = ':';

export const NO_OWNER = '';

const NONE = { id: 0, type: '' };

/**
 * @param {number} id   Owner id.
 * @param {string} type Owner type: 'user' or 'external'.
 * @return {string} Composite select value, empty when there is no owner.
 */
export const encodeOwnerValue = ( id, type ) => {
	const numericId = Number.parseInt( id, 10 );

	if ( ! numericId || numericId < 1 || ! OWNER_TYPES.includes( type ) ) {
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

	if ( ! numericId || numericId < 1 || ! OWNER_TYPES.includes( type ) ) {
		return NONE;
	}

	return { id: numericId, type };
};
