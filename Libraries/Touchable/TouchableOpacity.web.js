/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableOpacity
 */
'use strict';

import Animated from 'ReactAnimated';
import React from 'react';
import TimerMixin from 'react-timer-mixin';
import { Mixin as TouchableMixin } from 'ReactTouchable';
import TouchableWithoutFeedback from 'ReactTouchableWithoutFeedback';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import mixin from 'react-mixin';
import autobind from 'autobind-decorator';
import StyleSheet from 'ReactStyleSheet';

// var ensurePositiveDelayProps = require('ensurePositiveDelayProps');
var flattenStyle = require('ReactFlattenStyle');

type Event = Object;

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy, and in general is
 * easy to add to an app without weird side-effects.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 */

const DEFAULT_PROPS = {
  activeOpacity: 0.2,
  style: StyleSheet.create({
    cursor: 'pointer'
  })
};

class TouchableOpacity extends React.Component {

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: React.PropTypes.number,
  };

  static defaultProps = DEFAULT_PROPS;

  state = {
    ...this.touchableGetInitialState(),
    anim: new Animated.Value(1),
  }

  // componentDidMount: function() {
  //   // ensurePositiveDelayProps(this.props);
  // },

  componentWillReceiveProps(nextProps) {
    // ensurePositiveDelayProps(nextProps);
  }

  setOpacityTo(value) {
    Animated.timing(
      this.state.anim,
      {toValue: value, duration: 150}
    ).start();
  }

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._opacityActive();
    this.props.onPressIn && this.props.onPressIn(e);
  }

  touchableHandleActivePressOut(e: Event) {
    if (!this._hideTimeout) {
      this._opacityInactive();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  }

  touchableHandlePress(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._opacityActive();
    this._hideTimeout = this.setTimeout(
      this._opacityInactive,
      this.props.delayPressOut || 100
    );

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
    return this.props.delayPressIn || 0;
  }

  touchableGetLongPressDelayMS() {
    return this.props.delayLongPress === 0 ? 0 :
      this.props.delayLongPress || 500;
  }

  touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  }

  _opacityActive() {
    this.setOpacityTo(this.props.activeOpacity);
  }

  _opacityInactive() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    var childStyle = flattenStyle(this.props.style) || {};
    this.setOpacityTo(
      childStyle.opacity === undefined ? 1 : childStyle.opacity
    );
  }

  render() {
    return (
      <Animated.View
        accessible={true}
        accessibilityComponentType={this.props.accessibilityComponentType}
        accessibilityTraits={this.props.accessibilityTraits}
        style={[DEFAULT_PROPS.style, this.props.style, {opacity: this.state.anim}]}
        testID={this.props.testID}
        onLayout={this.props.onLayout}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}>
        {this.props.children}
      </Animated.View>
    );
  }

};

/**
 * When the scroll view is disabled, this defines how far your touch may move
 * off of the button, before deactivating the button. Once deactivated, try
 * moving it back and you'll see that the button is once again reactivated!
 * Move it back and forth several times while the scroll view is disabled.
 */
var PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

mixin.onClass(TouchableOpacity, TimerMixin);
mixin.onClass(TouchableOpacity, TouchableMixin);
mixin.onClass(TouchableOpacity, NativeMethodsMixin);
autobind(TouchableOpacity);

module.exports = TouchableOpacity;
