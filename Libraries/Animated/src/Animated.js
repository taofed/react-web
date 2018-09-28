/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactAnimated
 * @flow
 */
'use strict';


var AnimatedImplementation = require('AnimatedImplementation');
import Image from 'ReactImage';
import Text from 'ReactText';
import View from 'ReactView';

let AnimatedScrollView;

const Animated = {
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
  get ScrollView() {
    // Make this lazy to avoid circular reference.
    if (!AnimatedScrollView) {
      AnimatedScrollView = AnimatedImplementation.createAnimatedComponent(require('ReactScrollView'));
    }
    return AnimatedScrollView;
  },
};

Object.assign((Animated: Object), AnimatedImplementation);

module.exports = ((Animated: any): (typeof AnimatedImplementation) & typeof Animated);
