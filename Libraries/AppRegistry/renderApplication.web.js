/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactRenderApplication
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import Portal from 'ReactPortal';

var AppContainer = React.createClass({

  render: function() {
    var RootComponent = this.props.rootComponent;
    var appView =
      <View
        ref="main"
        className={StyleSheet.rootClassName}
        style={styles.appContainer}>
        <RootComponent
          {...this.props.initialProps}
          rootTag={this.props.rootTag}/>
        <Portal />
      </View>;

    return appView;
  }
});

function renderApplication<D, P, S>(
  RootComponent: ReactClass<D, P, S>,
  initialProps: P,
  rootTag: any
) {

  ReactDOM.render(
    <AppContainer
      rootComponent={RootComponent}
      initialProps={initialProps}
      rootTag={rootTag} />,
    rootTag
  );
}

var styles = StyleSheet.create({
  // This is needed so the application covers the whole screen
  // and therefore the contents of the React are not clipped.
  appContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

module.exports = renderApplication;
