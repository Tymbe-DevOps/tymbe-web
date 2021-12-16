module.exports = (api) => {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					modules: false,
				},
			],
		],
		plugins: [
			[
				'@babel/plugin-transform-runtime',
				{
					corejs: false,
					helpers: true,
					regenerator: true,
				},
			],
			'@babel/plugin-transform-modules-commonjs',
			'@babel/plugin-proposal-object-rest-spread',
			'@babel/plugin-syntax-dynamic-import',
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-nullish-coalescing-operator',
		],
	};
};
