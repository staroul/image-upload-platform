const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.js');
const VueLoaderPlugin = require("vue-loader/lib/plugin");

webpackBaseConfig.plugins = [];

module.exports = merge(webpackBaseConfig,{
    output: {
        publicPath: '/dist/',
        filename: '[name].[hash].js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlwebpackPlugin({
            filename: 'index_prod.html',
            template: 'index.ejs',
            inject: false
        }),
        new VueLoaderPlugin()
    ]
});