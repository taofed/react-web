/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableHighlight
 */
'use strict';

import React from 'react';
import View from 'ReactView';
import TimerMixin from 'react-timer-mixin';
import TouchableWithoutFeedback from 'ReactTouchableWithoutFeedback';
import { Mixin as TouchableMixin } from 'ReactTouchable';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import StyleSheet from 'ReactStyleSheet';

type Event = Object;

var DEFAULT_PROPS = {
  activeOpacity: 0.8,
  underlayColor: 'black',
};

var PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};
var CHILD_REF = 'childRef';
var UNDERLAY_REF = 'underlayRef';
// var INACTIVE_CHILD_PROPS = {
//   style: StyleSheet.create({x: {opacity: 1.0}}).x,
// };
var INACTIVE_UNDERLAY_PROPS = {
  style: StyleSheet.create({x: {backgroundColor: 'transparent'}}).x,
};

var TouchableHighlight = React.createClass({
  propTypes: {
    ...TouchableWithoutFeedback.propTypes,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: React.PropTypes.number,
    /**
     * The color of the underlay that will show through when the touch is
     * active.
     */
    underlayColor: React.PropTypes.string,
    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay: React.PropTypes.func,
    /**
     * Called immediately after the underlay is hidden
     */
    onHideUnderlay: React.PropTypes.func,
  },

  mixins: [TimerMixin, TouchableMixin, NativeMethodsMixin],

  getDefaultProps: () => DEFAULT_PROPS,

  // Performance optimization to avoid constantly re-generating these objects.
  computeSyntheticState: function(props) {
    return {
      activeProps: {
        style: {
          opacity: props.activeOpacity,
        }
      },
      activeUnderlayProps: {
        style: {
          backgroundColor: props.underlayColor,
        }
      },
      underlayStyle: [
        INACTIVE_UNDERLAY_PROPS.style,
        props.style,
      ]
    };
  },

  getInitialState: function() {
    return {...this.touchableGetInitialState(), ...this.computeSyntheticState(this.props)};
  },

  componentDidMount: function() {
    // ensurePositiveDelayProps(this.props);
    // ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentDidUpdate: function() {
    // ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentWillReceiveProps: function(nextProps) {
    // ensurePositiveDelayProps(nextProps);
    if (nextProps.activeOpacity !== this.props.activeOpacity ||
        nextProps.underlayColor !== this.props.underlayColor ||
        nextProps.style !== this.props.style) {
      this.setState(this.computeSyntheticState(nextProps));
    }
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._showUnderlay();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    if (!this._hideTimeout) {
      this._hideUnderlay();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._showUnderlay();
    this._hideTimeout = this.setTimeout(this._hideUnderlay,
      this.props.delayPressOut || 100);
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    return PRESS_RECT_OFFSET;   // Always make sure to predeclare a constant!
  },

  touchableGetHighlightDelayMS: function() {
    return this.props.delayPressIn;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayLongPress;
  },

  touchableGetPressOutDelayMS: function() {
    return this.props.delayPressOut;
  },

  _showUnderlay: function() {
    if (!this.isMounted()) {
      return;
    }

    // this.refs[UNDERLAY_REF].setNativeProps(this.state.activeUnderlayProps);
    // this.refs[CHILD_REF].setNativeProps(this.state.activeProps);
    this.props.onShowUnderlay && this.props.onShowUnderlay();
  },

  _hideUnderlay: function() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this.refs[UNDERLAY_REF]) {
      // this.refs[CHILD_REF].setNativeProps(INACTIVE_CHILD_PROPS);
      // this.refs[UNDERLAY_REF].setNativeProps({
      //  ...INACTIVE_UNDERLAY_PROPS,
      //  style: this.state.underlayStyle,
      // });
      this.props.onHideUnderlay && this.props.onHideUnderlay();
    }
  },

  render: function() {

    return (
      <View
        accessible={true}
        accessibilityComponentType={this.props.accessibilityComponentType}
        accessibilityTraits={this.props.accessibilityTraits}
        ref={UNDERLAY_REF}
        style={this.state.underlayStyle}
        onLayout={this.props.onLayout}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}
        testID={this.props.testID}>
        {React.cloneElement(
          React.Children.only(this.props.children),
          {
            ref: CHILD_REF,
          }
        )}
      </View>
    );
  }
});

module.exports = TouchableHighlight;
