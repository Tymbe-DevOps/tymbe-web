import { Controller } from 'stimulus';
import { object, string, boolean, ref } from 'yup';

const HASERROR = 'has-error';
const REG_WRAPPER = '.f-registration__inp, .f-registration__radios, .f-registration__checkbox';
const INP_FIX = '.inp-fix';
const TOOLTIP = '.tooltip';
const HIDE = 'u-hide';
let redirect = true;

export default class Registration extends Controller {
	static targets = ['message', 'success', 'tooltip', 'errorTooltip', 'acceptDataProcessing'];
	static values = {
		url: String,
		type: String,
		next: String,
	};

	personInfo = object({
		sureName: string().required('Vyplňte prosím jméno.'),
		familyName: string().required('Vyplňte prosím příjmení.'),
		birthPlace: string().required('Vyplňte prosím místo narození.'),
		idNumber: string().required('Vyplňte prosím číslo občanského průkazu.'),
		birthDate: string()
			.required('Vyplňte prosím datum narození.')
			.matches(/^[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9]{3}$/, 'Chybný formát data narození (DD.MM.RRRR).'),
		birthNumber: string()
			.required('Vyplňte prosím rodné číslo.')
			.matches(/^[0-9]{6}[0-9A-Za-z]{3,4}$/, 'Chybný formát rodného čísla.'),
		gender: string()
			.required('Zvolte prosím vaše pohlaví.')
			.oneOf(['1', '2'], 'Zvolte prosím vaše pohlaví.'),
	});

	contactsInfo = object({
		permanentAddress: object({
			street: string().required('Vyplňte prosím ulici a č.p.'),
			city: string().required('Vyplňte prosím město.'),
			zip: string()
				.required('Vyplňte prosím PSČ')
				.matches(/^[0-9]{3}[ ]?[0-9]{2}$/, 'Chybný formát PSČ.'),
			country: string().required('Zvolte prosím stát.'),
		}),
		contactAddress: object()
			.shape({
				street: string(),
				city: string(),
				zip: string(),
				country: string(),
			})
			.when('permanentAddress', ({ country }, contactAddress) =>
				country === 'sk' ? contactAddress.required('Políčko je povinné.') : contactAddress,
			)
			.test('has-contact-address', 'Zadejte kontaktní adresu v ČR', function(value) {
				return !(this.parent.permanentAddress.country === 'sk' && value.country !== 'cz');
			}),
		phone: string()
			.required('Vyplňte prosím telefonní číslo.')
			.matches(/^\+(420|421)[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}$/, 'Zadejte telefonní číslo v požadovaném formátu.'),
	});

	loginInfo = object({
		email: string()
			.required('Vyplňte prosím e-mail.')
			.email('E-mail není ve správném formátu.'),
		password: string()
			.required('Vyplňte prosím heslo.')
			.matches(/^[a-zA-Z0-9]+$/, 'Heslo může obsahovat pouze malá/velká písmena a čísla.')
			.min(6, 'Heslo musí mít alespoň 6 znaků.'),
		passwordCheck: string()
			.required('Vyplňte prosím heslo pro ověření.')
			.oneOf([ref('password')], 'Hesla se musí shodovat.'),
		acceptDataProcessing: boolean()
			.oneOf([true], 'Potvrďte prosím souhlas s pravidly.')
			.default(false),
		reCaptcha: string()
			.nullable()
			.required('Potvrďte prosím, že nejste robot.'),
	});

	// tooltip template
	tooltipTemplate(element, message) {
		const tooltip = element.querySelector(TOOLTIP);
		if (tooltip) {
			tooltip.classList.add(HIDE);
		}

		const tooltipError = element.querySelector(`${TOOLTIP}.${HASERROR}`);
		if (tooltipError) {
			tooltipError.remove();
		}

		const tooltipText = !tooltipError ? '' : tooltipError.querySelector('.tooltip__text');
		const errorMessage = !tooltipText ? message : `${tooltipText.textContent}<br>${message}`;

		return `
			<button type="button" class="tooltip has-error" data-registration-target="errorTooltip">
				<span class="icon-svg icon-svg--info" aria-hidden="true">
					<svg class="icon-svg__svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<use xlink:href="../img/bg/icons-svg.svg#icon-info" width="100%" height="100%" focusable="false"></use>
					</svg>
				</span>
				<span class="u-vhide"> Info </span>
				<span class="tooltip__content">
					<span class="tooltip__text">${errorMessage}</span>
				</span>
			</button>
		`;
	}

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
				// if (key === 'birthDate') {
				// 	const date = new Date(value);
				// 	const options = {
				// 		day: '2-digit',
				// 		month: '2-digit',
				// 		year: 'numeric',
				// 	};
				// have to format by using de-EN because cs-CZ have spacing
				// formEnteries[key] = new Intl.DateTimeFormat('de-EN', options).format(date);
				// } else {
				formEnteries[key] = value;
				// }
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

	setError(err) {
		this.messageTarget.innerHTML = '';
		for (const error of err.inner) {
			const hasContact = error.type === 'has-contact-address';
			const element = this.element.querySelector(`[name='${error.path}']`);

			if (hasContact) {
				this.messageTarget.innerHTML = error.message;
				this.messageTarget.classList.remove(HIDE);
			}
			if (!element) {
				return;
			} else {
				const wrapper = element && element.closest(REG_WRAPPER);
				const inpfix = wrapper && wrapper.querySelector(INP_FIX);

				if (wrapper) {
					wrapper.classList.add(HASERROR);
				}
				if (!inpfix) {
					const innerMessage = this.messageTarget.innerHTML;
					const setMessage = innerMessage ? `${error.message}<br>${innerMessage}` : error.message;

					this.messageTarget.innerHTML = setMessage;
					this.messageTarget.classList.remove(HIDE);
				} else {
					inpfix.insertAdjacentHTML('beforeend', this.tooltipTemplate(inpfix, error.message));
				}
			}
		}
	}

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
		data = this.typeValue ? data[this.typeValue] : data;

		if (this.typeValue === 'user') {
			this.personInfo.validate(data, { abortEarly: false }).catch((err) => {
				this.setError(err);
			});
		} else if (this.typeValue === 'contact') {
			this.contactsInfo.validate(data, { abortEarly: false }).catch((err) => {
				this.setError(err);
			});
		} else if (this.typeValue === 'login') {
			this.loginInfo.validate(data, { abortEarly: false }).catch((err) => {
				this.setError(err);
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
		response.data.inner.forEach((error) => {
			const path = error.path.split('.');
			const element = this.element.querySelector(`[name="${path[1]}"]`);

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
						inpfix.insertAdjacentHTML('beforeend', this.tooltipTemplate(inpfix, error.message));
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
					// if (key === 'birthDate') {
					// 	const date = new Date(value);
					// 	let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
					// 	let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
					// 	let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
					// 	element.value = `${ye}-${mo}-${da}`;
					// } else {
					element.value = value;
					// }
				}
			}
		}
	}
}
