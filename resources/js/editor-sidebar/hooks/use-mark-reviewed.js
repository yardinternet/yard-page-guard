/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { markReviewed as markReviewedRequest } from '../api';

const IDLE = { isSaving: false, error: null, isSuccess: false };

/**
 * Posts the "reviewed" action and exposes its result for a notice.
 *
 * @param {?number}  postId
 * @param {Function} onSuccess Called after a successful write, to refresh derived state.
 * @return {{markReviewed: Function, isSaving: boolean, error: ?string, isSuccess: boolean}} Request state.
 */
export const useMarkReviewed = ( postId, onSuccess ) => {
	const [ state, setState ] = useState( IDLE );
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);
	const { invalidateResolution } = useDispatch( coreStore );

	const markReviewed = useCallback( async () => {
		if ( ! postId ) {
			return;
		}

		setState( { isSaving: true, error: null, isSuccess: false } );

		try {
			await markReviewedRequest( postId );

			// The endpoint resets REVIEW_DATE_TYPE and REVIEW_DATE server side.
			// Without dropping the cached record the radio keeps showing the old
			// choice, and the next save PATCHes those stale values back over it.
			invalidateResolution( 'getEntityRecord', [
				'postType',
				postType,
				postId,
			] );

			setState( { isSaving: false, error: null, isSuccess: true } );
			onSuccess?.();
		} catch ( error ) {
			setState( {
				isSaving: false,
				error:
					error?.message ||
					__(
						'De pagina kon niet als gecontroleerd worden gemarkeerd.',
						'yard-page-guard'
					),
				isSuccess: false,
			} );
		}
	}, [ postId, postType, invalidateResolution, onSuccess ] );

	return { markReviewed, ...state };
};
