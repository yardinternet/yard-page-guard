/**
 * WordPress dependencies
 */
import {
	Button,
	Notice,
	Spinner,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '../components/section.jsx';
import { useEditorPost } from '../hooks/use-editor-post';
import { useMarkReviewed } from '../hooks/use-mark-reviewed';
import { useNextReviewDate } from '../hooks/use-next-review-date';
import { useReviewStatus } from '../hooks/use-review-status';

const StatusSection = () => {
	const { postId, isNew, isDirty, isSaving } = useEditorPost();
	const { status, isLoading, refresh } = useReviewStatus(
		isNew ? null : postId
	);
	const {
		markReviewed,
		isSaving: isMarking,
		error,
		isSuccess,
	} = useMarkReviewed( postId, refresh );

	const isBlocked = isNew || isDirty || isSaving;

	const lastReviewed = status?.lastReviewDate?.formatted;
	const nextReview = useNextReviewDate();

	const blockedHelp = isNew
		? __( 'Publiceer of sla deze pagina eerst op.', 'yard-page-guard' )
		: __( 'Sla je wijzigingen eerst op.', 'yard-page-guard' );

	const buttonHelp = isBlocked
		? blockedHelp
		: __(
				'Bevestigt dat je de inhoud van deze pagina opnieuw hebt gecontroleerd.',
				'yard-page-guard'
		  );

	return (
		<Section title={ __( 'Status', 'yard-page-guard' ) }>
			{ isLoading && <Spinner /> }

			{ ! isLoading && (
				<VStack spacing={ 3 }>
					<VStack spacing={ 0 }>
						<Text variant="muted">
							{ __( 'Laatst gecontroleerd', 'yard-page-guard' ) }
						</Text>
						<Text>
							{ lastReviewed ||
								__(
									'Nog niet gecontroleerd',
									'yard-page-guard'
								) }
						</Text>
					</VStack>

					<VStack spacing={ 0 }>
						<Text variant="muted">
							{ __(
								'Volgende herzieningsdatum',
								'yard-page-guard'
							) }
						</Text>
						<Text>
							{ nextReview ||
								__( 'Nog niet ingesteld', 'yard-page-guard' ) }
						</Text>
					</VStack>
				</VStack>
			) }

			<Button
				__next40pxDefaultSize
				variant="secondary"
				icon="yes"
				disabled={ isBlocked || isMarking }
				accessibleWhenDisabled
				isBusy={ isMarking }
				onClick={ markReviewed }
			>
				{ __( 'Markeer als gecontroleerd', 'yard-page-guard' ) }
			</Button>

			<Text variant="muted">{ buttonHelp }</Text>

			{ isSuccess && (
				<Notice status="success" isDismissible={ false }>
					{ __(
						'Bedankt, de pagina is gemarkeerd als gecontroleerd.',
						'yard-page-guard'
					) }
				</Notice>
			) }

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
		</Section>
	);
};

export default StatusSection;
