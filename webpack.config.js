var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: { main: './src/index'},
    output: {
        path: path.resolve(__dirname + '/build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new ExtractTextPlugin('bundle.css',{allChunks: true}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })

    ],
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', include: path.join(__dirname, 'src')},
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style',[ 'css'])},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
            { test: /\.(png|jpg|jpeg|gif|woff)$/, loader: 'url-loader?limit=8192' },
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}
        ]
    },
    devServer: {
        inline:true,
        port: 3000,
        host: 'localhost'
    }
};
