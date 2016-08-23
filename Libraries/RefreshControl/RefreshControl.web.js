/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactRefreshControl
 */
'use strict';

import React, { Component } from 'react';
import ActivityIndicator from 'ReactActivityIndicator';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import mixin from 'react-mixin';
import autobind from 'autobind-decorator';

let RefreshLayoutConsts = {SIZE: {}};

class RefreshControl extends Component {

  static SIZE = RefreshLayoutConsts.SIZE

  componentDidMount() {
    this._lastNativeRefreshing = this.props.refreshing;
  }

  componentDidUpdate(prevProps: {refreshing: boolean}) {
    // RefreshControl is a controlled component so if the native refreshing
    // value doesn't match the current js refreshing prop update it to
    // the js value.
    if (this.props.refreshing !== prevProps.refreshing) {
      this._lastNativeRefreshing = this.props.refreshing;
    } else if (this.props.refreshing !== this._lastNativeRefreshing) {
      this._nativeRef.setNativeProps({refreshing: this.props.refreshing});
      this._lastNativeRefreshing = this.props.refreshing;
    }
  }

  render() {
    // TODO
    return (
      <ActivityIndicator
        {...this.props}
        ref={ref => this._nativeRef = ref}
        onRefresh={this._onRefresh}
      />
    );
  }

  _onRefresh() {
    this._lastNativeRefreshing = true;

    this.props.onRefresh && this.props.onRefresh();

    // The native component will start refreshing so force an update to
    // make sure it stays in sync with the js component.
    this.forceUpdate();
  }
}

mixin.onClass(RefreshControl, NativeMethodsMixin);
autobind(RefreshControl);
RefreshControl.isReactNativeComponent = true;

export default RefreshControl;
