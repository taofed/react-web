/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');

function convertTransform(style) {
  var result = {};

  for (var k in style) {
    if (k === 'transformMatrix') {
      result.transform = ( 'matrix3d(' + style[k].join(',') + ') ' );
    } else {
      result[k] = style[k];
    }
  }

  return result;
}

function setNativeProps(node, props, component) {

  for (var name in props) {
    if (name === 'style') {
      var style = props[name];
      if ('transformMatrix' in style) {
        style = convertTransform(style);
      }

      CSSPropertyOperations.setValueForStyles(node, style, component);
    } else {
      node.setAttribute(name, props[name]);
    }
  }
}

module.exports = setNativeProps;
