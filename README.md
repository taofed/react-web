![react-web](https://cloud.githubusercontent.com/assets/677114/12007136/b5bf2230-ac31-11e5-9f6a-06f2f135411a.png)

# React Web

> A framework for building web apps with React.

## Examples

![Examples](http://img2.tbcdn.cn/L1/461/1/0d463dbae33dcb28ffb732c60abe28856e55109f.png)

### Web Examples
> Open with mobile device or emulate mobile in developer tools

* [UIExplorer](https://rawgit.com/taobaofed/react-web/master/pages/uiexplorer.html)
* [Movies](https://rawgit.com/taobaofed/react-web/master/pages/movies.html)
* [TicTacToe](https://rawgit.com/taobaofed/react-web/master/pages/tictactoe.html)
* [Game2048](https://rawgit.com/taobaofed/react-web/master/pages/game2048.html)

### Example Source
* [React Native Web Example](https://github.com/yuanyan/react-native-web-example/)

## Install

```
npm install react-web --save
```

## Usage

### Webpack configuration

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

> See more detail of the `webpack.config.js` from [React Native Web Example](https://github.com/yuanyan/react-native-web-example/blob/master/web/webpack-dev-server.config.js)

#### What does HasteResolverPlugin do?

When using components of `react-web`, just `require('ReactActivityIndicator')`, and Webpack will build a bundle with `ActivityIndicator.web.js` for web platform.

`HasteResolverPlugin` will do the following for you:

1. Walk over all components and check out the `@providesModule` info.
2. When webpack build bundle, it makes your components recognised rather than throwing an error.
3. It will help webpack build bundle with correct file depending on the target platform.

You can find something like `@providesModule ReactActivityIndicator` on `react-web` component's comment, yes, it's for `HasteResolverPlugin`.

### Require modules

Two ways to require modules.

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
That is to say, if we do so, each application component can be directly:

```js
var styles = StyleSheet.create({
 //your code
});
```

rather than:

```js
var styles = React.StyleSheet.create({
 //your code
});
```

But in fact it is quite different in react-web.
We `require('react-native')`, in the construction of the react-web will be renamed, equivalent to `require('ReactReact')`.
At the same time, this form of writing will put all the components into at one time, including ReactAppRegistry/ReactView/... And so on, even some components did not apply to.

#### The Haste way

```js
var AppRegistry = require('ReactAppRegistry');
var View = require('ReactView');
var Text = require('ReactText');
var Platform = require('ReactPlatform');
```

In this way, we load our components  on demand, such as ReactAppRegistry or ReactView and so on.
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

4. Component without setNativeProps method on web platform
  ```js
  var setNativeProps = require('ReactSetNativeProps')
  setNativeProps(this.refs.foo, {
    style: {
      top: 0
    }
  })
  ```

5. Without `LayoutAnimation` on web platform
  ```js
  var LayoutAnimation = require('ReactLayoutAnimation')
  if(Platform.OS !== 'web'){
    LayoutAnimation.configureNext(...)
  }
  ```

## Scripts

* Linting - **npm run lint** - Must run it before commit.
* Testing - **npm test** - Run unit testing by jest.
* Developing - **npm start** - This will run a server at *localhost:3000* and use Hot Module Reloading.
* Demo deployment - **npm run demo** - Generate demo assets under *pages* directory.

## License

React Web is [BSD licensed](./LICENSE).
