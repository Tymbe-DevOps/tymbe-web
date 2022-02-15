import { Controller } from 'stimulus';

const HIDE = 'u-hide';
export default class Rings extends Controller {
	static targets = ['item', 'product', 'time', 'position', 'place', 'price', 'priceCurrent'];
	static values = {
		url: String,
	};

	connect() {
		fetch(this.urlValue)
			.then((response) => response.json())
			.then((data) => {
				let index = 0;

				// eslint-disable-next-line no-unused-vars
				Object.entries(data).forEach(([key, value]) => {
					this.timeTargets[index].innerHTML = value['time_from'].substring(0, value['time_from'].length - 3);
					this.positionTargets[index].innerHTML = value['position'];
					this.placeTargets[index].innerHTML = value['place'];
					this.priceTargets[index].innerHTML = value['price_start'];
					this.priceCurrentTargets[index].innerHTML = value['price_current'];
					index = index + 1;
				});
			})
			.finally(() => {
				this.productTargets.forEach((element) => {
					element.classList.add('loaded');
				});
				this.element.classList.remove(HIDE);
			})
			.catch((error) => {
				this.element.classList.add(HIDE);
				console.error('Request Failed', error);
			});
	}
}
