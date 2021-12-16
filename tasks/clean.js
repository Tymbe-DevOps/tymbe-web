const del = require('del');

const config = require('./helpers/getConfig.js');

module.exports = function clean() {
	return del(config.basePath.dest);
};
