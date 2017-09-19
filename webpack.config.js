const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  	entry: './main.js',
  	output: {
    	filename: 'bundle.js',
    	path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		publicPath: 'http://localhost:8080',
		contentBase: path.join(__dirname, "dist"),
		// compress: true,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader' ]
				})
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
		        }
			}
		]
	},
	// Generate source maps
    devtool: 'source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// Write CSS to a styles.css file
		new ExtractTextPlugin({
			filename: 'styles.css'
		})
	]
};
