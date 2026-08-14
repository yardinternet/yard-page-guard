/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';

const INTERACTIVE_SELECTOR = 'button, input, textarea, a, select';

const clamp = ( value, max ) =>
	Math.min( Math.max( value, 0 ), Math.max( max, 0 ) );

/**
 * Lets the user drag an element around, kept inside the viewport. Touch is deliberately excluded.
 *
 * @return {Function} Callback ref
 */
export const useDraggable = () => {
	// A callback ref, not useRef: the element mounts a render later than the hook, which an
	// effect reading ref.current would miss.
	const [ element, setElement ] = useState( null );
	const grabOffset = useRef( null );

	useEffect( () => {
		if ( ! element ) {
			return;
		}

		const moveTo = ( left, top ) => {
			const { width, height } = element.getBoundingClientRect();
			// clientWidth/Height rather than innerWidth/Height: scrollbars are not usable space.
			const { clientWidth, clientHeight } = document.documentElement;

			element.style.left = `${ clamp( left, clientWidth - width ) }px`;
			element.style.top = `${ clamp( top, clientHeight - height ) }px`;
			// The element is anchored bottom-left until it is dragged; from then on top wins.
			element.style.bottom = 'auto';
		};

		const handlePointerDown = ( event ) => {
			if (
				! event.isPrimary ||
				'touch' === event.pointerType ||
				event.target.closest( INTERACTIVE_SELECTOR )
			) {
				return;
			}

			event.preventDefault();

			const { left, top } = element.getBoundingClientRect();

			grabOffset.current = {
				x: event.clientX - left,
				y: event.clientY - top,
			};

			element.classList.add( 'is-dragging' );

			try {
				element.setPointerCapture( event.pointerId );
			} catch {
				// Without capture the drag still works while the pointer stays on the element.
			}
		};

		const handlePointerMove = ( event ) => {
			if ( ! grabOffset.current ) {
				return;
			}

			moveTo(
				event.clientX - grabOffset.current.x,
				event.clientY - grabOffset.current.y
			);
		};

		const handlePointerUp = ( event ) => {
			if ( ! grabOffset.current ) {
				return;
			}

			grabOffset.current = null;
			element.classList.remove( 'is-dragging' );

			if ( element.hasPointerCapture( event.pointerId ) ) {
				element.releasePointerCapture( event.pointerId );
			}
		};

		const handleResize = () => {
			// An untouched element still sits on its CSS anchor and needs no correction.
			if ( 'auto' !== element.style.bottom ) {
				return;
			}

			const { left, top } = element.getBoundingClientRect();

			moveTo( left, top );
		};

		element.addEventListener( 'pointerdown', handlePointerDown );
		element.addEventListener( 'pointermove', handlePointerMove );
		element.addEventListener( 'pointerup', handlePointerUp );
		element.addEventListener( 'pointercancel', handlePointerUp );
		window.addEventListener( 'resize', handleResize );

		return () => {
			element.removeEventListener( 'pointerdown', handlePointerDown );
			element.removeEventListener( 'pointermove', handlePointerMove );
			element.removeEventListener( 'pointerup', handlePointerUp );
			element.removeEventListener( 'pointercancel', handlePointerUp );
			window.removeEventListener( 'resize', handleResize );
		};
	}, [ element ] );

	return setElement;
};
