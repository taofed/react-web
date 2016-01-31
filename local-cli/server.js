/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 */
'use strict';

var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

/**
 * Starts the React Web Server.
 */
function server(argv, config) {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  return new Promise((resolve, reject) => {
    _server(argv, config, resolve, reject);
  });
}

function _server(argv, config, resolve, reject) {
  var webpackConfig = require(config.getWebpackConfig(argv[1]));
  var port = webpackConfig.port;

  process.on('uncaughtException', error => {
    if (error.code === 'EADDRINUSE') {
      console.log(
        chalk.bgRed.bold(' ERROR '),
        chalk.red('Server can\'t listen on port', chalk.bold(port))
      );
      console.log('Most likely another process is already using this port');
      console.log('Run the following command to find out which process:');
      console.log('\n  ', chalk.bold('lsof -n -i4TCP:' + port), '\n');
      console.log('You can either shut down the other process:');
      console.log('\n  ', chalk.bold('kill -9 <PID>'), '\n');
      console.log('or run packager on different port.');
    } else {
      console.log(chalk.bgRed.bold(' ERROR '), chalk.red(error.message));
      const errorAttributes = JSON.stringify(error);
      if (errorAttributes !== '{}') {
        console.error(chalk.red(errorAttributes));
      }
      console.error(chalk.red(error.stack));
    }
    process.exit(1);
  });


  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
  }).listen(port, webpackConfig.ip, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log('Listening at ' + webpackConfig.ip + ':' + port);
  });
}

module.exports = server;
