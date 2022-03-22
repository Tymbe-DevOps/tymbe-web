const parse = require('parse-sass-value');

const makeSassVars = (variables) => {
	return Object.keys(variables).map((name) => {
		let value = 'null';

		try {
			value = parse(variables[name]);
		} catch (error) {
			console.log(`skipping var ${name}.\n` + `: ${error.message}`);
		}

		return `$${name}: ${value};`;
	});
};

const compileSassVars = (variables) => {
	return makeSassVars(variables).join('\n');
};

module.exports = {
	compileSassVars,
};
