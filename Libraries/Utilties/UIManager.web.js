/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule UIManager
 */

const getRect = node => {
  const height = node.offsetHeight;
  const width = node.offsetWidth;
  let left = node.offsetLeft;
  let top = node.offsetTop;
  node = node.offsetParent;

  while (node && node.nodeType === 1 /* Node.ELEMENT_NODE */) {
    left += node.offsetLeft - node.scrollLeft;
    top += node.offsetTop - node.scrollTop;
    node = node.offsetParent;
  }
  return { height, left, top, width };
};

const UIManager = {
  measure: (ref, callback) => {
    // const rect = ref.getBoundingClientRect();
    // callback(0, 0, rect.width, rect.height, rect.left, rect.top);

    // above is origin, below is to "Let Text can measure() real height",
    // but ref.scrollLeft and ref.scrollTop always be 0 , so
    // maybe measureInWindow() is better than measure()

    callback(0, 0, ref.scrollWidth, ref.scrollHeight, ref.scrollLeft, ref.scrollTop);
  },
  measureInWindow(node, callback) {
    if (node) {
      setTimeout(() => {
        const { height, left, top, width } = getRect(node);
        callback(left, top, width, height);
      }, 0);
    }
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
