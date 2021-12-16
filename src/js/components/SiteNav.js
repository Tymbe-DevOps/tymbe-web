import { Controller } from 'stimulus';
import { useClickOutside, useHotkeys } from 'stimulus-use';

export default class SiteNav extends Controller {
	static targets = ['menu'];

	connect() {
		useClickOutside(this);

		useHotkeys(this, {
			esc: [this.clickOutside],
		});
	}

	toggleNav() {
		document.body.classList.toggle('menu-is-open');
	}

	hideNav() {
		document.body.classList.remove('menu-is-open');
	}

	clickOutside() {
		if (document.body.classList.contains('menu-is-open')) {
			document.body.classList.remove('menu-is-open');
		}
	}
}
