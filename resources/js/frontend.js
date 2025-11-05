// eslint-disable-next-line no-unused-vars
import htmx from 'htmx.org';
import '../css/frontend.css';

document.addEventListener('DOMContentLoaded', () => {
	const modal = document.getElementById('ypg-review-modal');
	if (!modal) return;

	dragElement(modal);
	modal
		.querySelector('.close-modal')
		.addEventListener('click', () => modal.classList.add('closed'));

	function reposition(element, event = null) {
		let newLeft = element.offsetLeft;
		let newTop = element.offsetTop;

		if (event) {
			// Adjust based on dragging
			const pos1 = element._prevX - event.clientX;
			const pos2 = element._prevY - event.clientY;

			newLeft = element.offsetLeft - pos1;
			newTop = element.offsetTop - pos2;

			// Update previous positions for next move
			element._prevX = event.clientX;
			element._prevY = event.clientY;
		}

		const rect = element.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		if (rect.right > vw) newLeft = vw - rect.width;
		if (rect.bottom > vh) newTop = vh - rect.height;
		if (rect.left < 0) newLeft = 0;
		if (rect.top < 0) newTop = 0;

		element.style.left = newLeft + 'px';
		element.style.top = newTop + 'px';
		element.style.right = 'auto';
	}

	function dragElement(element) {
		let isDragging = false;

		element.style.cursor = 'grab';
		element.addEventListener('mousedown', initDragging);

		function initDragging(event) {
			if (
				event.target.closest(
					'.close-button, button, input, textarea, a, select'
				)
			) {
				return;
			}

			event.preventDefault();
			isDragging = true;

			// Store initial mouse positions on the element
			element._prevX = event.clientX;
			element._prevY = event.clientY;

			document.addEventListener('mouseup', stopDragging);
			document.addEventListener('mousemove', startDragging);

			element.style.cursor = 'grabbing';
		}

		function startDragging(event) {
			if (!isDragging) return;
			event.preventDefault();

			reposition(element, event);
		}

		function stopDragging() {
			if (!isDragging) return;
			isDragging = false;
			element.style.cursor = 'grab';

			document.removeEventListener('mouseup', stopDragging);
			document.removeEventListener('mousemove', startDragging);
		}
	}

	window.addEventListener('resize', () => reposition(modal));
});
