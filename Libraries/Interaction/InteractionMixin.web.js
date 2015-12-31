/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule ReactInteractionMixin
 * @flow
 */
'use strict';

/**
 * This mixin provides safe versions of InteractionManager start/end methods
 * that ensures `clearInteractionHandle` is always called
 * once per start, even if the component is unmounted.
 */
var InteractionMixin = {
  componentWillUnmount: function() {
  },

  _interactionMixinHandles: ([]: Array<number>),

  createInteractionHandle: function() {
  },

  clearInteractionHandle: function(clearHandle: number) {
  },

  /**
   * Schedule work for after all interactions have completed.
   *
   * @param {function} callback
   */
  runAfterInteractions: function(callback: Function) {
  },
};

module.exports = InteractionMixin;
