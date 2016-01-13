var React = require('ReactWeb');

var {
  StyleSheet
  } = React;

var demos = [
  '//rawgit.com/taobaofed/react-web/master/pages/uiexplorer.html',
  '//rawgit.com/taobaofed/react-web/master/pages/movies.html',
  '//rawgit.com/taobaofed/react-web/master/pages/tictactoe.html',
  '//rawgit.com/taobaofed/react-web/master/pages/game2048.html'
];

var MainPanel = React.createClass({
  selectIndex : 0,

  pre: function() {
    if (this.selectIndex > 0) {
      this.refs.demoFrame.src = demos[--this.selectIndex];
    }
  },

  next: function() {
    if (this.selectIndex < (demos.length - 1)) {
      this.refs.demoFrame.src = demos[++this.selectIndex];
    }
  },

  render: function() {
    return (
      <div style = {styles.root}>
        <div style = {styles.intro} className="intro">

          <div style={styles.demo} className="demo">
            <img src="./src/images/left.png" style={styles.left} className="left" onClick={this.pre}/>
            <div style = {styles.demoViewPort}>
              <iframe ref="demoFrame" src={demos[0]} width="375" height="667"></iframe>
            </div>
            <img src="./src/images/right.png" style={styles.right} className="right" onClick={this.next}/>
          </div>

          <div style = {styles.introContent} className="content">
            <p><img src="./src/images/react-web.png" style={styles.logo}/></p>
            <span style={styles.mainTitle}>React Web</span>
            <span style={styles.desc}>A framework for building web apps with React.</span>
            <a href="http://badge.fury.io/js/react-web" style={styles.version}>
              <img src="https://camo.githubusercontent.com/98718da8852b1e8b292f74f3b003a5c34589c379/68747470733a2f2f62616467652e667572792e696f2f6a732f72656163742d7765622e737667" alt="npm version" data-canonical-src="https://badge.fury.io/js/react-web.svg" style={{maxWidth:'100%'}} />
            </a>
          </div>

        </div>
      </div>
    );
  }
});

var styles = StyleSheet.create({
  root: {
    marginBottom: 100,
    backgroundImage: "url('./src/images/moon.png')",
    backgroundColor: '#000',
    backgroundPosition: '0 100%',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat'
  },
  intro: {
    maxWidth: 1160,
    maxHeight: 880,
    bottom: -60,
    margin: '20px auto',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  demo: {
    width: '532px',
    height: '1000px',
    margin: '0 auto',
    position: 'relative',
    background: "url('./src/images/iphone.png') left top / 100% no-repeat"
  },
  demoViewPort: {
    width: '375px',
    height: '667px',
    backgroundColor: '#fff',
    display: 'block',
    position: 'absolute',
    left: 78,
    top: 106,
    overflow: 'hidden',
    borderRadius: 4
  },
  left: {
    position: 'absolute',
    left: -10,
    top: 360,
    width: 60,
    opacity: 0.6,
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer'
  },
  right: {
    position: 'absolute',
    left: 480,
    top: 360,
    width: 60,
    opacity: 0.6,
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer'
  },
  hover: {
    color: 'rgba(255,255,255,0.8)'
  },

  introContent: {
    flex: 1,
    paddingLeft: 30,
    paddingTop: 180,
    textAlign: 'left',
    minHeight: 600,
  },
  mainTitle: {
    fontSize: '46px',
    color: 'white',
    display: 'block',
    marginTop: 40
  },
  logo: {
    width: '126px',
    height: 'auto'
  },
  desc: {
    display: 'block',
    paddingTop: '20px',
    paddingBottom: '20px',
    lineHeight: '30px',
    color: '#ccc',
    fontSize: '16px'
  },
  btnLabel: {
    fontSize: '1.2em'
  },
  socialLink: {
    textDecoration: 'none',
    color: '#fff',
    marginTop: 50
  },
  socialLinkImg: {
    height: 30,
    verticalAlign: 'middle'
  },
  socialLinkText: {
    marginLeft: 20,
    fontSize: '16px',
    display: 'inline-block',
    lineHeight: '30px',
    verticalAlign: 'middle'
  },
  bottom: {
    position: 'absolute',
    bottom: 100,
    fontSize: 16,
    color: '#fff'
  },
  version: {
    marginTop: 40
  }
});

module.exports = MainPanel;
