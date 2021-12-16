const { src, dest } = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const rename = require('gulp-rename');

const config = require('./helpers/getConfig.js');

module.exports = function iconFont(callback) {
	let isEmpty = true;

	src(['*.svg', '!_no-delete.svg'], {
		cwd: config.src.icons,
	})
		.pipe(
			iconfont({
				fontName: 'icons',
				formats: ['ttf', 'eot', 'woff'],
			}),
		)
		.on('glyphs', (glyphs, options) => {
			isEmpty = false;

			src(`${config.src.styles}tpl/icons.css.tpl`)
				.pipe(
					consolidate('lodash', {
						glyphs: glyphs.map((glyph) => {
							return {
								name: glyph.name,
								code: glyph.unicode[0]
									.charCodeAt(0)
									.toString(16)
									.toUpperCase(),
							};
						}),
						fontName: options.fontName,
						fontPath: config.assets.fonts,
						className: 'icon',
					}),
				)
				.pipe(rename('icons.scss'))
				.pipe(dest(`${config.src.styles}core/generated/`))
				.on('end', callback);
		})
		.on('end', () => {
			if (isEmpty) {
				callback();
			}
		})
		.pipe(dest(config.dest.fonts));
};
