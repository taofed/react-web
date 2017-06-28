/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactBackAndroid
 */
'use strict';

function emptyFunction() {}

const BackAndroid = {
  exitApp: emptyFunction,
  addEventListener() {
    return {
      remove: emptyFunction
    };
  },
  removeEventListener: emptyFunction
};

export default BackAndroid;
