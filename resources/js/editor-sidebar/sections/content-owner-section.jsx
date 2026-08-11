/**
 * WordPress dependencies
 */
import { Notice, SelectControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '../components/section.jsx';
import { useContentOwners } from '../hooks/use-content-owners';
import { usePostMeta } from '../hooks/use-post-meta';
import {
	META_CONTENT_OWNER_ID,
	META_CONTENT_OWNER_TYPE,
	META_REVIEW_DATE,
	META_REVIEW_DATE_TYPE,
	META_REMINDER_TIME_PERIOD,
	META_REMINDER_TIME_TYPE,
	META_REMINDER_TIME_UNIT,
} from '../config/meta-keys';
import { DATE_TYPE_DEFAULT } from '../config/constants';
import {
	NO_OWNER,
	decodeOwnerValue,
	encodeOwnerValue,
} from '../utils/owner-value';

const ContentOwnerSection = () => {
	const { owners, isLoading, error } = useContentOwners();
	const [ meta, updateMeta ] = usePostMeta();

	const value = encodeOwnerValue(
		meta[ META_CONTENT_OWNER_ID ],
		meta[ META_CONTENT_OWNER_TYPE ]
	);

	const onChange = ( nextValue ) => {
		const { id, type } = decodeOwnerValue( nextValue );

		if ( ! id ) {
			updateMeta( {
				[ META_CONTENT_OWNER_ID ]: 0,
				[ META_CONTENT_OWNER_TYPE ]: '',
				[ META_REVIEW_DATE_TYPE ]: DATE_TYPE_DEFAULT,
				[ META_REVIEW_DATE ]: '',
				[ META_REMINDER_TIME_TYPE ]: DATE_TYPE_DEFAULT,
				[ META_REMINDER_TIME_PERIOD ]: 0,
				[ META_REMINDER_TIME_UNIT ]: '',
			} );

			return;
		}

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
		<Section>
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
					__nextHasNoMarginBottom
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
		</Section>
	);
};

export default ContentOwnerSection;
