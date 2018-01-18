/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 */
'use strict';

const PropTypes = require('prop-types');

/* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses an error
 * found when Flow v0.54 was deployed. To see the error delete this comment and
 * run Flow. */
const keyMirror = require('fbjs/lib/keyMirror');

const {checkPropTypes} = PropTypes;

const TypesEnum = {
  spring: true,
  linear: true,
  easeInEaseOut: true,
  easeIn: true,
  easeOut: true,
  keyboard: true,
};
const Types = keyMirror(TypesEnum);

const PropertiesEnum = {
  opacity: true,
  scaleXY: true,
};
const Properties = keyMirror(PropertiesEnum);

const animType = PropTypes.shape({
  duration: PropTypes.number,
  delay: PropTypes.number,
  springDamping: PropTypes.number,
  initialVelocity: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(Types)).isRequired,
  property: PropTypes.oneOf(
    // Only applies to create/delete
    Object.keys(Properties),
  ),
});

const configType = PropTypes.shape({
  duration: PropTypes.number.isRequired,
  create: animType,
  update: animType,
  delete: animType,
});

function checkConfig(config, location, name) {
  checkPropTypes({config: configType}, {config}, location, name);
}

function configureNext(config, onAnimationDidEnd) {
  // Noop
  // if (__DEV__) {
  //   checkConfig(config, 'config', 'LayoutAnimation.configureNext');
  // }
  // UIManager.configureNextLayoutAnimation(
  //   config,
  //   onAnimationDidEnd || function() {},
  //   function() {
  //     /* unused */
  //   },
  // );
}

function create(duration, type, creationProp) {
  return {
    duration,
    create: {
      type,
      property: creationProp,
    },
    update: {
      type,
    },
    delete: {
      type,
      property: creationProp,
    },
  };
}

const Presets = {
  easeInEaseOut: create(300, Types.easeInEaseOut, Properties.opacity),
  linear: create(500, Types.linear, Properties.opacity),
  spring: {
    duration: 700,
    create: {
      type: Types.linear,
      property: Properties.opacity,
    },
    update: {
      type: Types.spring,
      springDamping: 0.4,
    },
    delete: {
      type: Types.linear,
      property: Properties.opacity,
    },
  },
};

const LayoutAnimation = {
  configureNext,
  create,
  Types,
  Properties,
  checkConfig,
  Presets,
  easeInEaseOut: configureNext.bind(null, Presets.easeInEaseOut),
  linear: configureNext.bind(null, Presets.linear),
  spring: configureNext.bind(null, Presets.spring),
};

export default LayoutAnimation;
