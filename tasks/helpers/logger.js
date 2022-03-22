const log = require('fancy-log');
const notifier = require('node-notifier');
const colors = require('ansi-colors');

exports.log = (message) => {
	log(message);
};

exports.colors = colors;

exports.onError = (options = {}) => (error = {}) => {
	const { withNotification = true, callback = () => {}, ...rest } = options;
	const title = rest.title || error.plugin || '';
	const message = rest.message || error.message || '';

	if (withNotification) {
		notifier.notify({
			title: title,
			message: message,
			sound: 'Beep',
			timeout: 2,
			...rest,
		});
	}

	var fullMessage = colors.red('Error in plugins **' + title + '**:\n') + message + '\n\n';
	log.error(fullMessage);
	callback();
};
