/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import React from 'react';
import Portal from './Portal.web';
import {Text, StyleSheet} from 'react-native-web';

const LONG_DELAY = 3500; // 3.5 seconds
const SHORT_DELAY = 2000; // 2 seconds

let Toast = {

  SHORT: SHORT_DELAY,
  LONG: LONG_DELAY,

  show: function(message, duration) {
    Portal.showModal('toast', <Text style={styles.container}>{message}</Text>);
    setTimeout(()=>Portal.closeModal('toast'), duration);
  },
};

let styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.65)',
    color: '#ffffff',
    padding: '5 12',
    position: 'absolute',
    left: '50%',
    bottom: 20,
    fontSize: 14,
    lineHeight: 18,
    borderRadius: 2,
    transform: 'translateX(-50%)'
  },
});

export default Toast;
