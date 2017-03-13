/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import getVendorPropertyName from 'domkit/getVendorPropertyName';
import CSSProperty from 'CSSProperty';

var shorthandProperties = {
  margin: true,
  padding: true,
  borderWidth: true,
  borderRadius: true,
};

// some number that react not auto add px
var numberProperties = {
  lineHeight: true
};

var boxProperties = {
  paddingHorizontal: true,
  paddingVertical: true,
  marginHorizontal: true,
  marginVertical: true,
};

var borderProperties = {
  borderColor: true,
  borderWidth: true,
  borderTopColor: true,
  borderRightColor: true,
  borderBottomColor: true,
  borderLeftColor: true,
  borderTopWidth: true,
  borderRightWidth: true,
  borderBottomWidth: true,
  borderLeftWidth: true,
};

// prefix 2009 spec
var flexboxProperties = {
  flex: 'WebkitBoxFlex',
  order: 'WebkitBoxOrdinalGroup',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/flex-direction.coffee
  flexDirection: 'WebkitBoxOrient',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/align-items.coffee
  alignItems: 'WebkitBoxAlign',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/justify-content.coffee
  justifyContent: 'WebkitBoxPack',
  flexWrap: null,
  alignSelf: null,
};

var oldFlexboxValues = {
  'flex-end': 'end',
  'flex-start': 'start',
  'space-between': 'justify',
  'space-around': 'distribute',
};

var builtinStyle = document.createElement('div').style;
var flexboxSpec;
if ('alignSelf' in builtinStyle) flexboxSpec = 'final';
else if ('webkitAlignSelf' in builtinStyle) flexboxSpec = 'finalVendor';
else flexboxSpec = '2009';

// FIXME: UCBrowser is cheat
var isUCBrowser = /UCBrowser/i.test(navigator.userAgent);
// only U3 core need 2009 spec, and only this way can detect another core
var notU3 = /UCBS/i.test(navigator.userAgent);
if (isUCBrowser && !notU3) flexboxSpec = '2009';

const isIE = /Trident/i.test(navigator.userAgent);
const FLEX_AUTO = '1 1 auto';
const FLEX_INITIAL = '0 1 auto';

// TODO: cache the result
function prefixOldFlexbox(property, value, result) {

  if (flexboxSpec === '2009') {
    var oldValue = oldFlexboxValues[value] || value;
    var oldProperty = flexboxProperties[property] || property;
    if (oldProperty === 'WebkitBoxOrient') {
      // boxOrient
      if (value.indexOf('row') != -1) {
        oldValue = 'horizontal';
      } else {
        oldValue = 'vertical';
      }
      // boxDirection
      var dir = '';
      if (value.indexOf('reverse') != -1) {
        dir = 'reverse';
      } else {
        dir = 'normal';
      }
      result.WebkitBoxDirection = dir;
    }
    return result[oldProperty] = oldValue;

  } else if (flexboxSpec === 'finalVendor') {
    return result[getVendorPropertyName(property)] = value;

  } else {
    return result[property] = value;

  }
}

function defaultFlexExpansion(style, result) {
  const grow = style.flex || 0;
  const shrink = style.flexShrink || 1;
  const basis = style.flexBasis || 'auto';
  let flex;

  if (grow === 'auto') {
    flex = FLEX_AUTO;
  } else if (grow === 'initial') {
    flex = FLEX_INITIAL;
  } else if (isNaN(grow)) {
    flex = grow;
  } else {
    flex = `${grow} ${shrink} ${basis}`;
  }

  result.flex = flex;
}

function extendBoxProperties(property, value, result) {
  var padding = 'padding';
  var margin = 'margin';
  var horizontal = 'Horizontal';
  var vertical = 'Vertical';
  var type = property.indexOf(margin) == 0 ? margin : padding;
  var directionType = property.indexOf(vertical) !== -1 ? vertical : horizontal;

  if (directionType == horizontal) {
    result[type + 'Left'] = result[type + 'Right'] = value;
  } else if (directionType == vertical) {
    result[type + 'Top'] = result[type + 'Bottom'] = value;
  }
}

function isValidValue(value) {
  return value !== '' && value !== null && value !== undefined;
}

function processValueForProp(value, prop) {

  if (typeof value == 'number') {
    // transform less then 1px value to 1px, 0.5 to be 1
    if (!CSSProperty.isUnitlessNumber[prop] && value > 0 && value < 1) {
      value = 1;
    }

    // Add px to numeric values
    if (numberProperties[prop] && typeof value == 'number') {
      value += 'px';
    }
  }

  // [
  //   {scaleX: 2},
  //   {scaleY: 2}
  // ] => scaleX(2) scaleY(2)

  if (shorthandProperties[prop] && typeof value == 'string') {
    value = value.replace(/\d*\.?\d+(rem|em|in|cm|mm|pt|pc|px|vh|vw|vmin|vmax|%)*/g, function(val, unit) {
      return unit ? val : val + 'px';
    });
  }

  return value;
}

function defaultBorderStyle(style, result) {
  if (!style.borderStyle && !result.borderStyle) {
    result.borderStyle = 'solid';
  }

  if (!style.borderWidth && !result.borderWidth) {
    result.borderWidth = 0;
  }

  if (!style.borderColor && !result.borderColor) {
    result.borderColor = 'black';
  }
}

function extendProperties(style) {
  var result = {};

  for (var property in style) {
    var value = style[property];
    if (!isValidValue(value)) {
      continue;
    }
    // set a default border style if there has border about property
    if (borderProperties[property]) {
      defaultBorderStyle(style, result);
    }

    if (boxProperties[property]) {
      extendBoxProperties(property, value, result);
    } else if (flexboxProperties[property]) {
      prefixOldFlexbox(property, value, result);
      // https://roland.codes/blog/ie-flex-collapse-bug/
      if (property === 'flex' && isIE) {
        defaultFlexExpansion(style, result);
      }
    } else {
      value = processValueForProp(value, property);
      property = getVendorPropertyName(property);
      result[property] = value;
    }
  }

  return result;
}

module.exports = extendProperties;
