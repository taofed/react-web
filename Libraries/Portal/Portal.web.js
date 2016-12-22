/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactPortal
 * @flow
 */
'use strict';

import React, {Component} from 'react';
import Platform from 'ReactPlatform';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import autobind from 'autobind-decorator';

var _portalRef: any;

// Unique identifiers for modals.
var lastUsedTag = 0;

/*
 * Note: Only intended for Android at the moment.  Just use Modal in your iOS
 * code.
 *
 * A container that renders all the modals on top of everything else in the application.
 *
 * Portal makes it possible for application code to pass modal views all the way up to
 * the root element created in `renderApplication`.
 *
 * Never use `<Portal>` in your code. There is only one Portal instance rendered
 * by the top-level `renderApplication`.
 */
class Portal extends Component {
  /**
   * Use this to create a new unique tag for your component that renders
   * modals. A good place to allocate a tag is in `componentWillMount`
   * of your component.
   * See `showModal` and `closeModal`.
   */
  static allocateTag(): string {
    return '__modal_' + (++lastUsedTag);
  }

  /**
   * Render a new modal.
   * @param tag A unique tag identifying the React component to render.
   * This tag can be later used in `closeModal`.
   * @param component A React component to be rendered.
   */
  static showModal(tag: string, component: any) {
    if (!_portalRef) {
      console.error('Calling showModal but no Portal has been rendered.');
      return;
    }
    _portalRef._showModal(tag, component);
  }

  /**
   * Remove a modal from the collection of modals to be rendered.
   * @param tag A unique tag identifying the React component to remove.
   * Must exactly match the tag previously passed to `showModal`.
   */
  static closeModal(tag: string) {
    if (!_portalRef) {
      console.error('Calling closeModal but no Portal has been rendered.');
      return;
    }
    _portalRef._closeModal(tag);
  }

  /**
   * Get an array of all the open modals, as identified by their tag string.
   */
  static getOpenModals(): Array<string> {
    if (!_portalRef) {
      console.error('Calling getOpenModals but no Portal has been rendered.');
      return [];
    }
    return _portalRef._getOpenModals();
  }

  state = {modals: {}}

  _showModal(tag: string, component: any) {
    // We are about to open first modal, so Portal will appear.
    // Let's disable accessibility for background view on Android.
    if (this._getOpenModals().length === 0 && this.props.onModalVisibilityChanged) {
      this.props.onModalVisibilityChanged(true);
    }
    // This way state is chained through multiple calls to
    // _showModal, _closeModal correctly.
    this.setState((state) => {
      var modals = state.modals;
      modals[tag] = component;
      return {modals};
    });
  }

  _closeModal(tag: string) {
    if (!this.state.modals.hasOwnProperty(tag)) {
      return;
    }
    // We are about to close last modal, so Portal will disappear.
    // Let's enable accessibility for application view on Android.
    if (this._getOpenModals().length === 1 && this.props.onModalVisibilityChanged) {
      this.props.onModalVisibilityChanged(false);
    }
    // This way state is chained through multiple calls to
    // _showModal, _closeModal correctly.
    this.setState((state) => {
      var modals = state.modals;
      delete modals[tag];
      return {modals};
    });
  }

  _getOpenModals(): Array<string> {
    return Object.keys(this.state.modals);
  }

  render() {
    _portalRef = this;
    if (!this.state.modals) {
      return null;
    }
    var modals = [];
    for (var tag in this.state.modals) {
      modals.push(this.state.modals[tag]);
    }
    if (modals.length === 0) {
      return null;
    }
    return (
      <View
        style={styles.modalsContainer}>
        {modals}
      </View>
    );
  }

};

var styles = StyleSheet.create({
  modalsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

Portal.isReactNativeComponent = true;

autobind(Portal);

export default Portal;
