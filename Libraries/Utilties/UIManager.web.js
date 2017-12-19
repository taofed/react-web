/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule UIManager
 */

const UIManager = {
  measure: (ref, callback) => {
    callback(0, 0, ref.scrollWidth, ref.scrollHeight, ref.scrollLeft, ref.scrollTop);
  },
  measureLayout: (ref, relativeTo, errorCallback, callback) => {
    const rect = ref.getBoundingClientRect();
    const relativeRef = relativeTo.getBoundingClientRect();
    callback(
      rect.left - relativeRef.left,
      rect.top - relativeRef.top,
      rect.width,
      rect.height);
  }
};

module.exports = UIManager;
