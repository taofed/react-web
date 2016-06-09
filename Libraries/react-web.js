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
export ActivityIndicatorIOS from 'ReactActivityIndicator';
// export DatePickerIOS from 'ReactDatePicker';
export DrawerLayoutAndroid from 'ReactDrawerLayout';
export Image from 'ReactImage';
export ListView from 'ReactListView';
export Modal from 'ReactModal';
export Navigator from 'ReactNavigator';
export PickerIOS from 'ReactPicker';
export ProgressViewIOS from 'ReactProgressView';
export ScrollView from 'ReactScrollView';
export SegmentedControlIOS from 'ReactSegmentedControl';
export SliderIOS from 'ReactSlider';
export Switch from 'ReactSwitch';
export SwitchAndroid from 'ReactSwitch';
export SwitchIOS from 'ReactSwitch';
export TabBarIOS from 'ReactTabBar';
export Text from 'ReactText';
export TextInput from 'ReactTextInput';
export ToastAndroid from 'ReactToast';
export Touchable from 'ReactTouchable';
export TouchableHighlight from 'ReactTouchableHighlight';
export TouchableOpacity from 'ReactTouchableOpacity';
export TouchableWithoutFeedback from 'ReactTouchableWithoutFeedback';
export View from 'ReactView';
export ViewPagerAndroid from 'ReactViewPager';

// APIs
export Alert from 'ReactAlert';
export AlertIOS from 'ReactAlert';
export Animated from 'ReactAnimated';
export AppRegistry from 'ReactAppRegistry';
export AsyncStorage from 'ReactAsyncStorage';
export Dimensions from 'ReactDimensions';
export Easing from 'ReactEasing';
export InteractionManager from 'ReactInteractionManager';
export PanResponder from 'ReactPanResponder';
export PixelRatio from 'ReactPixelRatio';
export StyleSheet from 'ReactStyleSheet';

// Plugins
export NativeModules from 'ReactNativeModules';
export Platform from 'ReactPlatform';
export processColor from 'ReactProcessColor';


// Match the react-native export signature, which uses CommonJS
// (not ES6), where this works:
//    import ReactNative, {View} from 'react-native';
//    ReactNative.View === View
export default module.exports;
