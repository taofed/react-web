/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPicker
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

class Picker extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
    selectedValue: PropTypes.any, // string or integer basically
  }

  _onChange(event) {
    // shim the native event
    event.nativeEvent.newValue = this._ref.value;

    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(event.nativeEvent.newValue);
    }
  }

  _captureRef = ref => {
    this._ref = ref;
  }

  render() {
    return (
      <select
        aria-label={this.props.accessibilityLabel}
        ref={this._captureRef}
        value={this.props.selectedValue}
        style={{
          margin: 10,
          color: 'inherit',
          font: 'inherit',
          ...this.props.style}}
        onChange={this._onChange}
      >
      {this.props.children}
      </select>
    );
  }
};

class Item extends Component {
  static propTypes = {
    value: PropTypes.any, // string or integer basically
    label: PropTypes.string,
  }

  render() {
    return <option value={this.props.value}>{this.props.label}</option>;
  }
}

Picker.Item = Item;

autobind(Picker);

Picker.isReactNativeComponent = true;

export default Picker;
