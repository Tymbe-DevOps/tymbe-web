const apiBaseUrl = 'https://api.tymbe.com';

const basePath = {
	src: 'src/',
	dest: 'dist/',
	assets: './',
};

const src = {
	fonts: `${basePath.src}fonts/`,
	icons: `${basePath.src}img/icons/`,
	images: `${basePath.src}img/`,
	scripts: `${basePath.src}js/`,
	styles: `${basePath.src}css/`,
	templates: `${basePath.src}tpl/`,
	components: `${basePath.src}tpl/components/`,
	layout: `${basePath.src}tpl/layout/`,
	pages: `${basePath.src}tpl/pages/`,
};

const twigNamespaces = {
	components: src.components,
	layout: src.layout,
	images: src.images,
	templates: src.templates,
	pages: src.pages,
};

const dest = {
	fonts: `${basePath.dest}fonts/`,
	images: `${basePath.dest}img/`,
	scripts: `${basePath.dest}js/`,
	styles: `${basePath.dest}css/`,
	templates: `${basePath.dest}/`,
	pages: `${basePath.dest}pages/`,
};

const assets = {
	fonts: `${basePath.assets}fonts/`,
	images: `${basePath.assets}img/`,
	scripts: `${basePath.assets}js/`,
	dynamicScripts: `${basePath.assets}js/`,
	styles: `${basePath.assets}css/`,
};

const webpack = {
	stats: {
		colors: true,
		hash: false,
		timings: true,
		assets: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: true,
		version: false,
	},
};

const browserSync = {
	open: false,
	notify: false,
	reloadThrottle: 1000,
	watch: true,
	server: {
		baseDir: basePath.dest,
	},
};

module.exports = {
	apiBaseUrl,
	basePath,
	src,
	dest,
	assets,
	twigNamespaces,
	webpack,
	browserSync,
	mediaQueries: {
		breakpoints: {
			xs: '375px',
			sm: '480px',
			md: '750px',
			lg: '1000px',
			xl: '1200px',
		},
		rules: {
			webkit: '(-webkit-min-device-pixel-ratio: 0)',
			retina:
				'(-webkit-min-device-pixel-ratio: 2), (min--moz-device-pixel-ratio: 2), (-o-min-device-pixel-ratio: 2/1), (min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx)',
		},
	},
};
