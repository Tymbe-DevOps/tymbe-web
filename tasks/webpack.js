const path = require('path');
const notify = require('gulp-notify');
const bundler = require('webpack');
const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except');

const isProduction = require('./helpers/isProduction');
const { log } = require('./helpers/logger');
const config = require('./helpers/getConfig');

module.exports = function webpack(callback) {
	const { rules = {}, breakpointsVars = {} } = config.mediaQueries;

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
					exclude: babelLoaderExcludeNodeModulesExcept(['@superkoders/sk-tools', 'stimulus', 'stimulus-use']),
					use: 'babel-loader',
				},
			],
		},
		plugins: [
			new bundler.DefinePlugin({
				PROJECT_CONFIG: JSON.stringify({
					breakpointsVars,
					rules,
				}),
			}),
		],
		profile: true,
		watch: !isProduction(),
		watchOptions: {
			ignored: /node_modules|bower_components/,
		},
		devtool: isProduction() ? false : 'source-map',
		externals: {
			jquery: 'jQuery',
		},
	};

	if (isProduction()) {
		settings.mode = 'production';
	}

	const onError = notify.onError((error) => {
		return {
			title: 'JS error!',
			message: error,
			sound: 'Beep',
		};
	});

	const bundle = bundler(settings, (error, stats) => {
		const jsonStats = stats.toJson();
		const { errors } = jsonStats;
		const { warnings } = jsonStats;

		if (error) {
			onError(error);
		} else if (errors.length > 0) {
			onError(errors.toString());
		} else if (warnings.length > 0) {
			onError(warnings.toString());
		} else {
			log(`[webpack] ${stats.toString(config.webpack.stats)}`);
		}

		if (!isReady) {
			callback();
		}

		isReady = true;

		return isReady;
	});

	return bundle;
};
