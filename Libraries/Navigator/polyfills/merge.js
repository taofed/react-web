/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function merge(one, two) {
  return {...one, ...two};
}

module.exports = merge;
