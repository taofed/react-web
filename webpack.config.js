'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlPlugin = require('webpack-html-plugin');
var merge = require('webpack-merge');
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV;
var ROOT_PATH = path.resolve(__dirname);

var config = {
  paths: {
    src: path.join(ROOT_PATH, '.'),
    index: path.join(ROOT_PATH, 'src/index'),
  }
};

var mergeCommon = merge.bind(null, {
  resolve: {
    alias: {
      'react-native': 'react-web',
    },
    extensions: ['', '.js', '.jsx', '.png', '.jpg'],
  },
  module: {
    loaders: [{
      test: /\.png$/,
      loader: 'url?limit=100000&mimetype=image/png',
      include: config.paths.src,
    }, {
      test: /\.jpg$/,
      loader: 'file',
      include: config.paths.src,
    }, {
      test: /\.json$/,
      loader: 'json',
    },{
      test: /\.md$/,
      exclude: /node_modules/,
      loader: "html!markdown-highlight"
    },{
      test: /\.less$/,
      loader: 'style!css!less'
    },{
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
  plugins: [
    new HasteResolverPlugin({
      platform: 'web',
      nodeModules: ['react-web'],
      //blacklist: ['node_modules/react-native', 'pages', 'lib']
    })
  ]
});

if (NODE_ENV === 'local') {
  var IP = '0.0.0.0';
  var PORT = 3000;
  module.exports = mergeCommon({
    ip: IP,
    port: PORT,
    devtool: 'source-map',
    entry: [
      'webpack-dev-server/client?http://' + IP + ':' + PORT,
      'webpack/hot/only-dev-server',
      config.paths.index,
    ],
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlPlugin()
    ],
    module: {
      preLoaders: [{
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [config.paths.src],
      }],
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel?stage=1'],
        include: [config.paths.src],
        exclude: [/node_modules/]
      }, ]
    }
  });
}

if (NODE_ENV === 'build') {

  module.exports = mergeCommon({
    devtool: 'source-map',
    entry: {
      // tweak this to include your externs unless you load them some other way
      'react-web': ['react-native'],
      index: config.paths.index,
    },
    output: {
      path: '.',
      filename: 'build/[name].js',
      sourceMapFilename: '[file].map',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
      }),
      new webpack.optimize.CommonsChunkPlugin('react-web', 'build/react-web.js'),
      new HtmlPlugin({
        filename: 'index.html',
        favicon: 'favicon.ico',
        hash: true,
        title: 'react-web',
        chunks: ['react-web', 'index']
      })
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: [config.paths.src],
        exclude: [/node_modules/]
      }]
    }
  });
}