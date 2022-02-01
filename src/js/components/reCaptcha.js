import { Controller } from 'stimulus';
import { resetError, setError } from './validation/setError';

export default class Recaptcha extends Controller {
	connect() {
		this.renderCaptcha();
	}

	renderCaptcha() {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
		script.onload = this.onloadCallback();
		script.async = true;
		script.defer = true;

		document.head.appendChild(script);
	}

	onloadCallback() {
		const captcha = this.element;
		const siteKey = captcha.dataset.sitekey;

		const verifyCallback = (response) => {
			resetError(captcha);
			if (!response) {
				setError(captcha);
			}
		};

		var interval = setInterval(function() {
			if (window.grecaptcha && window.grecaptcha.render) {
				window.grecaptcha.render(captcha, {
					sitekey: siteKey,
					callback: verifyCallback,
				});
				clearInterval(interval);
			}
		}, 200);
	}
}
