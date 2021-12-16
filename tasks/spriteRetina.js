const { src, dest } = require('gulp');
const spritesmith = require('gulp.spritesmith');

const config = require('./helpers/getConfig.js');

module.exports = function spriteRetina() {
	let sprites = src(['*.png', '!_no-delete.png'], {
		cwd: `${config.src.images}bg/sprites-retina/`,
	});

	sprites = sprites.pipe(
		spritesmith({
			padding: 2,
			imgName: 'sprites-retina.png',
			imgPath: `sprites-retina.png?v=${new Date().getTime()}`,
			cssName: 'sprites-retina.scss',
			cssFormat: 'scss',
			algorithm: 'binary-tree',
			cssTemplate: `${config.src.styles}tpl/sprites-retina.css.tpl`,
		}),
	);

	sprites.img.pipe(dest(`${config.dest.images}bg/`));
	sprites.css.pipe(dest(`${config.src.styles}core/generated/`));

	return sprites;
};
