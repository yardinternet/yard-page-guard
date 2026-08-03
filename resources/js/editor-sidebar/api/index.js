/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import * as endpoints from './endpoints';

/**
 * Site wide data does not change while the editor is open, so the request is
 * shared between every panel that asks for it instead of refetched per mount.
 */
const cache = new Map();

const fetchOnce = ( path ) => {
	if ( ! cache.has( path ) ) {
		cache.set(
			path,
			apiFetch( { path } ).catch( ( error ) => {
				cache.delete( path );
				throw error;
			} )
		);
	}

	return cache.get( path );
};

export const fetchContentOwners = () => fetchOnce( endpoints.CONTENT_OWNERS );

export const fetchDefaults = () => fetchOnce( endpoints.DEFAULTS );

export const fetchReviewStatus = ( postId ) =>
	apiFetch( { path: endpoints.reviewStatus( postId ) } );

export const markReviewed = ( postId ) =>
	apiFetch( { path: endpoints.markReviewed( postId ), method: 'POST' } );
