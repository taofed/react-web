/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactAnimated
 * @flow
 */
'use strict';

import AnimatedImplementation from './AnimatedImplementation';
import Image from 'ReactImage';
import Text from 'ReactText';
import View from 'ReactView';

module.exports = {
  ...AnimatedImplementation,
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
};
