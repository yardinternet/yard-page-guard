/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Reads and writes the current post's meta. Writing merges into the existing
 * meta object, so several keys can be updated in a single call.
 *
 * @return {[Object, Function]} The post meta and a setter taking partial meta.
 */
export const usePostMeta = () => {
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	const updateMeta = ( changes ) => setMeta( { ...meta, ...changes } );

	return [ meta ?? {}, updateMeta ];
};
