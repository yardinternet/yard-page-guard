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

	function dragElement(el) {
		let pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		let isDragging = false;

		el.style.cursor = 'grab';
		el.addEventListener('mousedown', initDragging);

		function initDragging(e) {
			if (
				e.target.closest(
					'.close-button, button, input, textarea, a, select'
				)
			) {
				return;
			}

			e.preventDefault();
			isDragging = true;
			pos3 = e.clientX;
			pos4 = e.clientY;

			document.addEventListener('mouseup', stopDragging);
			document.addEventListener('mousemove', startDragging);

			el.style.cursor = 'grabbing';
		}

		function startDragging(e) {
			if (!isDragging) return;
			e.preventDefault();

			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;

			let newTop = el.offsetTop - pos2;
			let newLeft = el.offsetLeft - pos1;

			// keep modal within view
			const rect = el.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			newLeft = Math.max(0, Math.min(newLeft, vw - rect.width));
			newTop = Math.max(0, Math.min(newTop, vh - rect.height));

			el.style.top = newTop + 'px';
			el.style.left = newLeft + 'px';
			el.style.right = 'auto';
		}

		function stopDragging() {
			if (!isDragging) return;
			isDragging = false;
			el.style.cursor = 'grab';

			document.removeEventListener('mouseup', stopDragging);
			document.removeEventListener('mousemove', startDragging);
		}
	}
});
