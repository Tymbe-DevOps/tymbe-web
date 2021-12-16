import { Controller } from 'stimulus';
import { getOffsetTop } from '../tools/getOffsetTop';

export default class LinkSlide extends Controller {
	slideTo(event) {
		event.preventDefault();

		const el = this.element;
		const elId = el.getAttribute('href');
		const elOffset = getOffsetTop(document.querySelector(elId));

		window.scrollTo({
			behavior: 'smooth',
			left: 0,
			top: elOffset,
		});
	}
}
