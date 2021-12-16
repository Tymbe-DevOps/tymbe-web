const { src, dest } = require('gulp');

const config = require('./helpers/getConfig.js');

module.exports = function copyJs() {
	return src(['**/*.js'], {
		cwd: `${config.src.scripts}static/`,
	}).pipe(dest(config.dest.scripts));
};
