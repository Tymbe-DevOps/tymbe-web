import { Controller } from 'stimulus';

export default class FocusInput extends Controller {
	focus() {
		this.element.classList.add('has-focus');
	}

	blur() {
		var inputValue = event.currentTarget.value;

		event.currentTarget.value = inputValue; // value of invalid tel input would be empty -> breaks the label animation

		if (inputValue == '') {
			event.currentTarget.classList.remove('is-filled');
			this.element.classList.remove('has-focus');
		} else {
			event.currentTarget.classList.add('is-filled');
		}
	}
}
