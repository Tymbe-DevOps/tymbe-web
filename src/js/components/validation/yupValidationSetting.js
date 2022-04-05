// YUP validation
import * as Yup from 'yup';

export const personInfo = Yup.object({
	sureName: Yup.string().required('Будь ласка, введіть ім я.'),
	familyName: Yup.string().required('Заповніть, будь ласка, прізвище.'),
	birthPlace: Yup.string().required('Заповніть, будь ласка, місце народження.'),
	idNumber: Yup.string()
		.required('Будь ласка, заповніть номер візи.')
		.matches(/^([a-z]{2})?\d{4,}$/i, 'Будь ласка, заповніть номер візи.'),
	birthDate: Yup.string()
		.required('Будь ласка, заповніть дату свого народження.')
		.matches(/^[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9]{3}$/, 'Неправильний формат дати (DD.MM.YYYY).')
		.test('min-age-15', 'Вам має бути більше 15 років', (value) => {
			const [day, month, year] = value.split('.');
			const age = new Date(Date.now() - new Date(year, month - 1, day)).getUTCFullYear() - 1970;
			return age >= 15;
		}),
	birthNumber: Yup.string()
		.required('Будь ласка, заповніть свій номер народження.')
		.matches(/^[0-9]{6}[0-9A-Za-z]{3,4}$/, 'Неправильний формат номера народження.'),
	gender: Yup.string()
		.required('Будь ласка, виберіть свою стать.')
		.oneOf(['1', '2'], 'ZБудь ласка, виберіть свою стать.'),
});

const contactAddress = Yup.object({
	street: Yup.string().required('Будь ласка, заповніть вулицю та описовий номер.'),
	city: Yup.string().required('Будь ласка, заповніть місто.'),
	zip: Yup.string()
		.required('Будь ласка, заповніть поштовий індекс')
		.matches(/^[0-9]{3}[ ]?[0-9]{2}$/, 'Неправильний формат поштового індексу.'),
	country: Yup.string().required('Виберіть країну.'),
});

export const contactsInfo = Yup.object({
	permanentAddress: Yup.object({
		street: Yup.string().required('Будь ласка, заповніть вулицю та описовий номер.'),
		city: Yup.string().required('Будь ласка, заповніть місто.'),
		zip: Yup.string()
			.required('Будь ласка, заповніть поштовий індекс')
			.matches(/^[0-9]{3}[ ]?[0-9]{2}$/, 'Неправильний формат поштового індексу.'),
		country: Yup.string().required('Виберіть країну.'),
	}),

	contactAddress: Yup.object()
		.when('permanentAddress', function({ country }, schema) {
			return country === 'sk' ? contactAddress : schema;
		})
		.shape({
			street: Yup.string(),
			city: Yup.string(),
			zip: Yup.string(),
			country: Yup.string(),
		})
		.test('has-contact-address', 'Введіть контактну адресу в Чеській Республіці', function(value) {
			return !(this.parent.permanentAddress.country === 'sk' && value.country !== 'cz');
		}),

	phone: Yup.string()
		.required('Будь ласка, заповніть номер телефону.')
		.matches(
			/^\+(420|421)[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}$/,
			'Введіть номер телефону в потрібному форматі: +420123456789',
		),
});

export const loginInfo = Yup.object({
	email: Yup.string()
		.required('Будь ласка, заповніть e-mail.')
		.email('Електронна пошта не в правильному форматі.'),
	password: Yup.string()
		.required('Будь ласка, введіть пароль.')
		.matches(/^[a-zA-Z0-9]+$/, 'Пароль може містити лише малі / великі літери та цифри.')
		.min(6, 'Пароль має містити не менше 6 символів.'),
	passwordCheck: Yup.string()
		.required('Введіть пароль для підтвердження.')
		.oneOf([Yup.ref('password')], 'Паролі повинні збігатися.'),
	acceptDataProcessing: Yup.boolean()
		.oneOf([true], 'Будь ласка, підтвердьте свою згоду з правилами.')
		.default(false),
	reCaptcha: Yup.string()
		.nullable()
		.required('Будь ласка, підтвердьте, що ви не робот.'),
});
