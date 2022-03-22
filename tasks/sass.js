const { src, dest } = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');

const isProduction = require('./helpers/isProduction.js');
const config = require('./helpers/getConfig.js');
const logger = require('./helpers/logger.js');
const { compileSassVars } = require('./helpers/compileSassVars');
const path = require('path');

const paths = Object.fromEntries(
	Object.entries(config.assets)
		.map(([key, relPath]) => [key, path.relative(config.basePath.dest, relPath)])
		.map(([key, relPath]) => [key, `${relPath.split('\\').join('/')}/`]),
);

module.exports = function sass(done) {
	const { breakpoints = {}, rules = {}, breakpointsVars = {} } = config.mediaQueries;
	const sassConfigVars = {
		contents: compileSassVars({
			...breakpointsVars,
			...rules,
			breakpoints,
			breakpointsVars,
			paths,
		}),
	};

	const settings = {
		includePaths: ['bower_components', 'node_modules'],
		outputStyle: isProduction() ? 'compressed' : 'expanded',
		precision: 9,
		importer: [
			(url) => {
				if (url === 'config') {
					return sassConfigVars;
				}
				return null;
			},
		],
	};

	return src(['*.scss'], {
		cwd: config.src.styles,
		sourcemaps: !isProduction(),
	})
		.pipe(
			plumber({
				errorHandler: logger.onError({
					title: 'Sass error!',
					callback: done,
				}),
			}),
		)

		.pipe(gulpSass.sync(settings))
		.pipe(
			postcss([
				autoprefixer({
					grid: 'autoplace',
				}),
			]),
		)
		.pipe(
			dest(config.dest.styles, {
				sourcemaps: './',
			}),
		);
};
