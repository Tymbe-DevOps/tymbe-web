import { Controller } from 'stimulus';
import { resetError, setError, setInputError } from './validation/setError';
import { registrationSchema } from './validation/yupValidationSettingB2B';

// constants
const HIDE = 'u-hide';
const ISLOADING = 'is-loading';

export default class RegistrationB2C extends Controller {
	// stimulus variables
	static targets = ['message', 'loader'];
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
			result[key] = value;
		}
		return result;
	}

	getData() {
		const form = this.element;
		let data = new FormData(form);
		data = this.paramsToObject(new URLSearchParams(data));

		return data;
	}

	inputValidate(element) {
		const target = element.target;
		const name = target.attributes.name.value;
		const data = this.getData();

		resetError(target);
		registrationSchema.validate(data, { stripUnknown: true, abortEarly: false }).catch((e) => {
			for (const error of e.inner) {
				if (error.path === name) {
					setInputError(e, target);
				}
			}
		});
	}

	setLoader() {
		this.loaderTarget.classList.add(ISLOADING);
	}

	removeLoader() {
		this.loaderTarget.classList.remove(ISLOADING);
	}

	formValidate() {
		this.setLoader();
		registrationSchema.validate(this.getData(), { stripUnknown: true, abortEarly: false }).catch((err) => {
			setError(err, this.element);
			this.removeLoader();
		});
	}

	resetFilledInput() {
		const inputsWrapper = this.element.querySelectorAll('[data-controller="FocusInput"]');
		inputsWrapper.forEach((wrapper) => {
			if (wrapper) {
				const element = wrapper.querySelector('.is-filled');
				console.log(element);
				wrapper.classList.remove('has-focus');
				if (element) {
					element.classList.remove('is-filled');
				}
			}
		});
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
			if (response.status === 400) {
				setError(response.data, this.element);
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

		if (response.ok) {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				event: 'gaevent',
				category: 'Forms',
				action: 'Submit',
				label: 'Company Registration',
			});
			this.messageTarget.classList.add('message--ok');
			this.messageTarget.classList.remove(HIDE);
			this.element.reset();
			this.removeLoader();
			this.resetFilledInput();
		} else if (!response.ok && response.status !== 400) {
			this.removeLoader();
			throw new Error('Network response was not ok.');
		} else {
			console.error('AJAX response error', response);
			this.removeLoader();
		}

		return await response.json();
	}
}
