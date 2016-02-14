/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactProgressView
 */
'use strict';

import React from 'react';
import View from 'ReactView';
import StyleSheet from 'ReactStyleSheet';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';

var ProgressView = React.createClass({
  mixins: [NativeMethodsMixin],
  render: function() {

    var specificStyle = {
      progressTint: {},
      progressTrack: {},
    };

    if ( this.props.trackImage ) {
      specificStyle.progressTrack.background = 'url(' + this.props.trackImage.uri + ') no-repeat 0 0';
      specificStyle.progressTrack.backgroundSize = '100% 100%';
    }

    if ( this.props.trackTintColor ) {
      specificStyle.progressTrack.background = this.props.trackTintColor;
    }

    if ( this.props.progressViewStyle == 'bar' ) {
      specificStyle.progressTrack.background = 'transparent';
    }

    if ( this.props.progressImage ) {
      specificStyle.progressTint.background = 'url(' + this.props.progressImage.uri + ') no-repeat 0 0';
      specificStyle.progressTint.backgroundSize = '100% 100%';
    }

    if ( this.props.progressTintColor ) {
      specificStyle.progressTint.background = this.props.progressTintColor;
    }

    // process progress
    var progress = this.props.progress;
    if ( progress >= 1 ) {
      progress = 1;
    } else if ( progress <= 0 ) {
      progress = 0;
    }

    specificStyle.progressTint.width = 100 * progress + '%';

    specificStyle = StyleSheet.create(specificStyle);

    return (
      <View style={[styles.progressView, this.props.style]}>
        <View style={[styles.progressTrack, specificStyle.progressTrack]}>
          <View style={[styles.progressTint, specificStyle.progressTint]} />
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  progressView: {
    display: 'block',
    height: '2px',
    width: '100%',
  },
  progressTint: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: '100%',
    background: '#0079fe',
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#b4b4b4',
  }
});

module.exports = ProgressView;
