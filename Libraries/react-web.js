/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactWeb
 */
'use strict';

import React from 'react';
import StyleSheet from 'ReactStyleSheet';

// proxy origin react createElement
StyleSheet.extendCreateElement(React);

var ReactWeb = {
  // Components
  get ActivityIndicatorIOS() { return require('ReactActivityIndicator'); },
  get ART() { return require('ReactART'); },
  get DatePickerIOS() { return null; },
  get DrawerLayoutAndroid() { return require('ReactDrawerLayout'); },
  get Image() { return require('ReactImage'); },
  get ListView() { return require('ReactListView'); },
  get Modal() { return require('ReactModal'); },
  get Navigator() { return require('ReactNavigator'); },
  get PickerIOS() { return require('ReactPicker'); },
  get ProgressViewIOS() { return require('ReactProgressView'); },
  get ScrollView() { return require('ReactScrollView'); },
  get SegmentedControlIOS() { return require('ReactSegmentedControl'); },
  get SliderIOS() { return require('ReactSlider'); },
  get Switch() { return require('ReactSwitch'); },
  get SwitchAndroid() { return require('ReactSwitch'); },
  get SwitchIOS() { return require('ReactSwitch'); },
  get TabBarIOS() { return require('ReactTabBar'); },
  get Text() { return require('ReactText'); },
  get TextInput() { return require('ReactTextInput'); },
  get ToastAndroid() { return require('ReactToast'); },
  get Touchable() { return require('ReactTouchableMixin'); },
  get TouchableHighlight() { return require('ReactTouchableHighlight'); },
  get TouchableNativeFeedback() { return require('ReactTouchable'); },
  get TouchableOpacity() { return require('ReactTouchableOpacity'); },
  get TouchableWithoutFeedback() { return require('ReactTouchable'); },
  get View() { return require('ReactView'); },
  get ViewPagerAndroid() { return require('ReactViewPager'); },

  // APIs
  get Alert() { return require('ReactAlert'); },
  get AlertIOS() { return require('ReactAlert'); },
  get Animated() { return require('ReactAnimated'); },
  get AppRegistry() { return require('ReactAppRegistry'); },
  get AsyncStorage() { return require('ReactAsyncStorage'); },
  get Dimensions() { return require('ReactDimensions'); },
  get Easing() { return require('ReactEasing'); },
  get InteractionManager() { return require('ReactInteractionManager'); },
  get PanResponder() { return require('ReactPanResponder'); },
  get PixelRatio() { return require('ReactPixelRatio'); },
  get StyleSheet() { return require('ReactStyleSheet'); },

  // Plugins
  get NativeModules() { return require('ReactNativeModules'); },
  get Platform() { return require('ReactPlatform'); },
  get processColor() { return require('ReactProcessColor'); },

  ...React,
};

module.exports = ReactWeb;
