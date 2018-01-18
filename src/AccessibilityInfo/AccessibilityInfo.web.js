/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 */
'use strict';

const AccessibilityInfo = {
  fetch: function() {
    return new Promise((resolve, reject) => {
      const isEnabled = false;
      resolve(isEnabled);
    });
  },
  addEventListener: function() { },
  removeEventListener: function() { },
};

export default AccessibilityInfo;
