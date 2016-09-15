/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPlatform
 */

'use strict';

const Platform = {
  OS: 'web',
  select:(platform) => {
    return platform.web || platform.ios;
  },
};

module.exports = Platform;
