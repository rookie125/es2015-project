/*
 * @Date: 2019-12-11 16:04:04
 * @Author: fengqiu.wu
 */
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const package = require('../package.json');
const webpackBase = require('./webpack.base');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildOutputDir = path.join(__dirname, '../', `/${package.name}`);

module.exports = ({ mode }, ...others) => webpackMerge(webpackBase({ mode }, ...others), {
	mode,
	devtool: 'none',
	output: {
		filename: '[name]-[hash:5].min.js',
		path: buildOutputDir,
		publicPath: './',
		libraryTarget: 'umd'
	},
	module: {
	},
	externals: {
	},
	performance: {
		hints: false
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					cache: true,
					parallel: true,
					sourceMap: true,
					warnings: false
				}
			}),
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /\.min\.css$/,
				safe: true,
				cache: true,
				parallel: true,
				discardComments: {
					removeAll: true
				}
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin({
			path: buildOutputDir
		}),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash:5].min.css',
			chunkFilename: '[name].css',
			allChunks: true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(mode)
		})
	]
});
