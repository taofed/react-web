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

/**
 * Builds the javascript bundle.
 */
function bundle(argv, config) {

  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  return new Promise((resolve, reject) => {
    _bundle(argv, config, resolve, reject);
  });
}

function _bundle(argv, config, resolve, reject) {

  var webpackConfig = require(config.getWebpackConfig(argv[1]));
  var compiler = webpack(webpackConfig);
  compiler.run(function(err, stats) {

    var options = {
      colors: true
    };
    console.log(stats.toString(options));
    resolve(stats);
  });
}

module.exports = bundle;
