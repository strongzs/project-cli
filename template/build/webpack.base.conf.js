'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin=require('extract-text-webpack-plugin')
const os = require('os')
const HappyPack  = require('happypack')
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length}) // 采用多进程，进程数由CPU核数决定
{{#if_eq cliType "mobile"}}const vuxLoader = require('vux-loader')
{{/if_eq}}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

{{#lint}}const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
}){{/lint}}

const webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {{#lint}}
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {{/lint}}
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'],
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'shared-module',
      minChunks: (module, count) => (
        count >= 2    // 当一个模块被重复引用2次或以上的时候单独打包起来。 
      )
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../static/public/js/vendor-mainfest.json') // 指向这个json
    }),
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happThreadPool
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
{{#if_eq cliType "PC"}}
module.exports=webpackConfig
{{/if_eq}}
{{#if_eq cliType "mobile"}}
module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui','duplicate-style']
})
{{/if_eq}}