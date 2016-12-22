![react-web](https://cloud.githubusercontent.com/assets/677114/13032846/13118fe4-d33e-11e5-8ddd-4088e57a2eb2.png)

# React Web [中文](https://github.com/taobaofed/react-web/blob/master/README-zh.md) [![npm version](https://badge.fury.io/js/react-web.svg)](http://badge.fury.io/js/react-web)

> A framework for building web apps with React Native compatible API.

## Examples

![Examples](http://img2.tbcdn.cn/L1/461/1/0d463dbae33dcb28ffb732c60abe28856e55109f.png)

### Web Examples
> Open with mobile device or emulate mobile in developer tools

* [UIExplorer](http://rawgit.com/taobaofed/react-web/master/pages/uiexplorer.html)
* [Movies](http://rawgit.com/taobaofed/react-web/master/pages/movies.html)
* [TicTacToe](http://rawgit.com/taobaofed/react-web/master/pages/tictactoe.html)
* [Game2048](http://rawgit.com/taobaofed/react-web/master/pages/game2048.html)

### Example Source
* [React Native Web Example](https://github.com/yuanyan/react-native-web-example/)
* [React Native Web Exploding Hearts](https://github.com/yuanyan/react-native-web-exploding-hearts/)

## Adding web to an existing React Native project

If you already have a React Native project and want to add web support, you need to execute the following commands in your existing project directory:

1. Install `npm install react-web-cli -g`
2. Execute `react-web init <ExistedProjectDir>` to install stable npm version, or execute `react-web init --version git+https://github.com/taobaofed/react-web.git <ExistedProjectDir>` to install latest git version. That install `react-web` and `devDependencies` to your project and make a `web` directory with `webpack.config.js` file under your project
3. Register your app into a web platform. To do so, add the code from **Fix platform differences. 2. Should run application on web platform** to your index.ios.js file
4. Execute `react-web start` that starts the web dev server
5. Execute `react-web bundle` that builds the output

## Getting Started

### Install

```sh
npm install --save git+https://github.com/taobaofed/react-web.git
```

### Add Webpack configuration

Inside your webpack configuration, alias the `react-native` package to the `react-web` package, then install and add [haste-resolver-webpack-plugin](https://github.com/yuanyan/haste-resolver-webpack-plugin) plugin.

```js
// webpack.config.js
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');

module.exports = {
  resolve: {
    alias: {
      'react-native': 'react-web'
    }
  },
  plugins: [
    new HasteResolverPlugin({
      platform: 'web',
      nodeModules: ['react-web']
    })
  ]
}
```

> See more detail of the `webpack.config.js` from [React Native Web Example](https://github.com/yuanyan/react-native-web-example/blob/master/web/webpack.config.js)

#### What does HasteResolverPlugin do?

When using components of `react-web`, just `require('ReactActivityIndicator')`, and Webpack will build a bundle with `ActivityIndicator.web.js` for web platform.

`HasteResolverPlugin` will do the following for you:

1. Walk over all components and check out the `@providesModule` info.
2. When webpack build bundle, it makes your components recognised rather than throwing an error.
3. It will help webpack build bundle with correct file depending on the tar* platform.

You can find something like `@providesModule ReactActivityIndicator` on `react-web` component's comment, yes, it's for `HasteResolverPlugin`.

### Require modules

#### The CommonJS way

```js
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  Platform,
} = React;
```

This reference method looks like we're in the way of using the native react-native way:

Like the require module in Node.js, and through [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), allows some components to be referenced in the scope of the current file.

But in fact it is quite different in React Web.
When `require('react-native')`, in the construction of the webpack will be renamed, equivalent to `require('react-web')`.

At the same time, this form of writing will put all the components into at one time, including `ReactAppRegistry` `ReactView` and so on, even some components the you did not use.

#### The Haste way

```js
var AppRegistry = require('ReactAppRegistry');
var View = require('ReactView');
var Text = require('ReactText');
var Platform = require('ReactPlatform');
```

In this way, we load our components on demand, such as `ReactAppRegistry` or `ReactView` and so on.

Packaged components so that we no longer need to care about the differences between the platform.

As mentioned above, the HasteResolverPlugin plugin will help webpack to compile and package the code.

### Fix platform differences

1. Native events without direct pageX/pageY on web platform
  ```js
  if (Platform.OS == 'web') {
    var touch = event.nativeEvent.changedTouches[0];
    pageX = touch.pageX;
    pageY = touch.pageY;
  } else {
    startX = event.nativeEvent.pageX;
    startY = event.nativeEvent.pageY;
  }
  ```

2. Should run application on web platform
  ```js
  AppRegistry.registerComponent('Game2048', () => Game2048);
  if(Platform.OS == 'web'){
    var app = document.createElement('div');
    document.body.appendChild(app);
    AppRegistry.runApplication('Game2048', {
      rootTag: app
    })
  }
  ```

3. Should care about fetch domain on web platform
  ```js
  var fetch = Platform.OS === 'web'? require('ReactJsonp'): require('ReactFetch');
  ```

4. Without some APIs like `LayoutAnimation` on web platform
  ```js
  var LayoutAnimation = require('ReactLayoutAnimation')
  if(Platform.OS !== 'web'){
    LayoutAnimation.configureNext(...)
  }
  ```

5. Should manually specify the height of ScrollView
  ```js
  <ScrollView style={{height: 235}} horizontal={true} />
  ```

### React Native compatible

#### Components

* ActivityIndicatorIOS - ReactActivityIndicator
* ActivityIndicator - ReactActivityIndicator
* DatePickerIOS - ReactDatePicker *TODO*
* DrawerLayoutAndroid - ReactDrawerLayout
* Image - ReactImage
* ListView - ReactListView
* Modal - ReactModal
* Navigator - ReactNavigator
* PickerIOS ReactPicker
* ProgressViewIOS - ReactProgressView
* ScrollView - ReactScrollView
* SegmentedControlIOS - ReactSegmentedControl
* SliderIOS - ReactSlider
* Switch - ReactSwitch
* SwitchAndroid - ReactSwitch
* SwitchIOS - ReactSwitch
* RefreshControl - ReactRefreshControl
* TabBarIOS - ReactTabBar
* Text - ReactText
* TextInput - ReactTextInput
* ToastAndroid - ReactToast
* Touchable - ReactTouchable
* TouchableHighlight - ReactTouchableHighlight
* TouchableOpacity - ReactTouchableOpacity
* TouchableWithoutFeedback - ReactTouchableWithoutFeedback
* View - ReactView
* ViewPagerAndroid - ReactViewPager

#### APIs

* Alert - ReactAlert
* AlertIOS - ReactAlert
* Animated - ReactAnimated
* AppRegistry - ReactAppRegistry
* AsyncStorage - ReactAsyncStorage
* Dimensions - ReactDimensions
* Easing - ReactEasing
* InteractionManager - ReactInteractionManager
* LayoutAnimation - ReactLayoutAnimation
* PanResponder - ReactPanResponder
* PixelRatio - ReactPixelRatio
* StyleSheet - ReactStyleSheet

#### Plugins

* NativeModules - ReactNativeModules
* Platform - ReactPlatform
* processColor - ReactProcessColor

## Scripts

* Linting - **npm run lint** - Must run it before commit.
* Testing - **npm test** - Run unit testing by jest.
* Developing - **npm start** - This will run a server at *localhost:3000* and use Hot Module Reloading.
* Demo deployment - **npm run demo** - Generate demo assets under *pages* directory.

## License

React Web is [BSD licensed](./LICENSE).
