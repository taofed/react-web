/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStyleSheet
 */
'use strict';

import extendProperties from './extendProperties.web';
import reference from './reference';
import setDefaultStyle from './setDefaultStyle.web';
// Make React support array of style object like React Native
import extendCreateElement from './extendCreateElement';
import flattenStyle from './flattenStyle.web';

var inited = false;

const ROOT_CLASS_NAME = 'react-root';
const VIEW_CLASS_NAME = 'react-view';

var StyleSheet = {
  hairlineWidth: 1,
  create: function(styles) {
    return styles;
  },
  extendCreateElement: function(React, nativeComponents) {
    extendCreateElement(React, function(style) {
      if (!inited) {
        inited = true;
        setDefaultStyle({
          reference: reference.getWidth(),
          rootClassName: ROOT_CLASS_NAME,
          viewClassName: VIEW_CLASS_NAME,
        });
      }

      return flattenStyle(style, extendProperties);
    }, nativeComponents);
  },
  setReferenceWidth: reference.setWidth,
  rootClassName: ROOT_CLASS_NAME,
  viewClassName: VIEW_CLASS_NAME,
  flatten: flattenStyle
};

module.exports = StyleSheet;
