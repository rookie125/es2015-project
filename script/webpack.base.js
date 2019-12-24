/*
 * @Date: 2019-12-11 16:04:04
 * @Author: fengqiu.wu
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { description } = require('../package.json');
const { version } = require('react/package.json');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { findSync } = require('./utils');

const entry = {};
const views = [];

findSync(path.resolve(__dirname, '../src/views'), false).forEach(dir => {
	const [name] = dir.match(/[^/]+$/);

	entry[name] = path.resolve(dir, 'index.js');
	views.push({
		name,
		template: path.resolve(dir, 'index.html')
	});
});

module.exports = ({ mode }) => ({
	entry: {
		...entry
	},
	resolveLoader: {
		modules: ['node_modules'],
		moduleExtensions: ['-loader']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: ['babel'],
				exclude: /node_modules/
			},
			{
				test: /\.(c|le)ss$/,
				use: [
					mode !== 'production'
						? 'style'
						: MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: mode !== 'production'
						}
					},
					'less'
				],
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../node_modules')
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url',
				options: {
					limit: 10000,
					name: '[name]-[hash:5].[ext]'
				}
			}
		]
	},
	plugins: [
		...views.map(({ name, template }) => new HtmlWebpackPlugin({
			env: mode,
			reactVersion: version,
			filename: `${name}.html`,
			template: template,
			inject: true,
			chunks: [name],
			minify: mode === 'production'
		}))
	]
});
