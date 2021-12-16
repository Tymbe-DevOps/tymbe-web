const merge = require('deepmerge');

let config = require('../../config');
const { log, colors } = require('./logger');

try {
	// eslint-disable-next-line global-require
	const localConfig = require('../../config.local');
	config = merge(config, localConfig);
	log(colors.magenta('Using local configuration.'));
} catch (exception) {
	log(
		colors.magenta(
			'Using global configuration only. For local configuration create config.local.js (duplicate and rename config.local.example.js).',
		),
	);
}

const { mediaQueries } = config;
const { breakpoints = {} } = mediaQueries;
const breakpointsVars = Object.keys(breakpoints).reduce((acc, key) => {
	const [, number, , unit] = breakpoints[key].match(/(\d+)(\s*)(\S+)/);

	return {
		...acc,
		[`${key}Up`]: `min-width: ${number}${unit}`,
		[`${key}Down`]: `max-width: ${number - 0.02}${unit}`,
	};
}, {});

module.exports = {
	...config,
	mediaQueries: {
		...mediaQueries,
		breakpointsVars,
	},
};
