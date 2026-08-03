/**
 * WordPress dependencies
 */
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { META_CONTENT_OWNER_ID } from '../meta-keys';
import { getContentOwnerOptions } from '../localized-data';

const ContentOwnerPanel = () => {
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	const options = [
		{ label: __( 'Geen inhoudseigenaar', 'yard-page-guard' ), value: '' },
		...getContentOwnerOptions(),
	];

	return (
		<PanelBody
			title={ __( 'Inhoudseigenaren', 'yard-page-guard' ) }
			initialOpen
		>
			<SelectControl
				// __next40pxDefaultSize
				// __nextHasNoMarginBottom
				label={ __( 'Inhoudseigenaar', 'yard-page-guard' ) }
				help={ __(
					'Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.',
					'yard-page-guard'
				) }
				value={ meta?.[ META_CONTENT_OWNER_ID ] ?? '' }
				options={ options }
				onChange={ ( value ) =>
					setMeta( { ...meta, [ META_CONTENT_OWNER_ID ]: value } )
				}
			/>
		</PanelBody>
	);
};

export default ContentOwnerPanel;
