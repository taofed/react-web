var React = require('react-native');
var {
  View,
  StyleSheet
  } = React;

var MainPanel = require('./MainPanel');
var QuickStart = require('./QuickStart');
var Corner = require('./Corner');
var Footer = require('./Footer');

require('./home.less');
require('../3rd/markdown.less');
require('../3rd/highlight.min.css');
require('../3rd/highlight.min.js');

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Corner />
        <MainPanel />
        <QuickStart />
        <Footer />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    fontFamily: '-apple-system,Helvetica,Arial,sans-serif'
  }
});

module.exports = Home;