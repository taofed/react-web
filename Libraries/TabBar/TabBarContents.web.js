/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import React from 'react';
import View from 'ReactView';

let TabBarContents = React.createClass({

  getInitialState: function() {
    return {
      hasBeenSelected: false
    };
  },

  componentWillMount: function() {
    if (this.props.selected) {
      this.setState({
        hasBeenSelected: true
      });
    }
  },

  componentWillReceiveProps: function(nextProps: {
    selected ?: boolean
  }) {
    if (this.state.hasBeenSelected || nextProps.selected) {
      this.setState({
        hasBeenSelected: true
      });
    }
  },

  render() {
    let styles = {
      'display': 'none',
      'width': '100%',
      'height': '100%',
      'position': 'relative'
    };

    if (this.props.selected) {
      delete styles.display;
    }

    var tabContents = null;

    // if the tab has already been shown once, always continue to show it so we
    // preserve state between tab transitions
    if (this.state.hasBeenSelected) {
      tabContents = <View style={styles}>
        {this.props.children}
      </View>;
    }

    return (tabContents);
  }
});

module.exports = TabBarContents;
