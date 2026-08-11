/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Resolves fetcher into render state, ignoring stale results after unmount.
 *
 * @param {Function} fetcher Returns a promise with the data. Must be a stable reference.
 * @return {{data: *, isLoading: boolean, error: ?Object}} Request state.
 */
export const useAsyncData = ( fetcher ) => {
	const [ state, setState ] = useState( {
		data: null,
		isLoading: true,
		error: null,
	} );

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
