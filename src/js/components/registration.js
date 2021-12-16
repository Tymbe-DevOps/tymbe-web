import { Controller } from 'stimulus';

const HASERROR = 'has-error';
const REG_WRAPPER = '.f-registration__inp, .f-registration__radios, .f-registration__checkbox';
const INP_FIX = '.inp-fix';
const TOOLTIP = '.tooltip';
const HIDE = 'u-hide';
let redirect = true;

export default class Registration extends Controller {
	static targets = ['message', 'success', 'tooltip'];
	static values = {
		url: String,
		type: String,
		next: String,
	};

	// set formdata to object
	paramsToObject(entries) {
		let result = Object.create({});
		let formEnteries = Object.create({});
		let permanentAddress = Object.create({});
		let contactAddress = Object.create({});
		let reCaptcha = Object.create({});

		for (const [key, value] of entries) {
			const newKey = key.split('.');
			if (newKey.length > 1 && newKey[0] === 'permanentAddress' && this.typeValue === 'contact') {
				permanentAddress[newKey[1]] = value;
			} else if (newKey.length > 1 && newKey[0] === 'contactAddress' && this.typeValue === 'contact') {
				contactAddress[newKey[1]] = value;
			} else {
				if (key === 'g-recaptcha-response' && this.typeValue === 'login') {
					reCaptcha = Object.defineProperty(result, 'reCaptcha', {
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
					formEnteries[key] = new Intl.DateTimeFormat('de-EN', options).format(date);
				} else {
					formEnteries[key] = value;
				}
			}
		}
		if (!this.typeValue) {
			result = formEnteries;
		} else {
			if (this.typeValue === 'contact') {
				permanentAddress = Object.defineProperty(formEnteries, 'permanentAddress', {
					value: permanentAddress,
					enumerable: true,
				});
				contactAddress = Object.defineProperty(formEnteries, 'contactAddress', {
					value: contactAddress,
					enumerable: true,
				});
				formEnteries = {
					...formEnteries,
					...permanentAddress,
					...contactAddress,
				};
			}
			if (this.typeValue === 'login') {
				formEnteries = {
					...formEnteries,
					...reCaptcha,
				};
			}

			Object.defineProperty(result, this.typeValue, {
				value: formEnteries,
				enumerable: true,
				configurable: true,
			});
		}

		return result;
	}

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
				const wrapper = element.closest(REG_WRAPPER);

				if ((!element.value && !element.validity.valid) || element.validity.typeMismatch || element.validity.patternMismatch) {
					wrapper.classList.add(HASERROR);
				}
			}
			return;
		}
	}

	back() {
		window.history.back();
	}

	redirectToNextStep(data) {
		sessionStorage.setItem('formValues', JSON.stringify(data));
		window.location.href = this.nextValue;
	}

	checkValidity(response) {
		response.data.inner.forEach((error) => {
			const path = error.path.split('.');
			const element = this.element.querySelector(`[name="${path[1]}"]`);
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

			redirect = redirect === false ? redirect : path[0] !== this.typeValue;

			if (error.type === 'recaptcha-fail' && this.typeValue === 'login') {
				this.messageTarget.innerHTML = error.message;
				this.messageTarget.classList.remove(HIDE);
			} else if (element !== null) {
				const wrapper = element.closest(REG_WRAPPER);

				if (wrapper !== null) {
					wrapper.classList.add(HASERROR);
					const inpfix = wrapper.querySelector(INP_FIX);
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

	async send(e) {
		e.preventDefault();

		const form = this.element;
		const url = this.urlValue;
		let data = new FormData(form);
		data = this.paramsToObject(new URLSearchParams(data));

		try {
			const response = await this.postData(url, data);
			redirect = true;

			if (response.status === 400) {
				this.checkValidity(response);
				if (redirect) {
					this.redirectToNextStep(response.data.value);
				}
			}
			if (response.ok) {
				sessionStorage.removeItem('formValues');
				this.successTarget.classList.remove(HIDE);
			} else {
				console.error('AJAX response error', response);
			}
		} catch (err) {
			console.error('AJAX response error', err);
		}
	}

	async postData(url, data) {
		const sessionData = JSON.parse(sessionStorage.getItem('formValues'));
		data = {
			...sessionData,
			...data,
		};

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

	connect() {
		if (sessionStorage.getItem('formValues') !== null) {
			const data = JSON.parse(sessionStorage.getItem('formValues'));
			const thisData = data[this.typeValue];

			for (const [key, value] of Object.entries(thisData)) {
				const element = this.element.querySelector(`[name="${key}"]`);
				if (element !== null) {
					if (key === 'birthDate') {
						const date = new Date(value);
						let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
						let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
						let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
						element.value = `${ye}-${mo}-${da}`;
					} else {
						element.value = value;
					}
				}
			}
		}
	}
}
