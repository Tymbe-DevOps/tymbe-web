/* eslint-disable babel/no-unused-expressions */

export const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
	return () => {
		if (embla.canScrollPrev()) prevBtn.removeAttribute('disabled');
		else prevBtn.setAttribute('disabled', 'disabled');

		if (embla.canScrollNext()) nextBtn.removeAttribute('disabled');
		else nextBtn.setAttribute('disabled', 'disabled');
	};
};
