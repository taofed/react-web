/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactModal
 */
'use strict';

import React, { PropTypes, Component } from 'react';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';

class Modal extends Component {
  render(): ?ReactElement {
    if (this.props.visible === false) {
      if (this.shown) {
        this.props.onDismiss && this.props.onDismiss();
      }
      this.shown = false;
      return null;
    }

    this.shown = true;

    if (this.props.transparent) {
      var modalBackgroundColor = {backgroundColor: 'transparent'};
    }

    return (
      <View style={[styles.modal, modalBackgroundColor]}>
        <View style={[styles.container]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

Modal.propTypes = {
  animated: PropTypes.bool,
  transparent: PropTypes.bool,
  onDismiss: PropTypes.func,
};

let styles = StyleSheet.create({
  modal: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#fff',
    zIndex: 9999
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }
});

Modal.isReactNativeComponent = true;

export default Modal;
