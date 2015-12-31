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
 * @providesModule createExamplePage
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Platform,
} = React;
var UIExplorerBlock = require('./UIExplorerBlock');
var UIExplorerPage = require('./UIExplorerPage');

import type { Example, ExampleModule } from 'ExampleTypes';

var createExamplePage = function(title: ?string, exampleModule: ExampleModule)
  : ReactClass<any, any, any> {

  var ExamplePage = React.createClass({
    statics: {
      title: exampleModule.title,
      description: exampleModule.description,
    },

    getBlock: function(example: Example, i) {
      if (example.platform) {
        if (Platform.OS !== example.platform) {
          return;
        }
        example.title += ' (' + example.platform + ' only)';
      }

      var result = example.render(null);
      if (result) {
        var renderedComponent = React.cloneElement(result, {
          navigator: this.props.navigator,
        });
      }

      return (
        <UIExplorerBlock
          key={i}
          title={example.title}
          description={example.description}>
          {renderedComponent}
        </UIExplorerBlock>
      );
    },

    render: function() {
      return (
        <UIExplorerPage>
          {exampleModule.examples.map(this.getBlock)}
        </UIExplorerPage>
      );
    }
  });

  return ExamplePage;
};

module.exports = createExamplePage;
