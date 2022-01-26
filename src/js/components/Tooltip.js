import { Controller } from 'stimulus';
import { useClickOutside, useHotkeys } from 'stimulus-use';

const IS_VISIBLE = 'is-visible';

export default class Tooltip extends Controller {
	connect() {
		useClickOutside(this);
		useHotkeys(this, {
			esc: [this.clickOutside],
		});
	}

	// Show tooltip
	showTooltip() {
		this.element.classList.add(IS_VISIBLE);
	}

	clickOutside() {
		if (this.element.classList.contains(IS_VISIBLE)) {
			this.element.classList.remove(IS_VISIBLE);
		}
	}
}
