/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';

var React = require('react-native');
var {
  Navigator,
  PixelRatio,
  StyleSheet,
  ScrollView,
  TabBarIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

var _getRandomRoute = function() {
  return {
    randNumber: Math.ceil(Math.random() * 1000),
  };
};

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var ROUTE_STACK = [
  _getRandomRoute(),
  _getRandomRoute(),
  _getRandomRoute(),
];
var INIT_ROUTE_INDEX = 1;

class JumpingNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: props.initTabIndex,
    };
  }
  handleWillFocus(route) {
    var tabIndex = ROUTE_STACK.indexOf(route);
    this.setState({ tabIndex, });
  }
  render() {
    return (
      <View style={styles.tabs}>
        <TabBarIOS>
          <TabBarIOS.Item
            icon={{uri: base64Icon, scale: 3}}
            selected={this.state.tabIndex === 0}
            onPress={() => {
              this.props.onTabIndex(0);
              this.setState({ tabIndex: 0, });
            }}>
            <View />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={{uri: base64Icon, scale: 3}}
            selected={this.state.tabIndex === 1}
            onPress={() => {
              this.props.onTabIndex(1);
              this.setState({ tabIndex: 1, });
            }}>
            <View />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={{uri: base64Icon, scale: 3}}
            selected={this.state.tabIndex === 2}
            onPress={() => {
              this.props.onTabIndex(2);
              this.setState({ tabIndex: 2, });
            }}>
            <View />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
}

var JumpingNavSample = React.createClass({
  render: function() {
    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        ref={(navigator) => {
          this._navigator = navigator;
        }}
        initialRoute={ROUTE_STACK[INIT_ROUTE_INDEX]}
        initialRouteStack={ROUTE_STACK}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.HorizontalSwipeJump,
        })}
        navigationBar={
          <JumpingNavBar
            ref={(navBar) => { this.navBar = navBar; }}
            initTabIndex={INIT_ROUTE_INDEX}
            routeStack={ROUTE_STACK}
            onTabIndex={(index) => {
              this._navigator.jumpTo(ROUTE_STACK[index]);
            }}
          />
        }
      />
    );
  },

  renderScene: function(route, navigator) {
    var backBtn;
    var forwardBtn;
    if (ROUTE_STACK.indexOf(route) !== 0) {
      backBtn = (
        <NavButton
          onPress={() => {
            navigator.jumpBack();
          }}
          text="jumpBack"
        />
      );
    }
    if (ROUTE_STACK.indexOf(route) !== ROUTE_STACK.length - 1) {
      forwardBtn = (
        <NavButton
          onPress={() => {
            navigator.jumpForward();
          }}
          text="jumpForward"
        />
      );
    }
    return (
      <ScrollView style={styles.scene}>
        <Text style={styles.messageText}>#{route.randNumber}</Text>
        {backBtn}
        {forwardBtn}
        <NavButton
          onPress={() => {
            navigator.jumpTo(ROUTE_STACK[1]);
          }}
          text="jumpTo middle route"
        />
        <NavButton
          onPress={() => {
            this.props.navigator.pop();
          }}
          text="Exit Navigation Example"
        />
        <NavButton
          onPress={() => {
            this.props.navigator.push({
              message: 'Came from jumping example',
            });
          }}
          text="Nav Menu"
        />
      </ScrollView>
    );
  },
});

var styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  appContainer: {
    overflow: 'hidden',
    backgroundColor: '#dddddd',
    flex: 1,
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  tabs: {
    height: 50,
  }
});

module.exports = JumpingNavSample;
