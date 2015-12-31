/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPromise
 */

'use strict';

import Promise from 'promise/lib/es6-extensions';
import 'promise/lib/done';

/**
 * Handle either fulfillment or rejection with the same callback.
 */
Promise.prototype.finally = function(onSettled) {
  return this.then(onSettled, onSettled);
};

module.exports = Promise;
