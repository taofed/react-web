![react-web](https://cloud.githubusercontent.com/assets/677114/13032846/13118fe4-d33e-11e5-8ddd-4088e57a2eb2.png)

# React Web [![npm version](https://badge.fury.io/js/react-web.svg)](http://badge.fury.io/js/react-web)

> 通过 React Native 兼容的 API 构建无线 Web 应用

## 安装

```
npm install --save react-web
```

## 使用

### 第一步：项目中修改 webpack 配置

在 webpack 配置中，需要添加 alias 将 `react-native` 指向 `react-web`:

```
// webpack.config.js

module.exports = {
  resolve: {
    alias: {
      'react-native': 'react-web'
    }
  }
}
```

### 第二步：使用 React Native API 写应用

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

## 兼容列表

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

## 开源协议

React Web 基于 [BSD 开源协议](./LICENSE).
