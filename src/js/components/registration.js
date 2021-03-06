import { Controller } from 'stimulus';
import { resetError, setError, setInputError, setTootlipError } from './validation/setError';
import { paramsToObject } from './validation/paramsToObject';
import { personInfo, contactsInfo, loginInfo } from './validation/yupValidationSetting';

let redirect = true;
let isFormValid = false;
const HASERROR = 'has-error';
const ISLOADING = 'is-loading';
const HIDE = 'u-hide';

export default class Registration extends Controller {
	static targets = ['message', 'acceptDataProcessing', 'loader'];
	static values = {
		url: String,
		type: String,
		next: String,
	};

	inputValidate(element) {
		const target = element.target;
		const name = target.attributes.name.value;
		const schema = this.getSchema();
		const data = this.getData();

		resetError(target);
		schema.validate(data, { abortEarly: false }).catch((e) => {
			for (const error of e.inner) {
				if (error.path === name) {
					setInputError(e, target);
				}
			}
		});
	}

	getData() {
		const form = this.element;
		let data = new FormData(form);
		data = paramsToObject(new URLSearchParams(data), this.typeValue);
		data = this.typeValue ? data[this.typeValue] : data;

		return data;
	}

	getSchema() {
		let schema = {};

		if (this.typeValue === 'user') {
			schema = personInfo;
		} else if (this.typeValue === 'contact') {
			schema = contactsInfo;
		} else if (this.typeValue === 'login') {
			schema = loginInfo;
		}

		return schema;
	}

	setLoader() {
		this.loaderTarget.classList.add(ISLOADING);
	}

	removeLoader() {
		this.loaderTarget.classList.remove(ISLOADING);
	}

	async formValidate() {
		const schema = this.getSchema();
		const data = this.getData();
		this.setLoader();

		schema.validate(data, { abortEarly: false }).catch((err) => {
			setError(err, this.element);
			this.removeLoader();
			return;
		});

		const isValid = await schema.isValid(data);
		isFormValid = isValid;
	}

	addressValidate() {
		const isSK = event.target.value === 'sk';
		const elements = this.context.element.querySelectorAll('[name*="contactAddress"]');
		const select = this.context.element.querySelector('[name="contactAddress.country"]');
		const schema = this.getSchema();

		if (elements.length > 0) {
			elements.forEach((element) => {
				if (isSK) {
					element.attributes.required = true;
					element.setAttribute('required', true);
					element.setAttribute('aria-required', 'true');
					select.value = 'cz';
				} else {
					resetError(element);
					element.attributes.required = false;
					element.removeAttribute('required');
					element.removeAttribute('aria-required');
				}
			});
		}

		resetError(select);
		schema.validate(this.getData(), { abortEarly: false }).catch((err) => {
			for (const error of err.inner) {
				const hasContact = error.type === 'has-contact-address';
				if (hasContact) {
					setTootlipError(select, error.message);
				}
			}
		});
	}

	back() {
		window.history.back();
	}

	redirectToNextStep(data) {
		sessionStorage.setItem('formValues', JSON.stringify(data));
		if (this.typeValue === 'user') {
			sessionStorage.setItem('userUrl', window.location.href);
		}
		window.location.href = this.nextValue;
	}

	checkValidity(response) {
		setError(response.data, this.element);
		response.data.inner.forEach((error) => {
			const path = error.path.split('.');

			if (this.typeValue === 'login' && path[0] === 'user') {
				const url = sessionStorage.getItem('userUrl');
				sessionStorage.setItem('validationError', JSON.stringify(response.data));
				window.location.href = url;
			}

			redirect = redirect === false ? redirect : path[0] !== this.typeValue;

			if (error.type === 'recaptcha-fail' && this.typeValue === 'login') {
				this.messageTarget.innerHTML = error.message;
				this.messageTarget.classList.add(HASERROR);
				this.messageTarget.classList.remove(HIDE);
			}
		});
	}

	async send(e) {
		e.preventDefault();
		if (!isFormValid) return;

		const form = this.element;
		const url = this.urlValue;
		let data = new FormData(form);
		data = paramsToObject(new URLSearchParams(data), this.typeValue);
		isFormValid = false;

		try {
			const response = await this.postData(url, data);
			redirect = true;

			if (response.status === 400) {
				this.checkValidity(response);
				if (redirect) {
					this.redirectToNextStep(response.data.value);
				}
			}
		} catch (err) {
			console.error('Data response error', err);
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

		if (response.ok) {
			const locationHref = this.nextValue;
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				event: 'gaevent',
				category: 'Forms',
				action: 'Submit',
				label: 'Tymber Registration',
				eventCallback: function() {
					document.location = locationHref;
				},
				eventTimeout: 2000,
			});
			sessionStorage.removeItem('formValues');
			sessionStorage.removeItem('validationError');
			sessionStorage.removeItem('userUrl');
			// window.location.href = this.nextValue;
		} else if (!response.ok && response.status !== 400) {
			this.removeLoader();
			throw new Error('Network response was not ok.');
		} else {
			console.error('Response error', response);
			this.removeLoader();
		}

		return await response.json();
	}

	setValue(element, value) {
		if (element !== null && value !== '') {
			const wrapper = element.closest('[data-controller="FocusInput"]');
			if (wrapper) {
				wrapper.classList.add('has-focus');
			}
			if (element.type === 'radio' || element.type === 'checkbox') {
				element.checked = element.value;
			} else {
				element.value = value;
			}
		}
	}

	connect() {
		if (sessionStorage.getItem('validationError') !== null) {
			const err = JSON.parse(sessionStorage.getItem('validationError'));
			setError(err, this.element);
		}
		if (sessionStorage.getItem('formValues') !== null) {
			const data = JSON.parse(sessionStorage.getItem('formValues'));
			const thisData = data[this.typeValue];

			for (const [key, value] of Object.entries(thisData)) {
				const parentKey = key;
				if (typeof value === 'object') {
					for (const [key, value] of Object.entries(value)) {
						const element = this.element.querySelector(`[name="${parentKey}.${key}"]`);
						this.setValue(element, value);
					}
				} else {
					const element = this.element.querySelector(`[name="${key}"]`);
					this.setValue(element, value);
				}
			}
		}
	}
}
