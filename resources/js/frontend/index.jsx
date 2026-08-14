/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Modal from './components/modal.jsx';
import './styles.css';

document.addEventListener( 'DOMContentLoaded', async () => {
	const container = document.getElementById( 'ypg-review-modal' );

	if ( ! container ) {
		return;
	}

	createRoot( container ).render( <Modal /> );
} );
