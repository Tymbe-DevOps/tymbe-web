const { src, dest } = require('gulp');
const config = require('./helpers/getConfig.js');

module.exports = function imagemin() {
	return import('gulp-imagemin').then((gulpImagemin) => {
		src(['**/*.{png,jpg,gif,svg}', '!bg/icons-svg.svg'], {
			cwd: config.dest.images,
		})
			.pipe(
				gulpImagemin.default([
					gulpImagemin.mozjpeg({ progressive: true }),
					gulpImagemin.optipng(),
					gulpImagemin.gifsicle(),
					gulpImagemin.svgo(),
				]),
			)
			.pipe(dest(config.dest.images));
	});
};
