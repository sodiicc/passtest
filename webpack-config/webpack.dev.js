const path = require('path');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || config.clientHost;
const PORT = process.env.PORT || config.clientPort;
const metadata = {
    env: ENV,
    host: HOST,
    port: PORT
};

const PATHS = {
    source: path.join(__dirname, '../src'),
    app: path.join(__dirname, '../src/app'),
    build: path.join(__dirname, '../../src/main/resources/dist')
};

module.exports = {
    devServer: {
        proxy: [
            {
                context: ['/api/**'],
                target: config.frontendHost,
                secure: false
            }
        ]
    },

    devtool: "cheap-module-eval-source-map",
    entry: {
        'vendor': PATHS.app + '/vendor.ts',
        'main': PATHS.app + '/main.ts'
    },
    // entry: {
    //     'vendor': PATHS.app + '/vendor.[hash].ts',
    //     'main': PATHS.app + '/main.[hash].ts'
    // },
    output: {
        path: PATHS.build,
        publicPath: '/',
        filename: '[name].[hash].js'
    },
    module: {
        loaders: [
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.(pug|jade|html)$/,
                loaders: ['html-loader', 'pug-html-loader?doctype=html&pretty=true&exports=false']
            },
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'ts-loader',
                        query: {
                            compilerOptions: {noEmit: false}
                        }
                    },
                    {
                        loader: 'angular2-template-loader'
                    },
                    {
                        loader: 'angular-router-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpeg|jpg|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/[name].[hash].css',
            allChunks: true
        }),
        // new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity}),
        new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.env)}}),

        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, 'frontend/src/app')
        ),

        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new HtmlWebpackPlugin({
            template: PATHS.app + '/index.pug',
            filename: 'index.html',
            chunks: ['vendor', 'main'],
            chunksSortMode: function (a, b) {
                if (a.names[0] > b.names[0]) {
                    return -1;
                }
                if (a.names[0] < b.names[0]) {
                    return 1;
                }
                return 0;
            }
        }),

        new CopyWebpackPlugin([
            { from: PATHS.app + '/manifest.json', to: PATHS.build },
            { from: PATHS.app + '/browserconfig.xml', to: PATHS.build },
            { from: PATHS.app + '/firebase-messaging-sw.js', to: PATHS.build },
            { from: PATHS.app + '/assets/img/icon', to: PATHS.build + '/assets/img/icon' }
        ])
    ],
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        alias: {
            jquery: 'jquery/src/jquery',
        },
        extensions: ['.ts', '.js', '.json', '.css']
    }
};
