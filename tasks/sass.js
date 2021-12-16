const { src, dest } = require('gulp');
const gulpSass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sassVars = require('gulp-sass-vars');
const globImporter = require('node-sass-glob-importer');

const isProduction = require('./helpers/isProduction.js');
const config = require('./helpers/getConfig.js');

module.exports = function sass(done) {
	const { breakpoints = {}, rules = {}, breakpointsVars = {} } = config.mediaQueries;

	const onError = (error) => {
		notify.onError({
			title: 'Sass error!',
			message: '<%= error.message %>',
			sound: 'Beep',
		})(error);

		done();
	};

	const settings = {
		includePaths: ['bower_components', 'node_modules'],
		outputStyle: isProduction() ? 'compressed' : 'expanded',
		precision: 9,
		importer: [globImporter()],
	};

	return src(['*.scss'], {
		cwd: config.src.styles,
		sourcemaps: !isProduction(),
	})
		.pipe(
			plumber({
				errorHandler: onError,
			}),
		)
		.pipe(
			sassVars(
				{
					...breakpointsVars,
					...rules,
					breakpoints,
					breakpointsVars,
					paths: config.assets,
				},
				{ verbose: false },
			),
		)
		.pipe(gulpSass(settings))
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
