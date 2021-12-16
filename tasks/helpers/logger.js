const log = require('fancy-log');
const colors = require('ansi-colors');

exports.log = (message) => {
	log(message);
};

exports.colors = colors;
