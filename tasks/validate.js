const { src, series } = require('gulp');
const config = require('./helpers/getConfig');

module.exports = function validate(done) {
	import('gulp-w3c-html-validator').then(({ htmlValidator }) => {
		function runValidate() {
			return src(['*.html'], {
				cwd: config.dest.templates,
			})
				.pipe(htmlValidator.analyzer())
				.pipe(htmlValidator.reporter());
		}

		series(runValidate)(done);
	});
};
