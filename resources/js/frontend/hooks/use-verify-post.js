/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { verifyPost } from '../api';

const IDLE = { isSaving: false, error: null, message: null };

/**
 * Marks the post as reviewed and exposes the result for a notice.
 *
 * @param {?string} endpoint
 * @param {number}  postId
 * @param {string}  token
 * @return {{verify: Function, isSaving: boolean, error: ?Error, message: ?string}} Request state
 */
export const useVerifyPost = ( endpoint, postId, token ) => {
	const [ state, setState ] = useState( IDLE );

	const verify = useCallback( async () => {
		if ( ! endpoint ) {
			return;
		}

		setState( { isSaving: true, error: null, message: null } );

		try {
			const { message } = await verifyPost( endpoint, postId, token );

			setState( { isSaving: false, error: null, message } );
		} catch ( error ) {
			setState( { isSaving: false, error, message: null } );
		}
	}, [ endpoint, postId, token ] );

	return { verify, ...state };
};
