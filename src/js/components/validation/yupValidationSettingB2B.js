// B2B Validation schema
import { object, string, number } from 'yup';

export const registrationSchema = object({
	companyName: string().required('Vyplňte prosím název firmy'),
	ic: number()
		.required('Tato položka je povinná')
		.typeError('Položka musí být číslo')
		.positive()
		.integer('Prosím zadejte číslo'),
	sureName: string().required('Vyplňte prosím jméno'),
	familyName: string().required('Vyplňte prosím příjmení'),
	email: string()
		.required('Vyplňte prosím e-mail')
		.typeError('E-mail není ve správném formátu')
		.email('E-mail není ve správném formátu'),
	phone: string()
		.required('Vyplňte prosím telefonní číslo')
		.typeError('Políčko není v požadovaném formátu')
		.matches(
			/^\+(420|421)[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{3}$/,
			'Zadejte telefonní číslo v požadovaném formátu +420123456789',
		),
	reCaptcha: string()
		.nullable()
		.required('Potvrďte prosím, že nejste robot.'),
});
