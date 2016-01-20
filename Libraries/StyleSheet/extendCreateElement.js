/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function extendCreateElement(React, processor) {
  var originalCreateElement = React.createElement;
  React.createElement = function(type, props) {
    var args = arguments;

    if (type && type.displayName !== 'AnimatedComponent' && props && props.style && (Array.isArray(props.style) || typeof props.style === 'object')) {
      var style = processor(props.style);
      // should copy it, props is read only
      var target = {};
      for (var key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          target[key] = props[key];
        }
      }
      target.style = style;
      props = target;
    }

    return originalCreateElement.apply(this, [type, props].concat(Array.prototype.slice.call(args, 2)));
  };
}

module.exports = extendCreateElement;
