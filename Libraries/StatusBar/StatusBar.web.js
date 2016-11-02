/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStatusBar
 */

'use strict';

import React from 'react';

var emptyFunction = function() {};

function StatusBar() {
  return null;
}

StatusBar.setBarStyle = emptyFunction;
StatusBar.setHidden = emptyFunction;
StatusBar.setNetworkActivityIndicatorVisible = emptyFunction;
StatusBar.setBackgroundColor = emptyFunction;
StatusBar.setTranslucent = emptyFunction;
StatusBar.isReactNativeComponent = true;

export default StatusBar;
