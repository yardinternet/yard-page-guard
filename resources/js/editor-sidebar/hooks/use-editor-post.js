/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Editor state needed to tell if writing straight to the DB is safe.
 *
 * @return {{postId: number, isNew: boolean, isDirty: boolean, isSaving: boolean}} Editor state.
 */
export const useEditorPost = () =>
	useSelect( ( select ) => {
		const editor = select( editorStore );

		return {
			postId: editor.getCurrentPostId(),
			isNew: editor.isEditedPostNew(),
			isDirty: editor.isEditedPostDirty(),
			isSaving: editor.isSavingPost(),
		};
	}, [] );
