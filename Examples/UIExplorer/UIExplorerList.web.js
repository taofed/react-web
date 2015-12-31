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
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
} = React;
var UIExplorerListBase = require('./UIExplorerListBase');

var COMPONENTS = [
  require('./ActivityIndicatorIOSExample'),
  // require('./DatePickerIOSExample'),
  require('./DrawerLayoutExample.web'),
  require('./ImageExample'),
  require('./ScrollViewExample'),
  require('./SegmentedControlIOSExample'),
  require('./SwitchIOSExample'),
  require('./Navigator/NavigatorExample'),
  require('./TextExample.ios'),
  require('./TextInputExample.ios'),
  require('./TabBarIOSExample'),
  require('./TouchableExample'),
  require('./ListViewExample'),
  require('./ListViewGridLayoutExample'),
  require('./ListViewPagingExample'),
  require('./PickerIOSExample'),
  require('./ModalExample'),
  require('./ViewExample'),
  require('./ViewPagerAndroidExample.android'),
  require('./SliderIOSExample'),
  require('./ProgressViewIOSExample'),
];

var APIS = [
  // require('./AccessibilityAndroidExample.android'),
  require('./AlertIOSExample'),
  require('./AnimatedExample'),
  require('./AsyncStorageExample'),
  require('./BorderExample'),
  require('./LayoutEventsExample'),
  require('./LayoutExample'),
  require('./PanResponderExample'),

  require('./PointerEventsExample'),
  require('./TimerExample'),
  require('./ToastAndroidExample.android'),
  // require('./XHRExample'),
];

type Props = {
  onSelectExample: Function,
  isInDrawer: bool,
};

class UIExplorerList extends React.Component {
  props: Props;

  render() {
    return (
      <UIExplorerListBase
        components={COMPONENTS}
        apis={APIS}
        searchText=""
        renderAdditionalView={this.renderAdditionalView.bind(this)}
        onPressRow={this.onPressRow.bind(this)}
      />
    );
  }

  renderAdditionalView(renderRow, renderTextInput): React.Component {
    if (this.props.isInDrawer) {
      var homePage = renderRow({
        title: 'UIExplorer',
        description: 'List of examples',
      }, -1);
      return (
        <View>
          {homePage}
        </View>
      );
    }
    return renderTextInput(styles.searchTextInput);
  }

  onPressRow(example: any) {
    var Component = UIExplorerListBase.makeRenderable(example);

    this.props.navigator.push({
      name: 'example',
      example: Component,
      title : example.title
    });

  }
}

var styles = StyleSheet.create({
  searchTextInput: {
    padding: 2,
  },
});

module.exports = UIExplorerList;
