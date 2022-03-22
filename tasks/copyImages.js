const { src, dest } = require('gulp');

const config = require('./helpers/getConfig.js');

module.exports = function copyImages() {
	return src(['**/*.{png,jpg,gif,svg,ico}', '!icons/*'], {
		cwd: config.src.images,
	}).pipe(dest(config.dest.images));
};
