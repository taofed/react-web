/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigatorNavigationBar
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import NavigatorNavigationBarStylesAndroid from 'ReactNavigatorNavigationBarStylesAndroid';
import NavigatorNavigationBarStylesIOS from 'ReactNavigatorNavigationBarStylesIOS';
import Platform from 'ReactStyleSheet';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import { Map } from 'immutable';
import autobind from 'autobind-decorator';

var COMPONENT_NAMES = ['Title', 'LeftButton', 'RightButton'];

var NavigatorNavigationBarStyles = Platform.OS === 'android' ?
  NavigatorNavigationBarStylesAndroid : NavigatorNavigationBarStylesIOS;

var navStatePresentedIndex = function(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  // TODO: rename `observedTopOfStack` to `presentedIndex` in `NavigatorIOS`
  return navState.observedTopOfStack;
};

class NavigatorNavigationBar extends Component {

  constructor(props) {
    super(props);

    this._components = {};
    this._descriptors = {};

    COMPONENT_NAMES.forEach(componentName => {
      this._components[componentName] = new Map();
      this._descriptors[componentName] = new Map();
    });

  }

  static propTypes = {
    navigator: PropTypes.object,
    routeMapper: PropTypes.shape({
      Title: PropTypes.func.isRequired,
      LeftButton: PropTypes.func.isRequired,
      RightButton: PropTypes.func.isRequired,
    }).isRequired,
    navState: PropTypes.shape({
      routeStack: PropTypes.arrayOf(PropTypes.object),
      presentedIndex: PropTypes.number,
    }),
    navigationStyles: PropTypes.object,
    style: View.propTypes.style,
  }

  static statics = {
    Styles: NavigatorNavigationBarStyles,
    StylesAndroid: NavigatorNavigationBarStylesAndroid,
    StylesIOS: NavigatorNavigationBarStylesIOS,
  }

  static defaultProps = {
    navigationStyles: NavigatorNavigationBarStyles,
  }

  _getReusableProps(
    /* string */componentName,
    /* number */index
  ) /* object */ {
    if (!this._reusableProps) {
      this._reusableProps = {};
    }
    var propStack = this._reusableProps[componentName];
    if (!propStack) {
      propStack = this._reusableProps[componentName] = [];
    }
    var props = propStack[index];
    if (!props) {
      props = propStack[index] = {style:{}};
    }
    return props;
  }

  _updateIndexProgress(
    /* number */progress,
    /* number */index,
    /* number */fromIndex,
    /* number */toIndex
  ) {
    var amount = toIndex > fromIndex ? progress : (1 - progress);
    var oldDistToCenter = index - fromIndex;
    var newDistToCenter = index - toIndex;
    var interpolate;
    if (oldDistToCenter > 0 && newDistToCenter === 0 ||
        newDistToCenter > 0 && oldDistToCenter === 0) {
      interpolate = this.props.navigationStyles.Interpolators.RightToCenter;
    } else if (oldDistToCenter < 0 && newDistToCenter === 0 ||
               newDistToCenter < 0 && oldDistToCenter === 0) {
      interpolate = this.props.navigationStyles.Interpolators.CenterToLeft;
    } else if (oldDistToCenter === newDistToCenter) {
      interpolate = this.props.navigationStyles.Interpolators.RightToCenter;
    } else {
      interpolate = this.props.navigationStyles.Interpolators.RightToLeft;
    }

    COMPONENT_NAMES.forEach(function(componentName) {
      var component = this._components[componentName].get(this.props.navState.routeStack[index]);
      var props = this._getReusableProps(componentName, index);
      if (component && interpolate[componentName](props.style, amount)) {
        component.setNativeProps(props);
      }
    }, this);
  }

  updateProgress(
    /* number */progress,
    /* number */fromIndex,
    /* number */toIndex
  ) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._updateIndexProgress(progress, index, fromIndex, toIndex);
    }
  }

  render() {
    var navBarStyle = {
      height: this.props.navigationStyles.General.TotalNavHeight,
    };
    var navState = this.props.navState;
    var components = COMPONENT_NAMES.map(function(componentName) {
      return navState.routeStack.map(
        this._getComponent.bind(this, componentName)
      );
    }, this);

    return (
      <View style={[styles.navBarContainer, navBarStyle, this.props.style]}>
        {components}
      </View>
    );
  }

  _getComponent(
    /* string */componentName,
    /* object */route,
    /* number */index
  ) /* ?Object */ {
    if (this._descriptors[componentName].includes(route)) {
      return this._descriptors[componentName].get(route);
    }

    var rendered = null;

    var content = this.props.routeMapper[componentName](
      this.props.navState.routeStack[index],
      this.props.navigator,
      index,
      this.props.navState
    );
    if (!content) {
      return null;
    }

    var initialStage = index === navStatePresentedIndex(this.props.navState) ?
      this.props.navigationStyles.Stages.Center :
      this.props.navigationStyles.Stages.Left;
    rendered = (
      <View
        ref={(ref) => {
          this._components[componentName] = this._components[componentName].set(route, ref);
        }}
        style={initialStage[componentName]}>
        {content}
      </View>
    );

    this._descriptors[componentName] = this._descriptors[componentName].set(route, rendered);
    return rendered;
  }

};


var styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

autobind(NavigatorNavigationBar);

module.exports = NavigatorNavigationBar;
