const importFresh = require('import-fresh');
const { src, dest } = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const twing = require('gulp-twing');
const htmlbeautify = require('gulp-html-beautify');

const config = require('./helpers/getConfig.js');

module.exports = function templatePages(done) {
	const onError = (error) => {
		notify.onError({
			title: 'Twig error!',
			message: '<%= error.message %>',
			sound: 'Beep',
		})(error);

		done();
	};

	return src(['*.twig'], {
		cwd: config.src.pages,
	})
		.pipe(
			plumber({
				errorHandler: onError,
			}),
		)
		.pipe(
			twing(importFresh('./helpers/twing.js'), config, {
				templatePaths: config.src.pages,
			}),
		)
		.pipe(
			rename({
				extname: '.html',
			}),
		)
		.pipe(
			htmlbeautify({
				indent_size: 1,
				indent_char: '	',
				eol: '\n',
				indent_level: 0,
				indent_with_tabs: false,
				preserve_newlines: false,
			}),
		)
		.pipe(dest(config.dest.pages));
};
