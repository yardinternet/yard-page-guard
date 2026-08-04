/**
 * WordPress dependencies
 */
import {
	RadioControl,
	SelectControl,
	Spinner,
	__experimentalHStack as HStack,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '../components/section.jsx';
import { useDefaults } from '../hooks/use-defaults';
import { usePostMeta } from '../hooks/use-post-meta';
import {
	META_REMINDER_TIME_PERIOD,
	META_REMINDER_TIME_TYPE,
	META_REMINDER_TIME_UNIT,
} from '../config/meta-keys';
import { DATE_TYPE_CUSTOM, DATE_TYPE_DEFAULT } from '../config/constants';

const UNIT_OPTIONS = [
	{ label: __( 'Dagen', 'yard-page-guard' ), value: 'days' },
	{ label: __( 'Weken', 'yard-page-guard' ), value: 'weeks' },
	{ label: __( 'Maanden', 'yard-page-guard' ), value: 'months' },
];

const ReminderPeriodSection = () => {
	const { defaults, isLoading } = useDefaults();
	const [ meta, updateMeta ] = usePostMeta();

	const type = meta[ META_REMINDER_TIME_TYPE ] || DATE_TYPE_DEFAULT;
	const period = meta[ META_REMINDER_TIME_PERIOD ] || 0;
	const unit = meta[ META_REMINDER_TIME_UNIT ] || '';

	const onChangeType = ( nextType ) => {
		if ( DATE_TYPE_CUSTOM !== nextType ) {
			updateMeta( {
				[ META_REMINDER_TIME_TYPE ]: nextType,
				[ META_REMINDER_TIME_PERIOD ]: 0,
				[ META_REMINDER_TIME_UNIT ]: '',
			} );

			return;
		}

		// An incomplete override falls back to the site default, so seed both fields.
		updateMeta( {
			[ META_REMINDER_TIME_TYPE ]: nextType,
			[ META_REMINDER_TIME_PERIOD ]:
				period || defaults?.reminder?.period || 1,
			[ META_REMINDER_TIME_UNIT ]:
				unit || defaults?.reminder?.unit || 'weeks',
		} );
	};

	const defaultLabel = defaults?.reminder?.label
		? sprintf(
				/* translators: %s: resolved default period, e.g. "1 week". */
				__( 'Volgens de standaardinstelling (%s)', 'yard-page-guard' ),
				defaults.reminder.label
		  )
		: __( 'Volgens de standaardinstelling', 'yard-page-guard' );

	return (
		<Section>
			{ isLoading && <Spinner /> }

			<RadioControl
				label={ __( 'Herinneringsperiode', 'yard-page-guard' ) }
				help={ __(
					'Periode waarna een herinnering volgt als de controle nog niet is afgerond.',
					'yard-page-guard'
				) }
				selected={ type }
				options={ [
					{ label: defaultLabel, value: DATE_TYPE_DEFAULT },
					{
						label: __(
							'Kies een afwijkende periode',
							'yard-page-guard'
						),
						value: DATE_TYPE_CUSTOM,
					},
				] }
				onChange={ onChangeType }
			/>

			{ DATE_TYPE_CUSTOM === type && (
				<HStack alignment="bottom" spacing={ 2 }>
					<NumberControl
						__next40pxDefaultSize
						label={ __( 'Aantal', 'yard-page-guard' ) }
						min={ 1 }
						step={ 1 }
						value={ period }
						onChange={ ( nextValue ) =>
							updateMeta( {
								[ META_REMINDER_TIME_PERIOD ]:
									Number.parseInt( nextValue, 10 ) || 0,
							} )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						className="ypg-reminder-unit-select"
						label={ __( 'Eenheid', 'yard-page-guard' ) }
						value={ unit }
						options={ UNIT_OPTIONS }
						onChange={ ( nextUnit ) =>
							updateMeta( {
								[ META_REMINDER_TIME_UNIT ]: nextUnit,
							} )
						}
					/>
				</HStack>
			) }
		</Section>
	);
};

export default ReminderPeriodSection;
