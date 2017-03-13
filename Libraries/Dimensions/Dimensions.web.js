/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactDimensions
 */
'use strict';

let dimensions = {
  // Not map to real window size, because that map to screen size in native env.
  window: {
    get width() { return document.documentElement.clientWidth; },
    get height() { return document.documentElement.clientHeight; },
    get scale() { return window.devicePixelRatio || 1; },
  },
  modalFullscreenView: {
    width: screen.width,
    height: screen.height
  }
};

class Dimensions {

  /**
   * Initial dimensions are set before `runApplication` is called so they should
   * be available before any other require's are run, but may be updated later.
   *
   * Note: Although dimensions are available immediately, they may change (e.g
   * due to device rotation) so any rendering logic or styles that depend on
   * these constants should try to call this function on every render, rather
   * than caching the value (for example, using inline styles rather than
   * setting a value in a `StyleSheet`).
   *
   * @param {string} dim Name of dimension as defined when calling `set`.
   * @returns {Object?} Value for the dimension.
   */
  static get(dim: string): Object {
    return dimensions[dim];
  }
}

export default Dimensions;
