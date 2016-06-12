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
import mixin from 'react-mixin';

class Image extends React.Component {
  static resizeMode = ImageResizeMode

  static contextTypes = {
    isInAParentText: React.PropTypes.bool
  }

  render() {

    let props = {...this.props};
    props.src = typeof props.source === 'string' ? props.source : props.source.uri;

    // TODO: lazyload image when not in viewport

    let resizeMode = this.props.resizeMode;

    // Background image element, resizeMode is strtch is equal default img style
    if ( (this.props.children || (resizeMode && resizeMode !== 'stretch')) && !this.context.isInAParentText) {
      let containerStyles = props.style ? props.style : {};
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
}

mixin.onClass(Image, LayoutMixin);
mixin.onClass(Image, NativeMethodsMixin);

Image.isReactNativeComponent = true;

export default Image;
