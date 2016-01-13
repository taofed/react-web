var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform
  } = React;

var Home = require('./Home/Home');

class Index extends React.Component {
  render() {
    return (
      <Home />
    );
  }
};

AppRegistry.registerComponent('Index', () => Index);

if (Platform.OS == 'web') {
  var app = document.createElement('div');
  document.body.appendChild(app);

  AppRegistry.runApplication('Index', {
    rootTag: app
  });
}

module.exports = Index;