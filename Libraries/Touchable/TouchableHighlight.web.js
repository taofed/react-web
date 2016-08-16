/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableHighlight
 */
'use strict';

import React, { Component } from 'react';
import View from 'ReactView';
import TimerMixin from 'react-timer-mixin';
import TouchableWithoutFeedback from 'ReactTouchableWithoutFeedback';
import { Mixin as TouchableMixin } from 'ReactTouchable';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import StyleSheet from 'ReactStyleSheet';
import mixin from 'react-mixin';
import autobind from 'autobind-decorator';

type Event = Object;

var DEFAULT_PROPS = {
  activeOpacity: 0.8,
  underlayColor: 'black',
  style: {
    cursor: 'pointer'
  }
};

var PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};
var CHILD_REF = 'childRef';
var UNDERLAY_REF = 'underlayRef';
var INACTIVE_CHILD_PROPS = {
  style: StyleSheet.create({x: {opacity: 1.0}}).x,
};
var INACTIVE_UNDERLAY_PROPS = {
  style: StyleSheet.create({x: {backgroundColor: 'transparent'}}).x,
};

class TouchableHighlight extends Component {
  static propTypes = {
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
  }

  static defaultProps = DEFAULT_PROPS

  state = {...this.touchableGetInitialState(), ...this.computeSyntheticState(this.props)}

  // Performance optimization to avoid constantly re-generating these objects.
  computeSyntheticState(props) {
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
  }

  // componentDidMount() {
  //   // ensurePositiveDelayProps(this.props);
  //   // ensureComponentIsNative(this.refs[CHILD_REF]);
  // },

  componentDidUpdate() {
    // ensureComponentIsNative(this.refs[CHILD_REF]);
  }

  componentWillReceiveProps(nextProps) {
    // ensurePositiveDelayProps(nextProps);
    if (nextProps.activeOpacity !== this.props.activeOpacity ||
        nextProps.underlayColor !== this.props.underlayColor ||
        nextProps.style !== this.props.style) {
      this.setState(this.computeSyntheticState(nextProps));
    }
  }

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._showUnderlay();
    this.props.onPressIn && this.props.onPressIn(e);
  }

  touchableHandleActivePressOut(e: Event) {
    if (!this._hideTimeout) {
      this._hideUnderlay();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  }

  touchableHandlePress(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._showUnderlay();
    this._hideTimeout = this.setTimeout(this._hideUnderlay,
      this.props.delayPressOut || 100);

    var touchBank = e.touchHistory.touchBank[e.touchHistory.indexOfSingleActiveTouch];
    if (touchBank) {
      var offset = Math.sqrt(Math.pow(touchBank.startPageX - touchBank.currentPageX, 2)
          + Math.pow(touchBank.startPageY - touchBank.currentPageY, 2));
      var velocity = (offset / (touchBank.currentTimeStamp - touchBank.startTimeStamp)) * 1000;
      if (velocity < 100) this.props.onPress && this.props.onPress(e);
    } else {
      this.props.onPress && this.props.onPress(e);
    }
  }

  touchableHandleLongPress(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  }

  touchableGetPressRectOffset() {
    return PRESS_RECT_OFFSET;   // Always make sure to predeclare a constant!
  }

  touchableGetHighlightDelayMS() {
    return this.props.delayPressIn;
  }

  touchableGetLongPressDelayMS() {
    return this.props.delayLongPress;
  }

  touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  }

  _showUnderlay() {
    // if (!this.isMounted()) {
    //   return;
    // }

    this.refs[UNDERLAY_REF].setNativeProps(this.state.activeUnderlayProps);
    this.refs[CHILD_REF].setNativeProps(this.state.activeProps);
    this.props.onShowUnderlay && this.props.onShowUnderlay();
  }

  _hideUnderlay() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this.refs[UNDERLAY_REF]) {
      this.refs[CHILD_REF].setNativeProps(INACTIVE_CHILD_PROPS);
      this.refs[UNDERLAY_REF].setNativeProps({
        ...INACTIVE_UNDERLAY_PROPS,
        style: this.state.underlayStyle,
      });
      this.props.onHideUnderlay && this.props.onHideUnderlay();
    }
  }

  render() {

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

};

mixin.onClass(TouchableHighlight, TimerMixin);
mixin.onClass(TouchableHighlight, TouchableMixin);
mixin.onClass(TouchableHighlight, NativeMethodsMixin);
autobind(TouchableHighlight);

module.exports = TouchableHighlight;
