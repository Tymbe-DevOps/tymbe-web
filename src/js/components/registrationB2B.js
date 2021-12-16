import { Controller } from 'stimulus';

// constants
const HASERROR = 'has-error';
const REGISTRATION_INP = '.f-registration__inp';
const INPFIX = '.inp-fix';
const TOOLTIP = '.tooltip:not([data-registrationb2b-target="tooltip"])';
const HIDE = 'u-hide';

export default class RegistrationB2C extends Controller {
	// stimulus variables
	static targets = ['message', 'success', 'tooltip'];
	static values = {
		url: String,
	};

	// set formdata to object
	paramsToObject(entries) {
		const result = {};
		for (const [key, value] of entries) {
			if (key === 'g-recaptcha-response') {
				Object.defineProperty(result, 'reCaptcha', {
					value: value,
					enumerable: true,
				});
			}
			if (key === 'birthDate') {
				const date = new Date(value);
				const options = {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				};
				// have to format by using de-EN because cs-CZ have spacing
				result[key] = new Intl.DateTimeFormat('de-EN', options).format(date);
			} else {
				result[key] = value;
			}
		}
		return result;
	}

	// validation of reqiured fields
	formValidate() {
		this.messageTarget.classList.add(HIDE);
		const hasError = this.element.querySelectorAll('.' + HASERROR);
		hasError.forEach((element) => {
			element.classList.remove(HASERROR);
		});
		this.tooltipTargets.forEach((tooltip) => {
			tooltip.classList.add(HIDE);
		});

		if (!this.element.checkValidity()) {
			for (const element of this.element.querySelectorAll('[required]')) {
				const wrapper = element.closest(REGISTRATION_INP);

				if ((!element.value && !element.validity.valid) || element.validity.typeMismatch || element.validity.patternMismatch) {
					wrapper.classList.add(HASERROR);
				}
			}
			return;
		}
	}

	// send method
	async send(e) {
		e.preventDefault();

		const form = this.element;
		const url = this.urlValue;
		let data = new FormData(form);
		data = this.paramsToObject(new URLSearchParams(data));

		try {
			const response = await this.postData(url, data);
			// check form validity
			if (response.status === 400) {
				response.data.inner.forEach((error) => {
					const tooltipTemplate = `
						<button type="button" class="tooltip" data-registrationb2b-target="tooltip">
							<span class="icon-svg icon-svg--info" aria-hidden="true">
								<svg class="icon-svg__svg" xmlns:xlink="http://www.w3.org/1999/xlink">
									<use xlink:href="../img/bg/icons-svg.svg#icon-info" width="100%" height="100%" focusable="false"></use>
								</svg>
							</span>
							<span class="u-vhide"> Info </span>
							<span class="tooltip__content">
								<span class="tooltip__text">${error.message}</span>
							</span>
						</button>`;
					const element = this.element.querySelector(`[name=${error.path}]`);

					if (error.type === 'recaptcha-fail') {
						this.messageTarget.innerHTML = error.message;
						this.messageTarget.classList.remove(HIDE);
					} else if (element !== null) {
						const wrapper = element.closest(REGISTRATION_INP);

						if (wrapper !== null) {
							wrapper.classList.add(HASERROR);
							const inpfix = wrapper.querySelector(INPFIX);
							const tooltip = wrapper.querySelector(TOOLTIP);

							if (tooltip !== null) {
								const text = tooltip.querySelector('.tooltip__text');
								text.innerHTML = error.message;
								tooltip.classList.remove(HIDE);
							} else if (inpfix !== null) {
								inpfix.insertAdjacentHTML('beforeend', tooltipTemplate);
							}
						}
					}
				});
			}
			if (response.ok) {
				this.successTarget.classList.remove(HIDE);
			} else {
				console.error('AJAX response error', response);
			}
		} catch (err) {
			console.error('AJAX response error', err);
		}
	}

	// send post data method
	async postData(url, data) {
		const response = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			body: JSON.stringify(data),
		});

		if (!response.ok && response.status !== 400) {
			throw new Error('Network response was not ok.');
		}

		return await response.json();
	}
}
