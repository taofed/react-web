/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactSlider
 */
'use strict';

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import Image from 'ReactImage';
import PanResponder from 'ReactPanResponder';

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;

function noop() {}

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
    });
  }
  render() {
    let {
      minimumTrackTintColor,
      maximumTrackTintColor,
      styles,
      style,
      trackStyle,
      thumbStyle,
      thumbTintColor,
      thumbImage,
      disabled,
      ...other,
    } = this.props;
    let mainStyles = styles || defaultStyles;
    let trackHeight = (trackStyle && trackStyle.height) || defaultStyles.track.height;
    let thumbHeight = (thumbStyle && thumbStyle.height) || defaultStyles.thumb.height;
    let minTrackWidth = this._getMinTrackWidth();
    let minimumTrackStyle = {
      width: minTrackWidth,
      marginTop: -trackHeight,
      backgroundColor: minimumTrackTintColor,
    };
    return (
      <View style={[mainStyles.container, style]}>
        <View ref="totalTrack"
          style={[
            {backgroundColor: maximumTrackTintColor},
            mainStyles.track, trackStyle,
            disabled && {backgroundColor: mainStyles.disabled.backgroundColor},
          ]} />
        <View ref="minTrack" style={[mainStyles.track, trackStyle, minimumTrackStyle]} />
        {
          thumbImage && thumbImage.uri &&
          <Image ref="thumb" source={thumbImage} style={[
            {width: mainStyles.thumb.width, height: mainStyles.thumb.height},
            thumbStyle, {left: minTrackWidth, position: 'relative', display: 'block'},
            {marginLeft: - thumbHeight / 2, marginTop: -(thumbHeight + trackHeight) / 2},
          ]}
          {...this._panResponder.panHandlers} /> ||
          <View ref="thumb" style={[
            {backgroundColor: thumbTintColor, left: minTrackWidth},
            mainStyles.thumb, thumbStyle,
            {marginLeft: - thumbHeight / 2, marginTop: -(thumbHeight + trackHeight) / 2},
            disabled && {boxShadow: mainStyles.disabled.boxShadow},
          ]}
          {...this._panResponder.panHandlers} />
        }
    </View>);
  }
  _handleStartShouldSetPanResponder() {
    return !this.props.disabled;
  }
  _handleMoveShouldSetPanResponder() {
    return false;
  }
  _handlePanResponderGrant(e, gestureState) {
    this.previousLeft = this._getWidth('minTrack');
    this.previousValue = this.state.value;
    this._fireProcessEvent('onSlidingStart');
  }
  _handlePanResponderMove(e, gestureState) {
    this.setState({value: this._getValue(gestureState)});
    this._fireProcessEvent('onValueChange');
  }
  _handlePanResponderEnd(e, gestureState) {
    this.setState({value: this._getValue(gestureState)});
    this._fireProcessEvent('onSlidingComplete');
  }
  _fireProcessEvent(event) {
    if (this.props[event]) {
      this.props[event](this.state.value);
    }
  }
  _getValue(gestureState) {
    const {step, maximumValue, minimumValue} = this.props;
    let totalWidth = this._getWidth('totalTrack');
    let thumbLeft = Math.min(totalWidth,
      Math.max(0, this.previousLeft + gestureState.dx)),
      ratio = thumbLeft / totalWidth,
      newValue = ratio * (maximumValue - minimumValue) + minimumValue;
    if (step > 0) {
      return Math.round(newValue / step) * step;
    } else {
      return newValue;
    }
  }
  _getWidth(ref) {
    if (this.refs[ref]) {
      let node = ReactDOM.findDOMNode(this.refs[ref]),
        rect = node.getBoundingClientRect();
      return rect.width;
    }
  }
  _getMinTrackWidth() {
    let value = this.state.value;
    return 100 * (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue) + '%';
  }
}

Slider.propTypes = {
  /**
   * Used to style and layout the `Slider`.  See `StyleSheet.js` and
   * `ViewStylePropTypes.js` for more info.
   */
  style: View.propTypes.style,
  /**
   * Initial value of the slider. The value should be between minimumValue
   * and maximumValue, which default to 0 and 1 respectively.
   * Default value is 0.
   *
   * *This is not a controlled component*, e.g. if you don't update
   * the value, the component won't be reset to its inital value.
   */
  value: PropTypes.number,
  /**
   * Step value of the slider. The value should be
   * between 0 and (maximumValue - minimumValue).
   * Default value is 0.
   */
  step: PropTypes.number,
  /**
   * Initial minimum value of the slider. Default value is 0.
   */
  minimumValue: PropTypes.number,
  /**
   * Initial maximum value of the slider. Default value is 1.
   */
  maximumValue: PropTypes.number,
  /**
   * The color used for the track to the left of the button. Overrides the
   * default blue gradient image.
   */
  minimumTrackTintColor: PropTypes.string,
  /**
   * The color used for the track to the right of the button. Overrides the
   * default blue gradient image.
   */
  maximumTrackTintColor: PropTypes.string,
  /**
   * If true the user won't be able to move the slider.
   * Default value is false.
   */
  disabled: PropTypes.bool,
  /**
   * Sets an image for the track. It only supports images that are included as assets
   */
  trackImage: PropTypes.any,
  /**
   * Sets an image for the thumb. It only supports static images.
   */
  thumbImage: PropTypes.any,
  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onValueChange: PropTypes.func,
  /**
   * Callback called when the user finishes changing the value (e.g. when
   * the slider is released).
   */
  onSlidingComplete: PropTypes.func,
};

Slider.defaultProps = {
  value: 0,
  step: 0,
  minimumValue: 0,
  maximumValue: 1,
  minimumTrackTintColor: '#0f85fb',
  maximumTrackTintColor: '#b3b3b3',
  thumbTintColor: '#fff',
  disabled: false,
  onValueChange: noop,
  onSlidingComplete: noop,
};

let defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    boxShadow: '2px 3px 10px rgba(0,0,0,0.75)',
  },
  disabled: {
    backgroundColor: '#dadada',
    boxShadow: '2px 3px 10px rgba(0,0,0,0.25)',
  },
});

Slider.isReactNativeComponent = true;

export default Slider;
