/**
 * WordPress dependencies
 */
import { __experimentalDivider as Divider } from '@wordpress/components';
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
import ContentOwnerSection from './sections/content-owner-section.jsx';
import ReviewDateSection from './sections/review-date-section.jsx';
import ReminderPeriodSection from './sections/reminder-period-section.jsx';
import StatusSection from './sections/status-section.jsx';
import { usePostMeta } from './hooks/use-post-meta';
import { META_CONTENT_OWNER_ID } from './config/meta-keys';
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
				<SidebarBody />
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

const SidebarBody = () => {
	const [ meta ] = usePostMeta();
	const hasOwner = Number.parseInt( meta[ META_CONTENT_OWNER_ID ], 10 ) > 0;

	return (
		<div className="ypg-editor-sidebar">
			<ContentOwnerSection />

			{ hasOwner && (
				<>
					<Divider margin={ 4 } />
					<ReviewDateSection />
					<Divider margin={ 4 } />
					<ReminderPeriodSection />
					<Divider margin={ 4 } />
					<StatusSection />
				</>
			) }
		</div>
	);
};

registerPlugin( 'ypg-editor-sidebar', {
	render: EditorSidebar,
} );
