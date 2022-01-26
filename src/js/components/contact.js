import { Controller } from 'stimulus';
import { object, string } from 'yup';

// constants
const HASERROR = 'has-error';
const INP = '.inp';
const INPFIX = '.inp-fix';
const TOOLTIP = '.tooltip';
const HIDE = 'u-hide';

export default class Contact extends Controller {
	// stimulus variables
	static targets = ['message', 'success', 'tooltip', 'errorTooltip'];
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
		contactInputMessage: string().required('Vyplňte prosím zprávu.'),
	});

	// tooltip template
	tooltipTemplate(message) {
		return `
		<button type="button" class="tooltip" data-controller="Tooltip" data-action="click->Tooltip#showTooltip" data-registrationb2b-target="errorTooltip">
			<span class="icon-svg icon-svg--info" aria-hidden="true">
				<svg class="icon-svg__svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<use xlink:href="../img/bg/icons-svg.svg#icon-info" width="100%" height="100%" focusable="false"></use>
				</svg>
			</span>
			<span class="u-vhide"> Info </span>
			<span class="tooltip__content">
				<span class="tooltip__text">${message}</span>
			</span>
		</button>`;
	}

	// set formdata to object
	paramsToObject(entries) {
		const result = {};
		for (const [key, value] of entries) {
			result[key] = value;
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
		this.errorTooltipTargets.forEach((tooltip) => {
			tooltip.remove();
		});

		const form = this.element;
		let data = new FormData(form);
		data = this.paramsToObject(new URLSearchParams(data));

		this.contactSchema.validate(data, { abortEarly: false }).catch((err) => {
			for (const error of err.inner) {
				const element = this.element.querySelector(`#${error.path}`);
				const wrapper = element.closest(INP);
				const inpfix = wrapper.querySelector(INPFIX);

				wrapper.classList.add(HASERROR);
				if (!inpfix) {
					this.messageTarget.innerHTML = error.message;
					this.messageTarget.classList.remove(HIDE);
				} else {
					inpfix.insertAdjacentHTML('beforeend', this.tooltipTemplate(error.message));
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
				response.data.inner.forEach((error) => {
					const element = this.element.querySelector(`[name=${error.path}]`);

					if (element !== null) {
						const wrapper = element.closest(INP);

						if (wrapper !== null) {
							wrapper.classList.add(HASERROR);
							const inpfix = wrapper.querySelector(INPFIX);
							const tooltip = wrapper.querySelector(TOOLTIP);

							if (tooltip !== null) {
								const text = tooltip.querySelector('.tooltip__text');
								text.innerHTML = error.message;
								tooltip.classList.remove(HIDE);
							} else if (inpfix !== null) {
								inpfix.insertAdjacentHTML('beforeend', this.tooltipTemplate(error.message));
							}
						}
					}
				});
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
		} else if (!response.ok && response.status !== 400) {
			throw new Error('Network response was not ok.');
		} else {
			console.error('AJAX response error', response);
		}

		return await response.json();
	}
}
