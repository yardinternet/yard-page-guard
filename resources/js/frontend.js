// eslint-disable-next-line no-unused-vars
import htmx from 'htmx.org';
import '../css/frontend.css';

document.addEventListener('DOMContentLoaded', function () {
	initReviewModal();
});

function initReviewModal() {
	const modal = document.getElementById('ypg-review-modal');
	if (!modal) return;

	enableDrag(modal);

	const closeButton = modal.querySelector('.close-modal');
	if (closeButton) {
		closeButton.addEventListener('click', function () {
			modal.classList.add('closed');
		});
	}

	window.addEventListener('resize', function () {
		reposition(modal);
	});
}

/**
 * Handles element repositioning (through dragging)
 * @param {HTMLElement} element
 * @param {Event}       event
 */
function reposition(element, event) {
	let newLeft = element.offsetLeft;
	let newTop = element.offsetTop;

	if (event) {
		const deltaX = element._prevX - event.clientX;
		const deltaY = element._prevY - event.clientY;

		newLeft = element.offsetLeft - deltaX;
		newTop = element.offsetTop - deltaY;

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

// ------------------------------
// Enable dragging for modal
// ------------------------------
function enableDrag(element) {
	let isDragging = false;

	element.style.cursor = 'grab';
	element.addEventListener('mousedown', initDragging);

	function initDragging(event) {
		if (
			event.target.closest(
				'.close-button, button, input, textarea, a, select'
			)
		)
			return;

		event.preventDefault();
		isDragging = true;

		element._prevX = event.clientX;
		element._prevY = event.clientY;

		document.addEventListener('mousemove', startDragging);
		document.addEventListener('mouseup', stopDragging);

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

		document.removeEventListener('mousemove', startDragging);
		document.removeEventListener('mouseup', stopDragging);
	}
}
