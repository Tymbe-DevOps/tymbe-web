const { TwingEnvironment, TwingLoaderFilesystem, TwingFilter } = require('twing');
const fs = require('fs').promises;

const config = require('./getConfig');

const loader = new TwingLoaderFilesystem('./');
Object.keys(config.twigNamespaces).forEach(function addNamespaces(namespace) {
	loader.addPath(config.twigNamespaces[namespace], namespace);
});
let filterReadDir = new TwingFilter('readdir', async (val) => {
	const dir = await fs.readdir(process.cwd() + val);
	return dir;
});

const env = new TwingEnvironment(loader, {
	autoescape: 'html',
	strict_variables: true,
});

env.addFilter(filterReadDir);

module.exports = env;
