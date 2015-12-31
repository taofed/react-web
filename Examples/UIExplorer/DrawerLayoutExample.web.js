'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  } = React;

var DrawerLayoutExample = React.createClass({
  statics: {
    title: '<DrawerLayout>',
    description: 'DrawerLayout',
  },

  render: function() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
      </View>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        onDrawerStateChanged={this._onDrawerStateChanged}
        onDrawerSlide={this._onDrawerSlide}
        onDrawerClose={this._onDrawerClose}
        onDrawerOpen={this._onDrawerOpen}
        renderNavigationView={() => navigationView}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>drag Drawer from right side</Text>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello World!</Text>
        </View>
      </DrawerLayoutAndroid>
    );
  },
  _onDrawerStateChanged: function() {
    console.log('change', arguments);
  },
  _onDrawerSlide: function() {
    console.log('slide', arguments);
  },
  _onDrawerClose: function() {
    console.log('close', arguments);
  },
  _onDrawerOpen: function() {
    console.log('open', arguments);
  }
});

module.exports = DrawerLayoutExample;