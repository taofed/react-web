/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactWeb
 */
'use strict';

export {
  // Components
  ActivityIndicator,
  ART,
  Button,
  CheckBox,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ListView,
  Modal,
  Picker,
  ProgressBar,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  Slider,
  StatusBar,
  Switch,
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
  // APIs
  findNodeHandle,
  Animated,
  AppRegistry,
  AppState,
  AsyncStorage,
  BackHandler,
  Clipboard,
  Dimensions,
  Easing,
  I18nManager,
  InteractionManager,
  Keyboard,
  Linking,
  NetInfo,
  PanResponder,
  PixelRatio,
  Platform,
  StyleSheet,
  UIManager,
  Vibration,
  // Plugins
  processColor,
  NativeModules,
  // Prop Types
  ColorPropType,
  EdgeInsetsPropType,
  PointPropType,
  ViewPropTypes,
} from 'react-native-web';

export WebView from 'react-native-web-webview';
export Alert from './Alert';
export LayoutAnimation from './LayoutAnimation';
export AccessibilityInfo from './AccessibilityInfo';
export Geolocation from './Geolocation';
export Settings from './Settings';

// export Share from './NotImplement';
// export Systrace from './NotImplement';
// export ImageEditor from './NotImplement';
// export ImageStore from './NotImplement';
// export CameraRoll from './NotImplement';
// export SwipeableFlatList from './NotImplement';
// export SwipeableListView from './NotImplement';
// export DeviceInfo from './NotImplement';
// export NativeEventEmitter from './NotImplement';
// export YellowBox from './NotImplement';
// export TVEventHandler from './NotImplement';

// Components
// export DatePickerIOS from './NotImplement';
// export DrawerLayoutAndroid from './DrawerLayout';
// export MaskedViewIOS from './NotImplement';
// export NavigatorIOS from './NotImplement';
// export PickerIOS from './NotImplement';
// export ProgressBarAndroid from './NotImplement';
// export ProgressViewIOS from './ProgressView';
// export SegmentedControlIOS from './SegmentedControl';
// export SnapshotViewIOS from './NotImplement';
// export TabBarIOS from './NotImplement';
// export ToolbarAndroid from 'NotImplement';
// export ViewPagerAndroid from './NotImplement';

// APIs
// export ActionSheetIOS from './NotImplement';
// export BackAndroid from './NotImplement';
// export DatePickerAndroid from './NotImplement';
// export ImagePickerIOS from './NotImplement';
// export PermissionsAndroid from './NotImplement';
// export PushNotificationIOS from './NotImplement';
// export TimePickerAndroid from './NotImplement';
// export ToastAndroid from './NotImplement';

// Plugins
// export DeviceEventEmitter from './NotImplement';
// export NativeAppEventEmitter from './NotImplement';
// export requireNativeComponent from './NotImplement';
// export takeSnapshot from './NotImplement';

// Match the react-native export signature, which uses CommonJS
// (not ES6), where this works:
//    import ReactNative, {View} from 'react-native';
//    ReactNative.View === View
export default module.exports;
