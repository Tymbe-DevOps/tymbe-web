const { src, dest } = require('gulp');
const spritesmith = require('gulp.spritesmith');

const config = require('./helpers/getConfig.js');

module.exports = function sprite() {
	let sprites = src(['*.png', '!_no-delete.png'], {
		cwd: `${config.src.images}bg/sprites/`,
	});

	sprites = sprites.pipe(
		spritesmith({
			padding: 2,
			imgName: 'sprites.png',
			imgPath: `sprites.png?v=${new Date().getTime()}`,
			cssName: 'sprites.scss',
			cssFormat: 'scss',
			algorithm: 'binary-tree',
			cssTemplate: `${config.src.styles}tpl/sprites.css.tpl`,
		}),
	);

	sprites.img.pipe(dest(`${config.dest.images}bg/`));
	sprites.css.pipe(dest(`${config.src.styles}core/generated/`));

	return sprites;
};
