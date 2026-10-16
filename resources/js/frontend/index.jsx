/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Modal from './components/modal.jsx';
import './styles.css';

document.addEventListener( 'DOMContentLoaded', () => {
	const container = document.getElementById( 'ypg-review-modal' );

	if ( ! container ) {
		return;
	}

	const { reviewToken, modalInfoEndpoint, postId } = container.dataset;

	if ( ! reviewToken || ! modalInfoEndpoint || ! postId ) {
		return;
	}

	createRoot( container ).render(
		<Modal
			endpoint={ modalInfoEndpoint }
			postId={ Number( postId ) }
			token={ reviewToken }
		/>
	);
} );
