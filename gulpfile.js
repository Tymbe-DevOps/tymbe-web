const { series, parallel } = require('gulp');

const clean = require('./tasks/clean');
const compress = require('./tasks/compress');
const imagemin = require('./tasks/imagemin');

const copyImages = require('./tasks/copyImages');
const copyJs = require('./tasks/copyJs');
const copyRoot = require('./tasks/copyRoot');

const iconSvg = require('./tasks/iconSvg');

const twig = require('./tasks/twig');
const templatePages = require('./tasks/templatePages');
const sass = require('./tasks/sass');
const webpack = require('./tasks/webpack');
const isProduction = require('./tasks/helpers/isProduction');

const validate = require('./tasks/validate');
const watch = require('./tasks/watch');

const build = function build(done) {
	const twigTpl = !isProduction() ? [templatePages, twig] : twig;

	return series(clean, iconSvg, parallel(sass, webpack, twigTpl, copyImages, copyJs, copyRoot))(done);
};

const dev = function dev(done) {
	return series(build, watch)(done);
};

const min = function min(done) {
	process.env.NODE_ENV = 'production';
	return series(build, imagemin)(done);
};

const zip = function zip(done) {
	return series(min, compress)(done);
};

const minwatch = function minwatch(done) {
	return series(min, watch)(done);
};

module.exports = {
	clean,
	compress,
	copyImages,
	copyJs,
	copyRoot,
	iconSvg,
	imagemin,
	twig,
	templatePages,
	sass,
	validate,
	watch,
	webpack,

	default: dev,
	build,
	min,
	export: zip,
	minwatch,
};
