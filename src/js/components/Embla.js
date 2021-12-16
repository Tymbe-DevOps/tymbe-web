import { Controller } from 'stimulus';
import EmblaCarousel from 'embla-carousel';
import { disablePrevNextBtns } from './carousel/prevAndNextButtons';
import { setupDotBtns, generateDotBtns, selectDotBtn } from './carousel/dotButtons';

export default class Embla extends Controller {
	static targets = ['viewport', 'prevButton', 'nextButton', 'dots'];

	carousel = null;

	connect() {
		const optionsDefault = { loop: false, align: 'start', containScroll: 'trimSnaps' };

		this.carousel = EmblaCarousel(this.viewportTarget, optionsDefault);

		const toggleEmblaReady = (event) => {
			const isResizeEvent = event === 'resize';
			const toggleClass = isResizeEvent ? 'remove' : 'add';
			this.viewportTarget.classList[toggleClass]('embla--is-ready');
			if (isResizeEvent) this.carousel.reInit();
		};

		if (this.hasPrevButtonTarget && this.hasNextButtonTarget) {
			const disablePrevAndNextBtns = disablePrevNextBtns(this.prevButtonTarget, this.nextButtonTarget, this.carousel);

			this.carousel.on('select', disablePrevAndNextBtns);
			this.carousel.on('init', disablePrevAndNextBtns);
			this.carousel.on('init', toggleEmblaReady);
			this.carousel.on('resize', toggleEmblaReady);
			this.carousel.on('reInit', toggleEmblaReady);
		}

		if (this.hasDotsTarget) {
			const dotsArray = generateDotBtns(this.dotsTarget, this.carousel);
			const setSelectedDotBtn = selectDotBtn(dotsArray, this.carousel);

			setupDotBtns(dotsArray, this.carousel);

			this.carousel.on('select', setSelectedDotBtn);
			this.carousel.on('init', setSelectedDotBtn);
		}
	}

	prev(event) {
		event.preventDefault();
		this.carousel.scrollPrev();
	}

	next(event) {
		event.preventDefault();
		this.carousel.scrollNext();
	}
}
