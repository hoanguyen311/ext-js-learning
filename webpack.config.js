const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const curDir = process.cwd();

module.exports = {
    context: path.join(curDir, "src"),
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        './main'
    ],
    output: {
        path: path.join(curDir, "dist"),
        filename: "scripts/bundle.js"
    },
    resolve: {
	    alias: {
	        'extJs': path.join(curDir, 'app/libs/extJs/adapter/ext/ext-base.js'),
            'extJsDebug': path.join(curDir, 'app/libs/extJs/ext-all-debug.js')
	    }
	},
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(jpg|png|gif)$/, loader: "file-loader?name=images/[name]-[hash].[ext]" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            hash: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'libs/extJs/adapter/ext/ext-base.js',
                to: 'scripts/libs/ext-base.js'
            }, {
                from: 'libs/extJs/ext-all-debug.js',
                to: 'scripts/libs/ext-debug.js'
            }
        ]),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]

};
