const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './src')
]

const config = {
    entry: {
        app: ['./src/index']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist'),
        publicPath: '/dist'
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new CopyWebpackPlugin([{ from: './*.html' }])
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    resolve: {
        extensions: ['', '.js', '.sass'],
        root: [path.join(__dirname, './src')]
    },
    devServer: {
        publicPath: "/",
        contentBase: "./dist",
        hot: true
    }
}

module.exports = config
