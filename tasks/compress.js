const { src, dest } = require('gulp');
const zip = require('gulp-zip');

const pckg = require('../package.json');
const config = require('./helpers/getConfig.js');

const currentDate = new Date();
const year = `${currentDate.getFullYear()}`;
const month = `${currentDate.getMonth() + 1}`.padStart(2, '0');
const day = `${currentDate.getDate()}`.padStart(2, '0');
const hours = `${currentDate.getHours()}`.padStart(2, '0');
const minutes = `${currentDate.getMinutes()}`.padStart(2, '0');
const seconds = `${currentDate.getSeconds()}`.padStart(2, '0');
const dateDir = `${year}-${month}-${day}__${hours}-${minutes}-${seconds}`;

const folder = `${pckg.name}-${dateDir}`;

module.exports = function compress() {
	return src(['**/*'], {
		cwd: config.basePath.dest,
	})
		.pipe(zip(`${folder}.zip`))
		.pipe(dest('_zip/'));
};
