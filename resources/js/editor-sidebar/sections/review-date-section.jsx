/**
 * WordPress dependencies
 */
import { DatePicker, RadioControl, Spinner } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '../components/section.jsx';
import { useDefaults } from '../hooks/use-defaults';
import { usePostMeta } from '../hooks/use-post-meta';
import { META_REVIEW_DATE, META_REVIEW_DATE_TYPE } from '../config/meta-keys';
import { DATE_TYPE_CUSTOM, DATE_TYPE_DEFAULT } from '../config/constants';
import { todayYmd, toYmd } from '../utils/date';

const ReviewDateSection = () => {
	const { defaults, isLoading } = useDefaults();
	const [ meta, updateMeta ] = usePostMeta();

	const type = meta[ META_REVIEW_DATE_TYPE ] || DATE_TYPE_DEFAULT;
	const date = meta[ META_REVIEW_DATE ] || '';

	const onChangeType = ( nextType ) => {
		// Clearing the date is what makes ReviewScheduler resolve the site default;
		// it keeps an existing date otherwise, so saving never moves the date.
		updateMeta(
			DATE_TYPE_CUSTOM === nextType
				? { [ META_REVIEW_DATE_TYPE ]: nextType }
				: {
						[ META_REVIEW_DATE_TYPE ]: nextType,
						[ META_REVIEW_DATE ]: '',
				  }
		);
	};

	const defaultLabel = defaults?.review?.label
		? sprintf(
				/* translators: %s: resolved default period, e.g. "1 week". */
				__( 'Volgens de standaardinstelling (%s)', 'yard-page-guard' ),
				defaults.review.label
		  )
		: __( 'Volgens de standaardinstelling', 'yard-page-guard' );

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
					currentDate={ date || null }
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
