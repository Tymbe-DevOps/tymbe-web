/* eslint-disable babel/no-unused-expressions */

export const setupDotBtns = (dotsArray, embla) => {
	dotsArray.forEach((dotNode, i) => {
		dotNode.addEventListener('click', () => embla.scrollTo(i), false);
	});
};

export const generateDotBtns = (dots, embla) => {
	const template = '<button class="embla__dot" type="button"></button>';
	dots.innerHTML = embla.scrollSnapList().reduce((acc) => acc + template, '');
	const dotsAll = dots.querySelectorAll('.embla__dot');
	if (dotsAll.length == 1) {
		dots.classList.add('is-disabled');
	} else {
		dots.classList.remove('is-disabled');
	}
	return [].slice.call(dots.querySelectorAll('.embla__dot'));
};

export const selectDotBtn = (dotsArray, embla) => () => {
	const previous = embla.previousScrollSnap();
	const selected = embla.selectedScrollSnap();
	dotsArray[previous].classList.remove('is-selected');
	dotsArray[selected].classList.add('is-selected');
};
