var React = require('ReactWeb');
var {
  StyleSheet
  } = React;

var usageMd = require('./quickStart.md');

var QuickStart = React.createClass({
  render: function() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div dangerouslySetInnerHTML={{__html: usageMd}} className="markdown"></div>
        </div>
      </div>
    );
  }
});

var styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: '#222',
    borderBottom: '1px #eee solid',
    paddingBottom: '10px',
    marginBottom: '30px'
  },
  container: {
    maxWidth: 860,
    width: '100%',
    margin: '0 auto'
  }
});

module.exports = QuickStart;