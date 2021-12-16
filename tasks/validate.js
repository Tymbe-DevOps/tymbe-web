const { src } = require('gulp');
const w3cjs = require('gulp-w3cjs');
const through2 = require('through2');

const config = require('./helpers/getConfig');
const { log, colors } = require('./helpers/logger');

module.exports = function validate() {
	return src(['*.html'], {
		cwd: config.dest.templates,
	})
		.pipe(w3cjs())
		.pipe(
			through2.obj((file, enc, callback) => {
				if (file.w3cjs.success) {
					log(colors.magenta(`No errors found in ${file.path}`));
				}

				callback(null, file);
			}),
		);
};
