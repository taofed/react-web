/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 */
'use strict';

const DEFAULT_BUTTON_TEXT = 'OK';
const DEFAULT_BUTTON = {
  text: DEFAULT_BUTTON_TEXT,
  onPress: null,
};

const noop = function() {};

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button
 *
 * The last button in the list will be considered the 'Primary' button and
 * it will appear bold.
 *
 * ```
 * AlertIOS.alert(
 *   'Foo Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
 *     {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
 *   ]
 * )
 * ```
 */

class AlertIOS {
  static alert(
    title: ?string,
    message?: ?string,
    buttons?: Array<{
      text: ?string;
      onPress?: ?Function;
    }>,
    type?: ?string
  ): void {
    let callbacks = [];
    let buttonsSpec = [];
    title = title || '';
    message = message || '';
    buttons = buttons || [DEFAULT_BUTTON];
    type = type || '';

    buttons.forEach((btn, index) => {
      callbacks[index] = btn.onPress;
      let btnDef = {};
      btnDef[index] = btn.text || DEFAULT_BUTTON_TEXT;
      buttonsSpec.push(btnDef);
    });

    const confirmCallback = callbacks.pop() || noop;
    const cancelCallback = callbacks.pop() || noop;
    if (buttons.length === 1) {
      alert(title);
      confirmCallback();
    } else if (buttons.length === 2) {
      if (confirm(title)) {
        confirmCallback();
      } else {
        cancelCallback();
      }
    } else {
      throw new Error('max two buttons supported: [negativeActionBtn, positiveActionBtn]');
    }
  }

  static prompt(
    title: string,
    value?: string,
    buttons?: Array<{
      text: ?string;
      onPress?: ?Function;
    }>,
    callback?: ?Function
  ): void {
    if (arguments.length === 2) {
      if (typeof value === 'object') {
        buttons = value;
        value = undefined;
      } else if (typeof value === 'function') {
        callback = value;
        value = undefined;
      }
    } else if (arguments.length === 3 && typeof buttons === 'function') {
      callback = buttons;
      buttons = undefined;
    }

    if (!buttons) {
      buttons = [{
        text: 'Cancel',
      }, {
        text: 'OK',
        onPress: callback
      }];
    }

    let ret = prompt(title);
    if (ret && callback) {
      callback();
    }
  }
}

export default AlertIOS;
