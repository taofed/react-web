/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactActivityIndicator
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import View from 'ReactView';
import StyleSheet from 'ReactStyleSheet';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import mixin from 'react-mixin';
import autobind from 'autobind-decorator';

const keyframes = {
  '50%': {
    opacity: 0.3
  },
  '100%': {
    opacity: 1
  }
};

const GRAY = '#999999';

const animationName = insertKeyframesRule(keyframes);

class ActivityIndicator extends Component {

  static propTypes = {
    /**
     * Whether to show the indicator (true, the default) or hide it (false).
     */
    animating: PropTypes.bool,
    /**
     * The foreground color of the spinner (default is gray).
     */
    color: PropTypes.string,
    /**
     * Size of the indicator. Small has a height of 20, large has a height of 36.
     */
    size: PropTypes.oneOf([
      'small',
      'large',
    ]),
  }

  static defaultProps = {
    animating: true,
    color: GRAY,
    size: 'small',
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle(i) {
    let animation = [animationName, '1.2s', `${i * 0.12}s`, 'infinite', 'ease-in-out'].join(' ');
    let animationFillMode = 'both';

    return {
      animation,
      animationFillMode,
    };
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getLineStyle(i, lines) {
    return {
      backgroundColor: this.props.color,
      position: 'absolute',
      // FIXME: hacked a fixed value for align
      top: -3,
      left: -1,
      transform: 'rotate(' + ~~(360 / lines * i) + 'deg) translate(0, -' + (this.props.size === 'large' ? 12 : 7) + 'px)',
    };
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle(i, lines) {
    let sizeLineStyle = (this.props.size === 'large') ? styles.sizeLargeLine : styles.sizeSmallLine;
    return assign(
      this.getAnimationStyle(i),
      this.getLineStyle(i, lines),
      sizeLineStyle
    );
  }

  render() {
    let lines = [];
    let sizeContainerStyle = (this.props.size === 'large') ? styles.sizeLargeContainer : styles.sizeSmallContainer;

    if (this.props.animating) {
      for (let i = 1; i <= 12; i++) {
        lines.push(<View key={i} style={this.getStyle(i, 12)} />);
      }
    }

    return (
      <View style={[styles.container, sizeContainerStyle, this.props.style]}>
        <View>
          {lines}
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    position: 'relative',
    fontSize: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSmallContainer: {
    width: 20,
    height: 20,
  },
  sizeLargeContainer: {
    width: 36,
    height: 36,
  },
  sizeSmallLine: {
    width: 2,
    height: 5,
    borderRadius: 2
  },
  sizeLargeLine: {
    width: 3,
    height: 9,
    borderRadius: 3
  }
});

mixin.onClass(ActivityIndicator, NativeMethodsMixin);

ActivityIndicator.isReactNativeComponent = true;

export default ActivityIndicator;
