const { src, dest } = require('gulp');
const path = require('path');
const through2 = require('through2');
const consolidate = require('consolidate');
const Vinyl = require('vinyl');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const rename = require('gulp-rename');
const lodash = require('lodash');
const config = require('./helpers/getConfig.js');
const fs = require('fs');

module.exports = function iconSvg() {
	const fileName = 'icons.scss';
	const filePath = `${config.src.styles}core/generated/`;
	fs.writeFileSync(filePath + fileName, '');

	return src(['*.svg', '!_no-delete.svg'], {
		cwd: config.src.icons,
	})
		.pipe(
			rename({
				prefix: 'icon-',
			}),
		)
		.pipe(
			svgmin((file) => {
				const prefix = path.basename(file.relative, path.extname(file.relative));

				return {
					plugins: [
						{
							cleanupIDs: {
								prefix: `${prefix}-`,
								minify: true,
							},
						},
						{
							removeViewBox: false,
						},
					],
				};
			}),
		)
		.pipe(svgstore())
		.pipe(
			cheerio(($) => {
				// eslint-disable-next-line array-callback-return
				$('svg > symbol').map((i, node) => {
					const $this = $(node);
					const viewbox = $this.attr('viewbox');

					if (viewbox) {
						$this.attr('viewBox', viewbox);
						$this.removeAttr('viewbox');
					}
				});
			}),
		)
		.pipe(dest(`${config.dest.images}`))
		.pipe(
			through2.obj(function genarateScssIcons(file, _encoding, transformCallback) {
				const t = this;
				const $ = file.cheerio;

				const data = $('svg > symbol')
					.map((i, node) => {
						const $this = $(node);
						const name = $this.attr('id').slice(5);
						const [, , width, height] = $this.attr('viewBox').split(' ');

						return {
							name,
							width,
							height,
							perc: (height / width) * 100,
						};
					})
					.get();

				const byLength = function(o) {
					return o[1].length;
				};
				const groupWidth = lodash.groupBy(data, 'width');
				const gropuPerc = lodash.groupBy(data, 'perc');
				const commonWidth = lodash.maxBy(Object.entries(groupWidth), byLength)[1][0].width;
				const commonPerc = lodash.maxBy(Object.entries(gropuPerc), byLength)[1][0].perc;
				const withoutCommonWidth = lodash.filter(data, function(glyph) {
					return glyph.width !== commonWidth;
				});
				const withoutCommonPerc = lodash.filter(data, function(glyph) {
					return glyph.perc !== commonPerc;
				});

				consolidate.lodash(
					`${config.src.styles}tpl/icons.css.tpl`,
					{
						commonWidth,
						commonPerc,
						withoutCommonWidth,
						withoutCommonPerc,
					},
					(err, html) => {
						const newFile = new Vinyl({
							path: fileName,
							contents: Buffer.from(html),
						});

						t.push(newFile);
						transformCallback();
					},
				);
			}),
		)
		.pipe(dest(filePath));
};
