/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 */
'use strict';

var emptyFunction = function(arg) {
  return function() {
    return arg;
  };
};

var lastTime = 0;

var requestAnimationFrame =
  function(callback) {
    var currTime = Date.now();
    var timeDelay = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeDelay;
    return global.setTimeout(function() {
      callback(Date.now());
    }, timeDelay);
  };

// Works around a rare bug in Safari 6 where the first request is never invoked.
requestAnimationFrame(emptyFunction);

module.exports = requestAnimationFrame;
