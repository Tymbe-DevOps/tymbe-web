const path = require('path');
const bundler = require('webpack');
const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except');

const isProduction = require('./helpers/isProduction');
const config = require('./helpers/getConfig');
const logger = require('./helpers/logger.js');

let lastCompilerForClose = null;

module.exports = function webpack(callback) {
	const { rules = {}, breakpointsVars = {} } = config.mediaQueries;
	const { apiBaseUrl } = config;

	let isReady = false;
	const settings = {
		mode: 'development',
		resolve: {
			extensions: ['.js', '.json', '.jsx'],
			modules: [path.join(__dirname, '../node_modules'), path.join(__dirname, '../bower_components')],
		},
		entry: {
			app: `./${config.src.scripts}app`,
		},
		output: {
			path: path.join(__dirname, `../${config.dest.scripts}`),
			filename: '[name].js',
			publicPath: config.assets.dynamicScripts,
			chunkFilename: '[name].chunk.js',
		},
		module: {
			rules: [
				{
					test: /\.js(x)?$/,
					exclude: babelLoaderExcludeNodeModulesExcept([
						'@superkoders/sk-tools',
						'stimulus',
						'stimulus-use',
						'@superkoders/cookie',
					]),
					use: 'babel-loader',
				},
			],
		},
		plugins: [
			new bundler.DefinePlugin({
				PROJECT_CONFIG: JSON.stringify({
					breakpointsVars,
					rules,
					apiBaseUrl
				}),
			}),
		],
		profile: true,
		devtool: isProduction() ? false : 'source-map',
	};

	if (isProduction()) {
		settings.mode = 'production';
	}

	const onCompiler = (error, stats) => {
		const jsonStats = stats.toJson();
		const { errors } = jsonStats;
		const { warnings } = jsonStats;

		if (error) {
			logger.onError({
				title: 'JS error!',
				message: error,
			})();
		} else if (stats.hasErrors()) {
			logger.onError({
				title: 'JS error!',
			})(errors[0]);
		} else if (stats.hasWarnings()) {
			logger.onError({
				title: 'JS error!',
			})(warnings[0]);
		} else {
			logger.log(`[webpack] ${stats.toString(config.webpack.stats)}`);
		}

		if (!isReady) {
			callback();
		}

		isReady = true;
	};

	// run compilation
	if (lastCompilerForClose) {
		lastCompilerForClose.close();
	}
	const compiler = bundler(settings);
	if (isProduction()) {
		compiler.run(onCompiler);
		lastCompilerForClose = compiler;
	} else {
		lastCompilerForClose = compiler.watch({ ignored: /node_modules|bower_components/ }, onCompiler);
	}

	return lastCompilerForClose;
};
