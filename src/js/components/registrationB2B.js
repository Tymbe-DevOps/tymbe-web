import { Controller } from 'stimulus';
import { resetError, setError, setInputError } from './validation/setError';
import { registrationSchema } from './validation/yupValidationSettingB2B';

// constants
const HIDE = 'u-hide';

export default class RegistrationB2C extends Controller {
	// stimulus variables
	static targets = ['message', 'tooltip'];
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

	formValidate() {
		registrationSchema.validate(this.getData(), { stripUnknown: true, abortEarly: false }).catch((err) => {
			setError(err, this.element);
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
			this.messageTarget.classList.add('message--ok');
			this.messageTarget.classList.remove(HIDE);
			this.element.reset();
		} else if (!response.ok && response.status !== 400) {
			throw new Error('Network response was not ok.');
		} else {
			console.error('AJAX response error', response);
		}

		return await response.json();
	}
}
