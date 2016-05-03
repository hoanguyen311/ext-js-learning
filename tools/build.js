const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const del = require('del');

var webpackConfig = require(process.cwd() + '/webpack.config');

webpackConfig.entry = [
    './main'
];

webpackConfig.module.loaders = [{
    test: /\.(jpg|png|gif)$/,
    loader: "file-loader?name=images/[name]-[hash].[ext]"
}, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract("style-loader", "css-loader", {
        publicPath: '/'
    })
}];

webpackConfig.plugins.push(new ExtractTextPlugin('css/main.css'));

function buildAsserts() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, function(err, stats) {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
};

function showLog(stats) {
    console.log(stats.toString({
        colors: true
    }));
    console.log('Ready !!!!');
}

del(process.cwd() + 'dist').then(buildAsserts).then(showLog);
