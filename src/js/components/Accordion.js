import { Controller } from 'stimulus';

export default class Accordion extends Controller {
	static targets = ['content', 'toggle'];

	toggle() {
		const btn = this.toggleTarget;

		let expanded = btn.getAttribute('aria-expanded') === 'true' || false;
		btn.setAttribute('aria-expanded', !expanded);

		this.element.classList.toggle('is-expanded');

		if (btn.dataset.labelShow !== undefined && btn.dataset.labelHide !== undefined) {
			if (expanded) {
				btn.innerHTML = btn.dataset.labelShow;
			} else {
				btn.innerHTML = btn.dataset.labelHide;
			}
		}
		this.contentTarget.hidden = expanded;
	}
}
