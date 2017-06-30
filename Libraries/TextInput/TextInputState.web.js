/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TextInputState
 * @flow
 *
 * This class is responsible for coordinating the "focused"
 * state for TextInputs. All calls relating to the keyboard
 * should be funneled through here
 */
'use strict';

var TextInputState = {

  /**
   * Returns the ID of the currently focused text field, if one exists
   * If no text field is focused it returns null
   */
  currentlyFocusedField: function(): ?Object {
    var focused = document.activeElement;
    if (!focused || focused == document.body) {
      return null;
    } else if (document.querySelector) {
      focused = document.querySelector(":focus");
    }

    if (!focused) {
      return null;
    }

    if ((focused.tagName === 'INPUT' && focused.type === 'text') ||
      (focused.tagName === 'TEXTAREA')) {
      return focused;
    }
    return null;
  },

  /**
   * @param {Object} TextInputID id of the text field to focus
   * Focuses the specified text field
   * noop if the text field was already focused
   */
  focusTextInput: function(textFieldID: ?Object) {
    if (textFieldID) {
      textFieldID.focus();
    }
  },

  /**
   * @param {Object} textFieldID id of the text field to focus
   * Unfocuses the specified text field
   * noop if it wasn't focused
   */
  blurTextInput: function(textFieldID: ?Object) {
    if (textFieldID) {
      textFieldID.blur();
    }
  }
};

module.exports = TextInputState;
