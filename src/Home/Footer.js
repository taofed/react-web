var React = require('ReactWeb');
var {
  StyleSheet
  } = React;

class Footer extends React.Component {
  render() {
    return (
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.containerInner}>
            <div style={styles.credit}>
              <p>Copyright © 2016 Taobao FED. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
};

var styles = StyleSheet.create({
  footer: {
    background: '#33363b',
    marginTop: 60,
    color: '#aaa'
  },
  container: {
    position: 'relative',
    padding: '0 20px'
  },
  containerInner: {
    maxWidth: 1160,
    minWidth: 320,
    width: '100%',
    margin: '0 auto'
  },
  credit: {
    padding: '20 0'
  }
});

module.exports = Footer;