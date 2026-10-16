/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchReviewStatus } from '../api';
import { useAsyncData } from './use-async-data';

/**
 * Derived review state of a post
 *
 * @param {?number} postId Post to read, or a falsy value while the post is not persisted.
 * @return {{status: ?Object, isLoading: boolean, error: ?Object, refresh: Function}} Request state.
 */
export const useReviewStatus = ( postId ) => {
	const [ token, setToken ] = useState( 0 );

	const fetcher = useCallback(
		() =>
			postId ? fetchReviewStatus( postId ) : Promise.resolve( null ),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ postId, token ]
	);

	const { data, isLoading, error } = useAsyncData( fetcher );

	return {
		status: data,
		isLoading,
		error,
		refresh: useCallback( () => setToken( ( value ) => value + 1 ), [] ),
	};
};
