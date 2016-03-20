/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @flow
 */
'use strict';

import keyMirror from 'fbjs/lib/keyMirror';

/**
 * ImageResizeMode - Enum for different image resizing modes, set via
 * `resizeMode` style property on `<Image>` components.
 */
let ImageResizeMode = keyMirror({
  /**
   * contain - The image will be resized such that it will be completely
   * visible, contained within the frame of the View.
   */
  contain: null,
  /**
   * cover - The image will be resized such that the entire area of the view
   * is covered by the image, potentially clipping parts of the image.
   */
  cover: null,
  /**
   * stretch - The image will be stretched to fill the entire frame of the
   * view without clipping. This may change the aspect ratio of the image,
   * distoring it.
   */
  stretch: null,
});

module.exports = ImageResizeMode;
