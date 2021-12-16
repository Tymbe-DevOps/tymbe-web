const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');

const config = require('./getConfig');

const loader = new TwingLoaderFilesystem('./');
Object.keys(config.twigNamespaces).forEach(function addNamespaces(namespace) {
	loader.addPath(config.twigNamespaces[namespace], namespace);
});

const env = new TwingEnvironment(loader, {
	autoescape: 'html',
	strict_variables: true,
});

module.exports = env;
