/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigatorBreadcrumbNavigationBar
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import NavigatorBreadcrumbNavigationBarStyles from 'ReactNavigatorBreadcrumbNavigationBarStyles';
import NavigatorNavigationBarStylesAndroid from 'ReactNavigatorNavigationBarStylesAndroid';
import NavigatorNavigationBarStylesIOS from 'ReactNavigatorNavigationBarStylesIOS';
import Platform from 'ReactPlatform';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import { Map } from 'immutable';
import invariant from 'fbjs/lib/invariant';
import autobind from 'autobind-decorator';

var Interpolators = NavigatorBreadcrumbNavigationBarStyles.Interpolators;
var NavigatorNavigationBarStyles = Platform.OS === 'android' ?
  NavigatorNavigationBarStylesAndroid : NavigatorNavigationBarStylesIOS;

/**
 * Reusable props objects.
 */
var CRUMB_PROPS = Interpolators.map(() => {return {style: {}};});
var ICON_PROPS = Interpolators.map(() => {return {style: {}};});
var SEPARATOR_PROPS = Interpolators.map(() => {return {style: {}};});
var TITLE_PROPS = Interpolators.map(() => {return {style: {}};});
var RIGHT_BUTTON_PROPS = Interpolators.map(() => {return {style: {}};});


var navStatePresentedIndex = function(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  // TODO: rename `observedTopOfStack` to `presentedIndex` in `NavigatorIOS`
  return navState.observedTopOfStack;
};


/**
 * The first route is initially rendered using a different style than all
 * future routes.
 *
 * @param {number} index Index of breadcrumb.
 * @return {object} Style config for initial rendering of index.
 */
var initStyle = function(index, presentedIndex) {
  return index === presentedIndex ? NavigatorBreadcrumbNavigationBarStyles.Center[index] :
    index < presentedIndex ? NavigatorBreadcrumbNavigationBarStyles.Left[index] :
    NavigatorBreadcrumbNavigationBarStyles.Right[index];
};

class NavigatorBreadcrumbNavigationBar extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func,
      pop: PropTypes.func,
      replace: PropTypes.func,
      popToRoute: PropTypes.func,
      popToTop: PropTypes.func,
    }),
    routeMapper: PropTypes.shape({
      rightContentForRoute: PropTypes.func,
      titleContentForRoute: PropTypes.func,
      iconForRoute: PropTypes.func,
    }),
    navState: React.PropTypes.shape({
      routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
      presentedIndex: React.PropTypes.number,
    }),
    style: View.propTypes.style,
  }

  static statics = {
    Styles: NavigatorBreadcrumbNavigationBarStyles,
  }

  _updateIndexProgress(progress, index, fromIndex, toIndex) {
    var amount = toIndex > fromIndex ? progress : (1 - progress);
    var oldDistToCenter = index - fromIndex;
    var newDistToCenter = index - toIndex;
    var interpolate;
    invariant(
      Interpolators[index],
      'Cannot find breadcrumb interpolators for ' + index
    );
    if (oldDistToCenter > 0 && newDistToCenter === 0 ||
        newDistToCenter > 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].RightToCenter;
    } else if (oldDistToCenter < 0 && newDistToCenter === 0 ||
               newDistToCenter < 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].CenterToLeft;
    } else if (oldDistToCenter === newDistToCenter) {
      interpolate = Interpolators[index].RightToCenter;
    } else {
      interpolate = Interpolators[index].RightToLeft;
    }

    if (interpolate.Crumb(CRUMB_PROPS[index].style, amount)) {
      this._setPropsIfExists('crumb_' + index, CRUMB_PROPS[index]);
    }
    if (interpolate.Icon(ICON_PROPS[index].style, amount)) {
      this._setPropsIfExists('icon_' + index, ICON_PROPS[index]);
    }
    if (interpolate.Separator(SEPARATOR_PROPS[index].style, amount)) {
      this._setPropsIfExists('separator_' + index, SEPARATOR_PROPS[index]);
    }
    if (interpolate.Title(TITLE_PROPS[index].style, amount)) {
      this._setPropsIfExists('title_' + index, TITLE_PROPS[index]);
    }
    var right = this.refs['right_' + index];
    if (right &&
        interpolate.RightItem(RIGHT_BUTTON_PROPS[index].style, amount)) {
      right.setNativeProps(RIGHT_BUTTON_PROPS[index])
    }
  }

  updateProgress(progress, fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._updateIndexProgress(progress, index, fromIndex, toIndex);
    }
  }

  onAnimationStart(fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, true);
    }
  }

  onAnimationEnd() {
    var max = this.props.navState.routeStack.length - 1;
    for (var index = 0; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, false);
    }
  }

  _setRenderViewsToHardwareTextureAndroid(index, renderToHardwareTexture) {
    var props = {
      renderToHardwareTextureAndroid: renderToHardwareTexture,
    };

    this._setPropsIfExists('icon_' + index, props);
    this._setPropsIfExists('separator_' + index, props);
    this._setPropsIfExists('title_' + index, props);
    this._setPropsIfExists('right_' + index, props);
  }

  componentWillMount() {
    this._descriptors = {
      crumb: new Map(),
      title: new Map(),
      right: new Map(),
    };
  }

  render() {
    var navState = this.props.navState;
    var icons = navState && navState.routeStack.map(this._getBreadcrumb);
    var titles = navState.routeStack.map(this._getTitle);
    var buttons = navState.routeStack.map(this._getRightButton);
    return (
      <View style={[styles.breadCrumbContainer, this.props.style]}>
        {titles}
        {icons}
        {buttons}
      </View>
    );
  }

  _getBreadcrumb(route, index) {
    if (this._descriptors.crumb.has(route)) {
      return this._descriptors.crumb.get(route);
    }

    var navBarRouteMapper = this.props.routeMapper;
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));

    var breadcrumbDescriptor = (
      <View ref={'crumb_' + index} style={firstStyles.Crumb}>
        <View ref={'icon_' + index} style={firstStyles.Icon}>
          {navBarRouteMapper.iconForRoute(route, this.props.navigator)}
        </View>
        <View ref={'separator_' + index} style={firstStyles.Separator}>
          {navBarRouteMapper.separatorForRoute(route, this.props.navigator)}
        </View>
      </View>
    );

    this._descriptors.crumb = this._descriptors.crumb.set(route, breadcrumbDescriptor);
    return breadcrumbDescriptor;
  }

  _getTitle(route, index) {
    if (this._descriptors.title.has(route)) {
      return this._descriptors.title.get(route);
    }

    var titleContent = this.props.routeMapper.titleContentForRoute(
      this.props.navState.routeStack[index],
      this.props.navigator
    );
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));

    var titleDescriptor = (
      <View ref={'title_' + index} style={firstStyles.Title}>
        {titleContent}
      </View>
    );
    this._descriptors.title = this._descriptors.title.set(route, titleDescriptor);
    return titleDescriptor;
  }

  _getRightButton(route, index) {
    if (this._descriptors.right.has(route)) {
      return this._descriptors.right.get(route);
    }
    var rightContent = this.props.routeMapper.rightContentForRoute(
      this.props.navState.routeStack[index],
      this.props.navigator
    );
    if (!rightContent) {
      this._descriptors.right = this._descriptors.right.set(route, null);
      return null;
    }
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
    var rightButtonDescriptor = (
      <View ref={'right_' + index} style={firstStyles.RightItem}>
        {rightContent}
      </View>
    );
    this._descriptors.right = this._descriptors.right.set(route, rightButtonDescriptor);
    return rightButtonDescriptor;
  }

  _setPropsIfExists(ref, props) {
    var ref = this.refs[ref];
    ref && ref.setNativeProps(props);
  }

};

var styles = StyleSheet.create({
  breadCrumbContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: NavigatorNavigationBarStyles.General.TotalNavHeight,
    top: 0,
    left: 0,
    right: 0,
  },
});

autobind(NavigatorBreadcrumbNavigationBar);

module.exports = NavigatorBreadcrumbNavigationBar;
