/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDraggable } from '../hooks/use-draggable';
import { useModalInfo } from '../hooks/use-modal-info';
import { useVerifyPost } from '../hooks/use-verify-post';
import Alert from './alert.jsx';

/**
 * @param {Object} props
 * @param {string} props.endpoint
 * @param {number} props.postId
 * @param {string} props.token
 * @return {?Element} modal
 */
const Modal = ( { endpoint, postId, token } ) => {
	const [ isClosed, setIsClosed ] = useState( false );
	const modalRef = useDraggable();
	const { data, isLoading, error } = useModalInfo( endpoint, postId, token );
	const {
		verify,
		isSaving,
		error: verifyError,
		message: successMessage,
	} = useVerifyPost( data?.endpoint, postId, token );

	if ( isLoading ) {
		return null;
	}

	const handleSubmit = ( event ) => {
		event.preventDefault();
		verify();
	};

	return (
		<div
			ref={ modalRef }
			className={ `ypg-review-modal${ isClosed ? ' is-closed' : '' }` }
			role="dialog"
			aria-label={ __( 'Inhoudscontrole', 'yard-page-guard' ) }
			aria-hidden={ isClosed }
		>
			<button
				type="button"
				className="ypg-review-modal-close"
				aria-label={ __( 'Sluit venster', 'yard-page-guard' ) }
				onClick={ () => setIsClosed( true ) }
			>
				<span aria-hidden="true">&times;</span>
			</button>

			{ error && <Alert status="error" message={ error.message } /> }

			{ ! error && (
				<form
					className="ypg-review-modal-form"
					onSubmit={ handleSubmit }
				>
					{ successMessage ? (
						<Alert status="success" message={ successMessage } />
					) : (
						<>
							<h2 className="ypg-review-modal-title">
								{ __( 'Inhoudscontrole', 'yard-page-guard' ) }
							</h2>

							<p className="ypg-review-modal-description">
								{ sprintf(
									/* translators: %s: title of the page being reviewed. */
									__(
										'Je bent momenteel de pagina "%s" aan het controleren op houdbaarheid.',
										'yard-page-guard'
									),
									data.title
								) }
							</p>

							{ verifyError && (
								<Alert
									status="error"
									message={ verifyError.message }
									isInline
								/>
							) }

							<button
								type="submit"
								className="ypg-review-modal-submit"
								disabled={ isSaving }
								aria-busy={ isSaving }
							>
								<svg
									className="ypg-review-modal-submit-icon"
									width="24"
									height="24"
									viewBox="0 0 91 91"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path d="M68.0508 24.2617C69.4473 25.5508 69.4473 27.8066 68.0508 29.0957L40.5508 56.5957C39.2617 57.9922 37.0059 57.9922 35.7168 56.5957L21.9668 42.8457C20.5703 41.5566 20.5703 39.3008 21.9668 38.0117C23.2559 36.6152 25.5117 36.6152 26.8008 38.0117L38.1875 49.291L63.2168 24.2617C64.5059 22.8652 66.7617 22.8652 68.0508 24.2617Z" />
								</svg>

								{ __(
									'Markeer als gecontroleerd',
									'yard-page-guard'
								) }
							</button>

							{ data.footer && (
								<div
									className="ypg-review-modal-footer"
									dangerouslySetInnerHTML={ {
										__html: data.footer,
									} }
								/>
							) }
						</>
					) }
				</form>
			) }
		</div>
	);
};

export default Modal;
