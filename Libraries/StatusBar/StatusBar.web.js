/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStatusBar
 */

'use strict';

import React from 'react';

var emptyFunction = function() {};

var StatusBar = React.createClass({
  setHidden: emptyFunction,
  setBarStyle: emptyFunction,
  setNetworkActivityIndicatorVisible: emptyFunction,
  setBackgroundColor: emptyFunction,
  setTranslucent: emptyFunction,
  render: function() {
    return <div />;
  },
});

StatusBar.isReactNativeComponent = true;

export default StatusBar;
