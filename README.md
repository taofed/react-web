![react-web](https://cloud.githubusercontent.com/assets/677114/13032846/13118fe4-d33e-11e5-8ddd-4088e57a2eb2.png)

# React Web [中文](https://github.com/taobaofed/react-web/blob/master/README-zh.md) [![npm version](https://badge.fury.io/js/react-web.svg)](http://badge.fury.io/js/react-web)

> A library for building web apps with React Native compatible API.

## Getting Started

### Install

```sh
npm install --save react-web
```

### Add Webpack configuration

Inside your webpack configuration, alias the `react-native` package to the `react-web` package:

```js
// webpack.config.js

module.exports = {
  resolve: {
    alias: {
      'react-native': 'react-web'
    }
  }
}
```

### Write your application with React Native API

```js
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Platform} from 'react-native';

class App extends Component {
  render() {
    return (
      <View style={styles.box}>
        <Text style={styles.text}>Hello, world!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {padding: 10},
  text: {fontWeight: 'bold'}
});

AppRegistry.registerComponent('App', () => App);

if (Platform.OS === 'web') {
  AppRegistry.runApplication('App', { rootTag: document.getElementById('app') });
}
```

### React Native Compatible

* ActivityIndicator
* ART
* Button
* CheckBox
* FlatList
* Image
* ImageBackground
* KeyboardAvoidingView
* ListView
* Modal
* Picker
* ProgressBar
* RefreshControl
* SafeAreaView
* ScrollView
* SectionList
* Slider
* StatusBar
* Switch
* Text
* TextInput
* Touchable
* TouchableHighlight
* TouchableNativeFeedback
* TouchableOpacity
* TouchableWithoutFeedback
* View
* VirtualizedList
* WebView
* findNodeHandle
* AccessibilityInfo
* Alert
* Animated
* AppRegistry
* AppState
* AsyncStorage
* BackHandler
* Clipboard
* Dimensions
* Easing
* Geolocation
* I18nManager
* InteractionManager
* Keyboard
* LayoutAnimation
* Linking
* NetInfo
* PanResponder
* PixelRatio
* Platform
* Settings
* StyleSheet
* UIManager
* Vibration
* processColor
* NativeModules
* ColorPropType
* EdgeInsetsPropType
* PointPropType
* ViewPropTypes

## License

React Web is [BSD licensed](./LICENSE).
