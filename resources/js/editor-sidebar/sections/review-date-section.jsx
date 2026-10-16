/**
 * WordPress dependencies
 */
import { DatePicker, RadioControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '../components/section.jsx';
import { useDefaults } from '../hooks/use-defaults';
import { usePostMeta } from '../hooks/use-post-meta';
import { META_REVIEW_DATE, META_REVIEW_DATE_TYPE } from '../config/meta-keys';
import { DATE_TYPE_CUSTOM, DATE_TYPE_DEFAULT } from '../config/constants';
import { todayYmd, toYmd } from '../utils/date';
import { defaultSettingLabel } from '../utils/default-label';

const ReviewDateSection = () => {
	const { defaults, isLoading } = useDefaults();
	const [ meta, updateMeta ] = usePostMeta();

	const type = meta[ META_REVIEW_DATE_TYPE ] || DATE_TYPE_DEFAULT;
	const date = meta[ META_REVIEW_DATE ] || '';

	const onChangeType = ( nextType ) => {
		// Clearing the date is what makes the backend resolve the site default on save.
		updateMeta(
			DATE_TYPE_CUSTOM === nextType
				? { [ META_REVIEW_DATE_TYPE ]: nextType }
				: {
						[ META_REVIEW_DATE_TYPE ]: nextType,
						[ META_REVIEW_DATE ]: '',
				  }
		);
	};

	const defaultLabel = defaultSettingLabel( defaults?.review );

	return (
		<Section>
			{ isLoading && <Spinner /> }

			<RadioControl
				label={ __( 'Herzieningsdatum', 'yard-page-guard' ) }
				help={ __(
					'Datum waarop de inhoudseigenaar de eerste controlemail ontvangt.',
					'yard-page-guard'
				) }
				selected={ type }
				options={ [
					{ label: defaultLabel, value: DATE_TYPE_DEFAULT },
					{
						label: __(
							'Kies eenmalig een afwijkende datum',
							'yard-page-guard'
						),
						value: DATE_TYPE_CUSTOM,
					},
				] }
				onChange={ onChangeType }
			/>

			{ DATE_TYPE_CUSTOM === type && (
				<DatePicker
					currentDate={ date || defaults?.review?.date || null }
					onChange={ ( nextDate ) =>
						updateMeta( {
							[ META_REVIEW_DATE ]: toYmd( nextDate ),
						} )
					}
					isInvalidDate={ ( candidate ) =>
						toYmd( candidate ) < todayYmd()
					}
				/>
			) }
		</Section>
	);
};

export default ReviewDateSection;
