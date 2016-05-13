![react-web](https://cloud.githubusercontent.com/assets/677114/13032846/13118fe4-d33e-11e5-8ddd-4088e57a2eb2.png)

# React Web [![npm version](https://badge.fury.io/js/react-web.svg)](http://badge.fury.io/js/react-web)

> 基于 React 的构建无线 Web 应用框架

## 演示

![Examples](http://img2.tbcdn.cn/L1/461/1/0d463dbae33dcb28ffb732c60abe28856e55109f.png)

* [UIExplorer](http://rawgit.com/taobaofed/react-web/master/pages/uiexplorer.html)
* [Movies](http://rawgit.com/taobaofed/react-web/master/pages/movies.html)
* [TicTacToe](http://rawgit.com/taobaofed/react-web/master/pages/tictactoe.html)
* [Game2048](http://rawgit.com/taobaofed/react-web/master/pages/game2048.html)

## 安装

```
npm install react-web --save
```

## 使用

### 第一步：项目中修改 webpack 配置

在 webpack 配置中，需要添加 alias 将 `react-native` 指向 `react-web`，其次需要安装 `haste-resolver-webpack-plugin` 插件。

```
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

#### HasteResolverPlugin 的用处？

使用 React Web 组件，需要在我们的组件中去 `require('ReactActivityIndicator')`，如果目标是 Web 端，那么打包时就会引用 ActivityIndicator.web.js 这个文件。

HasteResolverPlugin 插件就为你做了这件事情，它会：

1. 扫描所有组件 `@providesModule` 信息并记录下来。
2. Webpack 编译时，使其可以识别 `ReactActivityIndicator` 这种写法，而不会报错。
3. 根据目标平台，帮助 Webpack 打包对应组件文件。

你可以在每个组件顶部注释发现类似 `@providesModule ReactActivityIndicator` 的注释，没错就是给 HasteResolverPlugin 插件用的。

### 第二步：引入你需要的模块

加载模块的两种方式：

#### 第一种

```
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  Platform,
} = React;
```

这种引用方式看起来像是我们在使用原生的 react-native 的方式：

我们像在 Node.js 中一样 require 模块，并通过[解构赋值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)的写法，使得一些组件可以在当前文件的作用域中被引用。

也就是说，如果我们这样定义了，每次应用组件时就可以直接：

```
var styles = StyleSheet.create({
 //your code
});
```

而不用：

```
var styles = React.StyleSheet.create({
 //your code
});
```

但实际上在 react-web 中这样引用就比较与众不同了：

我们 `require('react-native')`，在 react-web 构建的时候也会被重命名，变成引用到 react-web 封装后的形式，相当于 `require('ReactReact')`；

与此同时，这种形式的写法会把所有的组件一次性引入进来，包括 ReactAppRegistry/ReactView/... 等等，即使有些组件并没有应用到。

#### 第二种

```
var AppRegistry = require('ReactAppRegistry');
var View = require('ReactView');
var Text = require('ReactText');
var Platform = require('ReactPlatform');
```

这里我们按需 require 封装后的组件：ReactAppRegistry/ReactView/...。
封装后的组件使我们不再需要关心平台的差异(Web/iOS/Android)。像上面提到的，HasteResolverPlugin 插件会帮助 webpack 做好代码的编译和打包工作。

### 第三步：平台差异性

1. Web 端的 pageX/pageY 获取与 React Native 有差异
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

2. Web 端初始化需要使用 runApplication
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

3. Web 端请求数据需要考虑跨域
  ```js
  var fetch = Platform.OS === 'web'? require('ReactJsonp'): require('ReactFetch');
  ```

4. Web 端没有 LayoutAnimation
  ```js
  var LayoutAnimation = require('ReactLayoutAnimation')
  if(Platform.OS !== 'web'){
    LayoutAnimation.configureNext(...)
  }
  ```
5. ScrollView 需要指定高度
  ```js
  <ScrollView style={{height: 235}} horizontal={true}></ScrollView>
  ```

## 任务脚本

* 校验代码规范 - **npm run lint** - 提交代码之前必须先执行这个以校验代码规范。
* 测试 - **npm test** - 使用 Jest 运行单元测试。
* 开发 - **npm start** - 执行之后会启动一个本地服务器 *localhost:3000* 并且带有 Hot Module Reloading 的功能。
* 生成 Demo - **npm run demo** - 执行之后会在 *pages* 目录下生成 demo 静态文件用于部署演示。

## 开源协议

React Web 基于 [BSD 开源协议](./LICENSE).
