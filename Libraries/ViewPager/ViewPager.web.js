/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactViewPager
 *
 */
'use strict';

import React, { cloneElement, PropTypes } from 'react';
import TweenState, { Mixin as TweenStateMixin } from 'react-tween-state';
import assign from 'object-assign';
import Dimensions from 'ReactDimensions';

var deviceSize = Dimensions.get('window');
var VIEWPAGER_REF = 'viewpager';

var ViewPager = React.createClass({
  mixins: [TweenStateMixin],

  propTypes: {
    /**
     * Index of initial page that should be selected. Use `setPage` method to
     * update the page, and `onPageSelected` to monitor page changes
     */
    initialPage: PropTypes.number,

    /**
     * Executed when transitioning between pages (ether because of animation for
     * the requested page change or when user is swiping/dragging between pages)
     * The `event.nativeEvent` object for this callback will carry following data:
     *  - position - index of first page from the left that is currently visible
     *  - offset - value from range [0,1) describing stage between page transitions.
     *    Value x means that (1 - x) fraction of the page at "position" index is
     *    visible, and x fraction of the next page is visible.
     */
    onPageScroll: PropTypes.func,

    /**
     * This callback will be caleld once ViewPager finish navigating to selected page
     * (when user swipes between pages). The `event.nativeEvent` object passed to this
     * callback will have following fields:
     *  - position - index of page that has been selected
     */
    onPageSelected: PropTypes.func,

    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *   - 'none' (the default), drags do not dismiss the keyboard.
     *   - 'on-drag', the keyboard is dismissed when a drag begins.
     */
    //keyboardDismissMode: PropTypes.oneOf([
    //  'none', // default
    //  'on-drag'
    //])
  },

  getDefaultProps() {
    return {
      easing: 'easeOutCirc'
    };
  },

  getInitialState() {
    return {
      selectedPage: this.props.initialPage
    };
  },

  getInnerViewNode() {
    return this.refs[VIEWPAGER_REF].childNodes[0];
  },

  componentWillMount() {
    this.setDimensions();
  },

  setDimensions() {

    this.setState({
      pageCount: this.props.children.length,
      pageWidth: deviceSize.width
    });
  },

  componentDidMount() {
    this.setPage(this.state.selectedPage);
  },

  _childrenWithOverridenStyle() {
    // Override styles so that each page will fill the parent. Native component
    // will handle positioning of elements, so it's not important to offset
    // them correctly.
    return React.Children.map(this.props.children, function(child) {
      var newProps = {
        style: [child.props.style, {
          //position: 'absolute',
          //left: 0,
          //top: 0,
          //right: 0,
          //bottom: 0,
          width: deviceSize.width,
        }],
        collapsable: false,
      };
      //if (child.type &&
      //  child.type.displayName &&
      //  (child.type.displayName !== 'RCTView') &&
      //  (child.type.displayName !== 'View')) {
      //  console.warn('Each ViewPager child must be a <View>. Was ' + child.type.displayName);
      //}
      return cloneElement(child, assign({}, child.props, newProps));
    });
  },
  render: function() {
    var children = this._childrenWithOverridenStyle();

    return (<div
      style={this.props.style}
      ref={VIEWPAGER_REF}
      {...this.getTouchEvents()}
      >
      <div style={{
        width: this.state.pageWidth * this.state.pageCount,
        position: 'absolute',
        top: 0,
        left: this.getTweeningValue('left') || 0,
        bottom: 0,
        flexDirection: 'row'
      }}>
        {children}
      </div>
    </div>);
  },

  getTouchEvents() {
    var self = this;

    return {
      onTouchStart(e) {
        self.touchObject = {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY
        };
      },
      onTouchMove(e) {
        var direction = self.swipeDirection(
          self.touchObject.startX,
          e.touches[0].pageX,
          self.touchObject.startY,
          e.touches[0].pageY
        );

        if (direction !== 0) {
          e.preventDefault();
        }

        self.touchObject = {
          startX: self.touchObject.startX,
          startY: self.touchObject.startY,
          endX: e.touches[0].pageX,
          endY: e.touches[0].pageY,
          length: Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - self.touchObject.startX, 2))),
          direction: direction
        };

        self.setState({
          left: (self.state.pageWidth * self.state.selectedPage + (self.touchObject.length * self.touchObject.direction)) * -1
        });
      },
      onTouchEnd(e) {
        self.handleSwipe(e);
      },
      onTouchCancel(e) {
        self.handleSwipe(e);
      }
    };
  },
  handleSwipe(ev) {

    if (typeof (this.touchObject.length) !== 'undefined' && this.touchObject.length > 44) {
      this.clickSafe = true;
    } else {
      this.clickSafe = false;
    }

    if (this.touchObject.length > (this.state.pageWidth) / 5) {
      if (this.touchObject.direction === 1) {
        this.next();
      } else if (this.touchObject.direction === -1) {
        this.previous();
      }
    } else {
      this.setPage(this.state.selectedPage);
    }

    this.touchObject = {};

    this.setState({
      dragging: false
    });
  },
  next() {
    if (this.state.selectedPage + 1 >= this.props.children.length) {
      this.animate(TweenState.easingTypes[this.props.easing]);
      return;
    }
    this.setPage(this.state.selectedPage + 1);
  },

  previous() {
    if (this.state.selectedPage - 1 < 0) {
      this.animate(TweenState.easingTypes[this.props.easing]);
      return;
    }
    this.setPage(this.state.selectedPage - 1);
  },

  setPage(index) {
    var self = this;
    if (index >= this.props.children.length || index < 0) {
      return;
    }
    this.setState({
      selectedPage: index
    }, function() {
      self.animate();

      self.props.onPageSelected && self.props.onPageSelected({
        nativeEvent: {
          position: self.state.selectedPage
        }
      });

      self.props.onPageScroll && self.props.onPageScroll({
        nativeEvent: {
          position: self.state.selectedPage,
          offset: 0
        }
      });

    });
  },

  animate(easing, duration, endValue) {
    this.tweenState('left', {
      easing: easing || TweenState.easingTypes[this.props.easing],
      duration: duration || this.props.speed,
      endValue: endValue || (-this.state.pageWidth * this.state.selectedPage),
    });
  },

  swipeDirection(x1, x2, y1, y2) {

    var xDist, yDist, r, swipeAngle;

    xDist = x1 - x2;
    yDist = y1 - y2;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
      return 1;
    }
    if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
      return 1;
    }
    if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
      return -1;
    }
    return 0;

  },
});

module.exports = ViewPager;
