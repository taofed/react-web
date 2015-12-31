/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

var referenceWidth = 750 / 100;

module.exports = {
  setWidth: function(width) {
    referenceWidth = width;
  },
  getWidth: function() {
    return referenceWidth;
  }
};
