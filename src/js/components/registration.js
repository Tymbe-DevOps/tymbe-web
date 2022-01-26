import { Controller } from 'stimulus';
import { resetError, setError } from './validation/setError';
import { paramsToObject } from './validation/paramsToObject';
import { personInfo, contactsInfo, loginInfo } from './validation/yupValidationSetting';

const HASERROR = 'has-error';
const TOOLTIP = '.tooltip';
// const REG_WRAPPER = '.f-registration__inp, .f-registration__radios, .f-registration__checkbox';
// const INP_FIX = '.inp-fix';
const HIDE = 'u-hide';
let redirect = true;

export default class Registration extends Controller {
	static targets = ['message', 'tooltip', 'acceptDataProcessing'];
	static values = {
		url: String,
		type: String,
		next: String,
	};

	inputValidate(element) {
		const target = element.target;
		const name = target.attributes.name.value.includes('.') ? target.attributes.name.value.split('.') : target.attributes.name.value;
		const value = target.value;
		const schema = this.getSchema();

		if (value.length > 0) {
			if (typeof name === 'object') {
				schema.fields[name[0]].fields[name[1]].isValid(value).then(function(valid) {
					if (!valid) {
						return;
					}
					resetError(target);
				});
				schema.fields[name[0]].fields[name[1]].validate(value, { abortEarly: false }).catch((err) => {
					setError(err, target);
				});
			} else {
				schema.fields[name].isValid(value).then(function(valid) {
					if (!valid) {
						return;
					}
					resetError(target);
				});
				schema.fields[name].validate(value, { abortEarly: false }).catch((err) => {
					setError(err, target);
				});
			}
		}
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

	schemaValidate() {
		const form = this.element;
		let data = new FormData(form);
		data = paramsToObject(new URLSearchParams(data), this.typeValue);
		data = this.typeValue ? data[this.typeValue] : data;
		let setSchema = this.getSchema();

		setSchema.validate(data, { abortEarly: false }).catch((err) => {
			setError(err, form);
		});
	}

	formValidate() {
		const hasError = this.element.querySelectorAll('.' + HASERROR);
		const tooltip = this.element.querySelectorAll(TOOLTIP);

		if (hasError.length > 0) {
			hasError.forEach((element) => {
				element.classList.remove(HASERROR);
			});
		}

		if (tooltip.length > 0) {
			tooltip.forEach((tooltip) => {
				if (tooltip.classList.contains(HASERROR)) {
					tooltip.remove();
				}
			});
		}

		this.schemaValidate();
	}

	addressValidate() {
		const isSK = event.target.value === 'sk';
		const elements = this.context.element.querySelectorAll('[name*="contactAddress"]');
		const select = this.context.element.querySelector('[name="contactAddress.country"]');
		if (elements.length > 0) {
			elements.forEach((element) => {
				if (isSK) {
					element.attributes.required = true;
					select.value = 'cz';
				} else {
					element.attributes.required = false;
				}
			});
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
		setError(response.data, this.element);
		response.data.inner.forEach((error) => {
			const path = error.path.split('.');

			redirect = redirect === false ? redirect : path[0] !== this.typeValue;

			if (error.type === 'recaptcha-fail' && this.typeValue === 'login') {
				this.messageTarget.innerHTML = error.message;
				this.messageTarget.classList.remove(HIDE);
			}
		});
	}

	async send(e) {
		e.preventDefault();

		const form = this.element;
		const url = this.urlValue;
		let data = new FormData(form);
		data = paramsToObject(new URLSearchParams(data), this.typeValue);

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

		if (response.ok) {
			sessionStorage.removeItem('formValues');
			window.location.href = this.nextValue;
		} else if (!response.ok && response.status !== 400) {
			throw new Error('Network response was not ok.');
		} else {
			console.error('AJAX response error', response);
		}

		return await response.json();
	}

	setValue(element, value) {
		if (element !== null) {
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
