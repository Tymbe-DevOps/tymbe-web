import { Controller } from 'stimulus';

export default class Rings extends Controller {
	static targets = ['item', 'product', 'time', 'position', 'place', 'price', 'priceCurrent'];
	static values = {
		url: String,
	};

	connect() {
		fetch(this.urlValue)
			.then((response) => response.json())
			.then((data) => {
				// const keyCount = Object.keys(data).length;
				let index = 0;

				// eslint-disable-next-line no-unused-vars
				Object.entries(data).forEach(([key, value]) => {
					// if (keyCount === this.itemTargets.length) {
					this.timeTargets[index].innerHTML = value['time_from'];
					this.positionTargets[index].innerHTML = value['position'];
					this.placeTargets[index].innerHTML = value['place'];
					this.priceTargets[index].innerHTML = value['price_start'];
					this.priceCurrentTargets[index].innerHTML = value['price_current'];
					index = index + 1;
					// }
				});
			})
			.finally(() => {
				this.productTargets.forEach((element) => {
					element.classList.add('loaded');
				});
			})
			.catch((error) => {
				console.error('Request Failed', error);
			});
	}
}
