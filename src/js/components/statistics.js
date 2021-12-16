import { Controller } from 'stimulus';

export default class Statistics extends Controller {
	static targets = ['number'];
	static values = {
		url: String,
	};

	numberWithSpaces(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
	}

	connect() {
		fetch(this.urlValue)
			.then((response) => response.json())
			.then((data) => {
				this.numberTargets.forEach((element) => {
					const getData = element.dataset;
					const value = getData.statisticsValue;
					if (Object.prototype.hasOwnProperty.call(data, value)) {
						const suffix = getData.statisticsSuffix;
						const innerHtml = suffix.length > 0 ? data[value] + '&nbsp;' + suffix : this.numberWithSpaces(data[value]);
						element.innerHTML = innerHtml;
					}
				});
			})
			.finally(() => {
				this.numberTargets.forEach((element) => {
					element.classList.add('loaded');
				});
			})
			.catch((error) => {
				console.error('Request Failed', error);
			});
	}
}
