import { Controller } from 'stimulus';
import { useDispatch } from 'stimulus-use';

export default class Tabs extends Controller {
	static targets = ['link', 'content'];

	connect() {
		useDispatch(this);
	}

	changeTab(event) {
		event.preventDefault();
		const selectedLink = event.currentTarget;
		const contentId = selectedLink.getAttribute('href');
		const activeContent = this.element.querySelector(contentId);

		if (!activeContent) return;

		this.linkTargets.forEach((link) => {
			link.classList.remove('is-selected');
		});
		selectedLink.classList.add('is-selected');

		this.contentTargets.forEach((content) => {
			content.classList.remove('is-active');
		});
		activeContent.classList.add('is-active');

		this.dispatch('tabChange', { key: selectedLink.dataset.key });
	}
}
