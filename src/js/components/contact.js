import { Controller } from 'stimulus';
import { resetError, setError, setInputError } from './validation/setError';
import { object, string } from 'yup';

// constants
const HIDE = 'u-hide';
const ISLOADING = 'is-loading';

export default class Contact extends Controller {
	// stimulus variables
	static targets = ['message', 'success', 'errorTooltip', 'loader'];
	static values = {
		url: String,
	};

	// Validation schema
	contactSchema = object({
		contactInputName: string().required('Vyplňte prosím jméno.'),
		contactInputEmail: string()
			.required('Vyplňte prosím e-mail.')
			.typeError('E-mail není ve správném formátu.')
			.email('E-mail není ve správném formátu.'),
		contactInputMessage: string()
			.min(10, 'Vyplňte minimálně 10 znaků.')
			.required('Vyplňte prosím zprávu.'),
	});

	// set formdata to object
	paramsToObject(entries) {
		const result = {};
		for (const [key, value] of entries) {
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
		this.contactSchema.validate(data, { stripUnknown: true, abortEarly: false }).catch((e) => {
			for (const error of e.inner) {
				if (error.path === name) {
					setInputError(e, target);
				}
			}
		});
	}

	// validation of reqiured fields
	formValidate() {
		this.loaderTarget.classList.add(ISLOADING);
		this.contactSchema.validate(this.getData(), { stripUnknown: true, abortEarly: false }).catch((err) => {
			setError(err, this.element);
			this.loaderTarget.classList.remove(ISLOADING);
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
			// check form validity
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
			this.successTarget.classList.remove(HIDE);
			this.element.reset();
			this.loaderTarget.classList.remove(ISLOADING);
			this.resetFilledInput();
		} else if (!response.ok && response.status !== 400) {
			this.loaderTarget.classList.remove(ISLOADING);
			throw new Error('Network response was not ok.');
		} else {
			console.error('AJAX response error', response);
			this.loaderTarget.classList.remove(ISLOADING);
		}

		return await response.json();
	}
}
