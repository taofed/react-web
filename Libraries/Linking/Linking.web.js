/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactLinking
 */

'use strict';

var emptyFunction = function() {};

var Linking = {
  addEventListener: emptyFunction,
  removeEventListener: emptyFunction,
  openURL: (url) => {
    if (window) {
      window.open(url);
    }
  },
  canOpenURL: (url) => {
    return true;
  },
  getInitialURL: emptyFunction,
};

module.exports = Linking;
