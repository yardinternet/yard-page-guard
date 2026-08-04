/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Editor state the sidebar needs to know whether writing straight to the
 * database is safe: an unsaved post has no usable id, and a dirty post would
 * have its meta overwritten by the save that follows.
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
