/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactImage
 */
'use strict';

import React from 'react';
import View from 'ReactView';
import { Mixin as LayoutMixin } from 'ReactLayoutMixin';
import ImageResizeMode from './ImageResizeMode';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';

var Image = React.createClass({
  statics: {
    resizeMode: ImageResizeMode,
  },

  mixins: [LayoutMixin, NativeMethodsMixin],

  contextTypes: {
    isInAParentText: React.PropTypes.bool
  },
  render: function() {

    var props = {...this.props};
    props.src = typeof props.source === 'string' ? props.source : props.source.uri;

    // TODO: lazyload image when not in viewport

    var resizeMode = this.props.resizeMode;

    // Background image element, resizeMode is strtch is equal default img style
    if ( (this.props.children || (resizeMode && resizeMode !== 'stretch')) && !this.context.isInAParentText) {
      var containerStyles = props.style ? props.style : {};
      containerStyles.backgroundImage = 'url("' + props.src + '")';
      containerStyles.backgroundSize = resizeMode || 'cover';
      containerStyles.backgroundRepeat = 'no-repeat';
      containerStyles.backgroundPosition = '50%';

      return (
        <View style={containerStyles} data-src={props.src}>
          {this.props.children}
        </View>
      );
    } else {
      return (
        <img {...props}/>
      );
    }
  }
});

module.exports = Image;
