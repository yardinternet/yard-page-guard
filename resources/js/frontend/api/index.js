/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * The review endpoints live on the site that owns the post, which for PDC/PUB items is
 * not the site serving this page.
 *
 * @param {string} endpoint
 * @param {number} postId
 * @param {string} token
 * @return {string} Endpoint with the review query args applied
 */
const withParams = ( endpoint, postId, token ) => {
	const url = new URL( endpoint );

	url.searchParams.set( 'post_id', String( postId ) );
	url.searchParams.set( 'token', token );

	return url.toString();
};

/**
 * Every message the user reads comes from the REST response, so the copy lives in PHP and
 * gets picked up by make-pot. This fallback only covers never reaching the server at all.
 *
 * @return {string} Generic failure message
 */
const unreachableMessage = () =>
	__( 'Er is iets misgegaan. Probeer het later opnieuw.', 'yard-page-guard' );

const request = async ( url, method ) => {
	let response;

	try {
		response = await fetch( url, { method } );
	} catch {
		throw new Error( unreachableMessage() );
	}

	const body = await response.json().catch( () => null );

	if ( ! response.ok ) {
		const error = new Error( body?.message || unreachableMessage() );

		error.code = body?.code;
		error.status = body?.data?.status || response.status;

		throw error;
	}

	return body;
};

/**
 * @param {string} endpoint
 * @param {number} postId
 * @param {string} token
 * @return {Promise<{id: number, title: string, footer: ?string, endpoint: string}>} Modal content
 */
export const fetchModalInfo = ( endpoint, postId, token ) =>
	request( withParams( endpoint, postId, token ), 'GET' );

/**
 * @param {string} endpoint
 * @param {number} postId
 * @param {string} token
 * @return {Promise<{message: string}>} Confirmation payload
 */
export const verifyPost = ( endpoint, postId, token ) =>
	request( withParams( endpoint, postId, token ), 'POST' );
