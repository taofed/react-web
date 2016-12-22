/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactSegmentedControl
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import View from 'ReactView';
import Text from 'ReactText';
import StyleSheet from 'ReactStyleSheet';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import mixin from 'react-mixin';
import autobind from 'autobind-decorator';

class SegmentedControl extends Component {

  static propTypes = {
    /**
     * The labels for the control's segment buttons, in order.
     */
    values: PropTypes.arrayOf(PropTypes.string),

    /**
     * The index in `props.values` of the segment to be pre-selected
     */
    selectedIndex: PropTypes.number,

    /**
     * Callback that is called when the user taps a segment;
     * passes the segment's value as an argument
     */
    onValueChange: PropTypes.func,

    /**
     * Callback that is called when the user taps a segment;
     * passes the event as an argument
     */
    onChange: PropTypes.func,

    /**
     * If false the user won't be able to interact with the control.
     * Default value is true.
     */
    enabled: PropTypes.bool,

    /**
     * Accent color of the control.
     */
    tintColor: PropTypes.string,

    /**
     * If true, then selecting a segment won't persist visually.
     * The `onValueChange` callback will still work as expected.
     */
    momentary: PropTypes.bool
  }

  static defaultProps = {
    values: [],
    enabled: true
  }

  state = {
    selectedIndex: this.props.selectedIndex,
    momentary: false
  }

  _onChange(value, index, event: Event) {

    if (this.state.selectedIndex == index) return;

    this.setState({
      selectedIndex: index
    });

    if (!event) {
      event = {
        nativeEvent: {}
      };
    }
    // shim the value
    event.nativeEvent.value = value;
    event.nativeEvent.selectedSegmentIndex = index;
    this.props.onChange && this.props.onChange(event);
    this.props.onValueChange && this.props.onValueChange(event.nativeEvent
      .value);

    if (this.props.momentary) {
      setTimeout(() => this.setState({
        selectedIndex: null
      }), 300);
    }
  }

  render() {
    let props = this.props;

    let items = props.values.map((value, index) => {
      return (<View key={index} style={[
        styles.segmentedControlItem,
        props.tintColor ? { borderColor: props.tintColor } : null,
        (this.state.selectedIndex === index) ? [ styles.segmentedControlItemSelected, props.tintColor ? { backgroundColor: props.tintColor } : null ] : null,
        index === 0 ? styles.firstChild : styles.otherChild,
        index === props.values.length - 1 ? styles.lastChild : null
      ]}>
          <Text style={[
            styles.segmentedControlText,
            props.tintColor ? {
              color: props.tintColor
            } : null, (this.state.selectedIndex === index) ? styles
            .segmentedControlTextSelected : null
          ]}
        onPress={props.enabled ? this._onChange.bind(this, value, index) : null}> {value} </Text></View>);
    });

    return (<View {...this.props} style={[styles.segmentedControl, props.enabled ? null : styles.disable, this.props.style]}>
          {items}
        </View>);
  }
};

const defaultColor = '#007AFF';

let styles = StyleSheet.create({
  segmentedControl: {
    height: 28,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  segmentedControlItem: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: defaultColor,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  segmentedControlItemSelected: {
    backgroundColor: defaultColor,
  },
  segmentedControlText: {
    color: defaultColor,
    fontSize: 12,
    lineHeight: 12,
    padding: '7 0',
    textAlign: 'center'
  },
  segmentedControlTextSelected: {
    color: 'white',
  },
  disable: {
    opacity: 0.5
  },
  firstChild: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRightWidth: 0,
  },
  otherChild: {
    borderRightWidth: 0,
  },
  lastChild: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    borderRightWidth: 1,
  },
});

mixin.onClass(SegmentedControl, NativeMethodsMixin);
autobind(SegmentedControl);

SegmentedControl.isReactNativeComponent = true;

export default SegmentedControl;
