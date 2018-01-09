/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPlatform
 */

'use strict';

const Platform = {
  OS: 'web',
  select:(obj) => {
    return 'web' in obj ? obj.web : obj.default;
  },
};

module.exports = Platform;
