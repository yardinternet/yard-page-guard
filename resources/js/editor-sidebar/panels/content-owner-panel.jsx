/**
 * WordPress dependencies
 */
import {
	Notice,
	PanelBody,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useContentOwners } from '../hooks/use-content-owners';
import { usePostMeta } from '../hooks/use-post-meta';
import { META_CONTENT_OWNER_ID, META_CONTENT_OWNER_TYPE } from '../meta-keys';
import {
	NO_OWNER,
	decodeOwnerValue,
	encodeOwnerValue,
} from '../utils/owner-value';

const ContentOwnerPanel = () => {
	const { owners, isLoading, error } = useContentOwners();
	const [ meta, updateMeta ] = usePostMeta();

	const value = encodeOwnerValue(
		meta[ META_CONTENT_OWNER_ID ],
		meta[ META_CONTENT_OWNER_TYPE ]
	);

	const onChange = ( nextValue ) => {
		const { id, type } = decodeOwnerValue( nextValue );

		updateMeta( {
			[ META_CONTENT_OWNER_ID ]: id,
			[ META_CONTENT_OWNER_TYPE ]: type,
		} );
	};

	const options = [
		{
			label: __( 'Geen inhoudseigenaar', 'yard-page-guard' ),
			value: NO_OWNER,
		},
		...owners.map( ( owner ) => ( {
			label: owner.label,
			value: owner.value,
		} ) ),
	];

	return (
		<PanelBody
			title={ __( 'Inhoudseigenaren', 'yard-page-guard' ) }
			initialOpen
		>
			{ isLoading && <Spinner /> }

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ __(
						'De inhoudseigenaren konden niet worden geladen.',
						'yard-page-guard'
					) }
				</Notice>
			) }

			{ ! isLoading && ! error && (
				<SelectControl
					label={ __( 'Inhoudseigenaar', 'yard-page-guard' ) }
					help={ __(
						'Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.',
						'yard-page-guard'
					) }
					value={ value }
					options={ options }
					onChange={ onChange }
				/>
			) }
		</PanelBody>
	);
};

export default ContentOwnerPanel;
