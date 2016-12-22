/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactRenderApplication
 */
'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import Portal from 'ReactPortal';

class AppContainer extends Component {

  render() {
    let RootComponent = this.props.rootComponent;
    let appView =
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
}

function renderApplication(
  RootComponent,
  initialProps,
  rootTag
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

export default renderApplication;
