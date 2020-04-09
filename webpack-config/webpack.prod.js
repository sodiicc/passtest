const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');

const ENV = process.env.NODE_ENV = 'production';

module.exports = merge(common, {
    plugins: [
        new DefinePlugin(
            {
                'webpack': {
                    'NODE_ENV': JSON.stringify(ENV),
                    'ENV': JSON.stringify(ENV)
                }
            }
        ),
        new UglifyJSPlugin({
            compress: {screw_ie8: true},
            mangle: {screw_ie8: true}
        }),
        new CompressionPlugin({regExp: /\.css$|\.html$|\.map$/})
    ]
});