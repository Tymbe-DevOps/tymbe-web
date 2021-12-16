const { series, parallel } = require('gulp');

const clean = require('./tasks/clean');
const compress = require('./tasks/compress');
const imagemin = require('./tasks/imagemin');

const copyImages = require('./tasks/copyImages');
const copyJs = require('./tasks/copyJs');
const copyRoot = require('./tasks/copyRoot');

const iconSvg = require('./tasks/iconSvg');
const iconFont = require('./tasks/iconFont');
const spriteRetina = require('./tasks/spriteRetina');
const sprite = require('./tasks/sprite');

const twig = require('./tasks/twig');
const sass = require('./tasks/sass');
const webpack = require('./tasks/webpack');

const validate = require('./tasks/validate');
const watch = require('./tasks/watch');

const build = function build(done) {
	return series(
		clean,
		parallel(iconSvg, iconFont, spriteRetina, sprite),
		parallel(sass, webpack, twig, copyImages, copyJs, copyRoot),
	)(done);
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
	iconFont,
	imagemin,
	twig,
	sass,
	spriteRetina,
	sprite,
	validate,
	watch,
	webpack,

	default: dev,
	build,
	min,
	export: zip,
	minwatch,
};
