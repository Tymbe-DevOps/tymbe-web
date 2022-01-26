import { Application } from 'stimulus';
import smoothscroll from 'smoothscroll-polyfill';

import './tools/svg4everybody';

// Components
import FocusInput from './components/FocusInput';
import SiteNav from './components/SiteNav';
import LinkSlide from './components/LinkSlide';
import Embla from './components/Embla';
import Tabs from './components/Tabs';
import Accordion from './components/Accordion';
import Statistics from './components/Statistics';
import Rings from './components/Rings';
import Registration from './components/Registration';
import RegistrationB2B from './components/RegistrationB2B';
import Contact from './components/Contact';
import Tooltip from './components/Tooltip';

const components = {
	FocusInput,
	SiteNav,
	Statistics,
	LinkSlide,
	Embla,
	Tabs,
	Accordion,
	Rings,
	Registration,
	RegistrationB2B,
	Contact,
	Tooltip,
};

window.App = {
	run(options) {
		this.options = options;

		const application = Application.start();

		smoothscroll.polyfill();

		Object.keys(components).forEach((component) => {
			application.register(component, components[component]);
		});
	},
};
