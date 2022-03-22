const importFresh = require('import-fresh');
const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const twing = require('gulp-twing');
const cheerio = require('cheerio');
const through2 = require('through2');
const formatHtml = require('gulp-format-html');

const config = require('./helpers/getConfig.js');
const logger = require('./helpers/logger.js');

module.exports = function twig(done) {
	const time = new Date().getTime();
	return (
		src(['*.twig'], {
			cwd: config.src.templates,
		})
			.pipe(
				plumber({
					errorHandler: logger.onError({
						title: 'Twig error!',
						callback: done,
					}),
				}),
			)
			.pipe(
				twing(importFresh('./helpers/twing.js'), config, {
					templatePaths: config.src.templates,
				}),
			)
			// cache bust
			.pipe(
				through2.obj(function generateTwig(file, encoding, cb) {
					let data = file.contents.toString('utf-8');
					const $ = cheerio.load(data);
					const $elements = $('script[src], link[rel=stylesheet][href], link[rel=import][href], link[rel=preload][href]');
					const protocolRegEx = /^(http(s)?)|\/\//;

					$elements
						.map((i, node) => {
							const name = node.name.toLowerCase();
							// eslint-disable-next-line no-nested-ternary
							const attrName = name === 'link' ? 'href' : name === 'script' ? 'src' : null;

							if (attrName == null) return null;
							const val = $(node).attr(attrName);
							if (protocolRegEx.test(val)) return null;
							return val;
						})
						.get()
						.filter((url, i, arr) => url != null && arr.indexOf(url) === i)
						.forEach((url) => {
							const originalAttrValueWithoutCacheBusting = url.split('?')[0];
							data = data.replace(new RegExp(url, 'g'), `${originalAttrValueWithoutCacheBusting}?t=${time}`);
						});
					// eslint-disable-next-line no-param-reassign
					file.contents = Buffer.from(data);
					this.push(file);
					cb();
				}),
			)
			.pipe(
				rename({
					extname: '.html',
				}),
			)
			.pipe(
				formatHtml({
					indent_size: 1,
					indent_char: '	',
					eol: '\n',
					indent_level: 0,
					indent_with_tabs: false,
					preserve_newlines: false,
				}),
			)
			.pipe(dest(config.dest.templates))
	);
};
