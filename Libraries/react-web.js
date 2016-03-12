/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactWeb
 */
'use strict';

import React from 'react';
import {extendCreateElement} from 'ReactStyleSheet';

// proxy origin react createElement
extendCreateElement(React);

// React
export * from 'react';

// Components
export const ActivityIndicatorIOS = require('ReactActivityIndicator');
export const DatePickerIOS = null;
export const DrawerLayoutAndroid = require('ReactDrawerLayout');
export const Image = require('ReactImage');
export const ListView = require('ReactListView');
export const Modal = require('ReactModal');
export const Navigator = require('ReactNavigator');
export const PickerIOS = require('ReactPicker');
export const ProgressViewIOS = require('ReactProgressView');
export const ScrollView = require('ReactScrollView');
export const SegmentedControlIOS = require('ReactSegmentedControl');
export const SliderIOS = require('ReactSlider');
export const Switch = require('ReactSwitch');
export const SwitchAndroid = require('ReactSwitch');
export const SwitchIOS = require('ReactSwitch');
export const TabBarIOS = require('ReactTabBar');
export const Text = require('ReactText');
export const TextInput = require('ReactTextInput');
export const ToastAndroid = require('ReactToast');
export const Touchable = require('ReactTouchable');
export const TouchableHighlight = require('ReactTouchableHighlight');
export const TouchableOpacity = require('ReactTouchableOpacity');
export const TouchableWithoutFeedback = require('ReactTouchableWithoutFeedback');
export const View = require('ReactView');
export const ViewPagerAndroid = require('ReactViewPager');

// APIs
export const Alert = require('ReactAlert');
export const AlertIOS = require('ReactAlert');
export const Animated = require('ReactAnimated');
export const AppRegistry = require('ReactAppRegistry');
export const AsyncStorage = require('ReactAsyncStorage');
export const Dimensions = require('ReactDimensions');
export const Easing = require('ReactEasing');
export const InteractionManager = require('ReactInteractionManager');
export const PanResponder = require('ReactPanResponder');
export const PixelRatio = require('ReactPixelRatio');
export const StyleSheet = require('ReactStyleSheet');

// Plugins
export const NativeModules = require('ReactNativeModules');
export const Platform = require('ReactPlatform');
export const processColor = require('ReactProcessColor');
