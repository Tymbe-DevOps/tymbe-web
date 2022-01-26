// set formdata to object

export const paramsToObject = (entries, type) => {
	let result = Object.create({});
	let formEnteries = Object.create({});
	let permanentAddress = Object.create({});
	let contactAddress = Object.create({});
	let reCaptcha = Object.create({});

	for (const [key, value] of entries) {
		const newKey = key.split('.');
		if (newKey.length > 1 && newKey[0] === 'permanentAddress' && type === 'contact') {
			permanentAddress[newKey[1]] = value;
		} else if (newKey.length > 1 && newKey[0] === 'contactAddress' && type === 'contact') {
			contactAddress[newKey[1]] = value;
		} else {
			if (key === 'g-recaptcha-response' && type === 'login') {
				reCaptcha = Object.defineProperty(result, 'reCaptcha', {
					value: value,
					enumerable: true,
				});
			}

			formEnteries[key] = value;
		}
	}
	if (!type) {
		result = formEnteries;
	} else {
		if (type === 'contact') {
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
		if (type === 'login') {
			formEnteries = {
				...formEnteries,
				...reCaptcha,
			};
		}

		Object.defineProperty(result, type, {
			value: formEnteries,
			enumerable: true,
			configurable: true,
		});
	}

	return result;
};
