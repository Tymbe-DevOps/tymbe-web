// YUP validation
import * as Yup from 'yup';

export const personInfo = Yup.object({
	sureName: Yup.string().required('Vyplňte prosím jméno.'),
	familyName: Yup.string().required('Vyplňte prosím příjmení.'),
	birthPlace: Yup.string().required('Vyplňte prosím místo narození.'),
	idNumber: Yup.number()
		.required('Vyplňte prosím číslo občanského průkazu.')
		.positive('Vyplňte prosím číslo občanského průkazu.')
		.integer(),
	birthDate: Yup.string()
		.required('Vyplňte prosím datum narození.')
		.matches(/^[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9]{3}$/, 'Chybný formát data narození (DD.MM.RRRR).'),
	birthNumber: Yup.string()
		.required('Vyplňte prosím rodné číslo.')
		.matches(/^[0-9]{6}[0-9A-Za-z]{3,4}$/, 'Chybný formát rodného čísla.'),
	gender: Yup.string()
		.required('Zvolte prosím vaše pohlaví.')
		.oneOf(['1', '2'], 'Zvolte prosím vaše pohlaví.'),
});

const contactAddress = Yup.object({
	street: Yup.string().required('Vyplňte prosím ulici a č.p.'),
	city: Yup.string().required('Vyplňte prosím město.'),
	zip: Yup.string()
		.required('Vyplňte prosím PSČ')
		.matches(/^[0-9]{3}[ ]?[0-9]{2}$/, 'Chybný formát PSČ.'),
	country: Yup.string().required('Zvolte prosím stát.'),
});

export const contactsInfo = Yup.object({
	permanentAddress: Yup.object({
		street: Yup.string().required('Vyplňte prosím ulici a č.p.'),
		city: Yup.string().required('Vyplňte prosím město.'),
		zip: Yup.string()
			.required('Vyplňte prosím PSČ')
			.matches(/^[0-9]{3}[ ]?[0-9]{2}$/, 'Chybný formát PSČ.'),
		country: Yup.string().required('Zvolte prosím stát.'),
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
		.test('has-contact-address', 'Zadejte kontaktní adresu v ČR', function(value) {
			return !(this.parent.permanentAddress.country === 'sk' && value.country !== 'cz');
		}),

	phone: Yup.string()
		.required('Vyplňte prosím telefonní číslo.')
		.matches(
			/^\+(420|421)[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}$/,
			'Zadejte telefonní číslo v požadovaném formátu: +420123456789',
		),
});

export const loginInfo = Yup.object({
	email: Yup.string()
		.required('Vyplňte prosím e-mail.')
		.email('E-mail není ve správném formátu.'),
	password: Yup.string()
		.required('Vyplňte prosím heslo.')
		.matches(/^[a-zA-Z0-9]+$/, 'Heslo může obsahovat pouze malá/velká písmena a čísla.')
		.min(6, 'Heslo musí mít alespoň 6 znaků.'),
	passwordCheck: Yup.string()
		.required('Vyplňte prosím heslo pro ověření.')
		.oneOf([Yup.ref('password')], 'Hesla se musí shodovat.'),
	acceptDataProcessing: Yup.boolean()
		.oneOf([true], 'Potvrďte prosím souhlas s pravidly.')
		.default(false),
	reCaptcha: Yup.string()
		.nullable()
		.required('Potvrďte prosím, že nejste robot.'),
});
