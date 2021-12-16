const { src, dest } = require('gulp');

const config = require('./helpers/getConfig.js');

module.exports = function copyRoot() {
	return src(['**/*', '!css/**/*', '!js/**/*', '!img/**/*', '!tpl/**/*', '!css', '!js', '!img', '!tpl'], {
		cwd: config.basePath.src,
		dot: true,
	}).pipe(dest(config.basePath.dest));
};
