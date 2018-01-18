/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 */
'use strict';

function warn() {
  console.warn('Settings is not yet supported on Web');
}

const Settings = {
  get(key) {
    warn();
    return null;
  },

  set(settings) {
    warn();
  },

  watchKeys(keys, callback) {
    warn();
    return -1;
  },
  clearWatch(watchId) {
    warn();
  },
};

export default Settings;
