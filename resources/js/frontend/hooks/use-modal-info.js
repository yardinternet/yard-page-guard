/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchModalInfo } from '../api';

/**
 * Loads the modal contents for the reviewed post.
 *
 * @param {string} endpoint
 * @param {number} postId
 * @param {string} token
 * @return {{data: ?Object, isLoading: boolean, error: ?Error}} Request state
 */
export const useModalInfo = ( endpoint, postId, token ) => {
	const [ state, setState ] = useState( {
		data: null,
		isLoading: true,
		error: null,
	} );

	const fetcher = useCallback(
		() => fetchModalInfo( endpoint, postId, token ),
		[ endpoint, postId, token ]
	);

	useEffect( () => {
		let isCurrent = true;

		setState( { data: null, isLoading: true, error: null } );

		fetcher()
			.then( ( data ) => {
				if ( isCurrent ) {
					setState( { data, isLoading: false, error: null } );
				}
			} )
			.catch( ( error ) => {
				if ( isCurrent ) {
					setState( { data: null, isLoading: false, error } );
				}
			} );

		return () => {
			isCurrent = false;
		};
	}, [ fetcher ] );

	return state;
};
