// set error on element
import { tooltipTemplate } from './tooltipTemplate';

const REG_WRAPPER = '.js-registration__inp';
const INP_FIX = '.inp-fix';
const HASERROR = 'has-error';
const TOOLTIP = '.tooltip';
const HIDE = 'u-hide';

// reset all errors tooltip
export const resetError = (element) => {
	const wrapper = element.closest(REG_WRAPPER);
	const tooltip = wrapper.querySelectorAll(TOOLTIP);
	if (wrapper) {
		if (tooltip.length > 0) {
			tooltip.forEach((tooltip) => {
				if (tooltip.classList.contains(HASERROR)) {
					tooltip.remove();
				} else {
					tooltip.classList.remove(HIDE);
				}
			});
		}

		wrapper.classList.remove(HASERROR);
	}
};

export const setInputError = (err, el) => {
	const name = el.attributes.name.value;

	for (const error of err.inner) {
		if (error.path === name) {
			setTootlipError(el, error.message);
		}
	}
};

export const setError = (err, el) => {
	for (const error of err.inner) {
		let element = el;
		const path = error.path && error.path.includes('.') && error.path.split('.');
		if (path && (path[0] === 'user' || path[0] === 'login')) {
			element = typeof path === 'object' ? element.querySelector(`[name='${path[1]}']`) : element.querySelector(`[name='${path}']`);
		} else {
			element = error.path ? element.querySelector(`[name='${error.path}']`) : element;
		}

		if (!element) return;
		setTootlipError(element, error.message);
	}
};

export const setTootlipError = (el, message) => {
	resetError(el);
	const wrapper = el.closest(REG_WRAPPER);
	if (wrapper) {
		// set error class to wrapper
		wrapper.classList.add(HASERROR);

		// find input fix and tooltip with error
		const inpfix = wrapper.querySelector(INP_FIX);
		const tooltipButton = wrapper.querySelector(TOOLTIP);
		const errorMessage = message;

		// insert error if tooltip doesn't exist
		if (tooltipButton) {
			tooltipButton.classList.add(HIDE);
		}

		// set error messages
		const tooltipTpl = tooltipTemplate(errorMessage);
		if (inpfix) {
			inpfix.insertAdjacentHTML('beforeend', tooltipTpl);
		} else {
			wrapper.insertAdjacentHTML('beforeend', tooltipTpl);
		}
	}
};
