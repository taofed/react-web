/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 */
'use strict';

var path = require('path');
var fs = require('fs');
const WEBPACK_CONFIG = 'web/webpack.config.js';

/**
 * Default configuration for the CLI.
 *
 * If you need to override any of this functions do so by defining the file
 * `rw-cli.config.js` on the root of your project with the functions you need
 * to tweak.
 */
var config = {
  getRoot() {
    if (__dirname.match(/node_modules[\/\\]react-web[\/\\]local-cli$/)) {
      // CLI is running from node_modules.
      // This is the default case for all projects created using 'react-web init'.
      return path.resolve(__dirname, '../../..');
    } else {
      return path.resolve(__dirname, '..');
    }
  },

  getWebpackConfig(customConfig) {
    var webpackConfig = path.join(this.getRoot(), customConfig || WEBPACK_CONFIG);
    if(!fs.existsSync(webpackConfig)) {
      throw new Error(
        'Can\'t find webpack config file at "' +
        webpackConfig + '"'
      );
    }
    return webpackConfig
  }
};

module.exports = config;
