/**
 * WordPress dependencies
 */
import {
	PluginSidebar,
	PluginSidebarMoreMenuItem,
	PluginDocumentSettingPanel,
	PluginPostStatusInfo,
} from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SidebarToggleButton from './components/sidebar-toggle-button.jsx';
import ContentOwnerPanel from './panels/content-owner-panel.jsx';
import { SIDEBAR_NAME, SIDEBAR_ICON } from './config/constants';
import './editor-sidebar.css';

const EditorSidebar = () => {
	const title = __( 'Inhoudscontrole', 'yard-page-guard' );

	return (
		<>
			<PluginSidebarMoreMenuItem
				target={ SIDEBAR_NAME }
				icon={ SIDEBAR_ICON }
			>
				{ title }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name={ SIDEBAR_NAME }
				title={ title }
				icon={ SIDEBAR_ICON }
			>
				<ContentOwnerPanel />
			</PluginSidebar>
			<PluginDocumentSettingPanel title={ title }>
				<SidebarToggleButton />
			</PluginDocumentSettingPanel>
			<PluginPostStatusInfo>
				<SidebarToggleButton />
			</PluginPostStatusInfo>
		</>
	);
};

registerPlugin( 'ypg-editor-sidebar', {
	render: EditorSidebar,
} );
