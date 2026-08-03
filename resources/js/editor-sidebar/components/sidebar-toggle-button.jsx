/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SIDEBAR_NAME, SIDEBAR_ICON } from '../constants';

const SidebarToggleButton = ( { className } ) => {
	const { openGeneralSidebar } = useDispatch( 'core/edit-post' );

	return (
		<Button
			className={ `ypg-editor-sidebar-toggle-button ${ className }` }
			variant="secondary"
			icon={ SIDEBAR_ICON }
			onClick={ () =>
				openGeneralSidebar( `ypg-editor-sidebar/${ SIDEBAR_NAME }` )
			}
		>
			{ __( 'Inhoudscontrole openen', 'yard-page-guard' ) }
		</Button>
	);
};

export default SidebarToggleButton;
