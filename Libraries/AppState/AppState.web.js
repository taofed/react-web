/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactAppState
 * @flow
 */
'use strict';

const logError = console.error;
const invariant = require('fbjs/lib/invariant');

/**
 * `AppState` can tell you if the app is in the foreground or background,
 * and notify you when the state changes.
 *
 * AppState is frequently used to determine the intent and proper behavior when
 * handling push notifications.
 *
 * ### App States
 *
 *  - `active` - The app is running in the foreground
 *  - `background` - The app is running in the background. The user is either
 *     in another app or on the home screen
 *  - `inactive` - This is a state that occurs when transitioning between
 *     foreground & background, and during periods of inactivity such as
 *     entering the Multitasking view or in the event of an incoming call
 *
 * For more information, see
 * [Apple's documentation](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/TheAppLifeCycle/TheAppLifeCycle.html)
 *
 * ### Basic Usage
 *
 * To see the current state, you can check `AppState.currentState`, which
 * will be kept up-to-date. However, `currentState` will be null at launch
 * while `AppState` retrieves it over the bridge.
 *
 * ```
 * getInitialState: function() {
 *   return {
 *     currentAppState: AppState.currentState,
 *   };
 * },
 * componentDidMount: function() {
 *   AppState.addEventListener('change', this._handleAppStateChange);
 * },
 * componentWillUnmount: function() {
 *   AppState.removeEventListener('change', this._handleAppStateChange);
 * },
 * _handleAppStateChange: function(currentAppState) {
 *   this.setState({ currentAppState, });
 * },
 * render: function() {
 *   return (
 *     <Text>Current state is: {this.state.currentAppState}</Text>
 *   );
 * },
 * ```
 *
 * This example will only ever appear to say "Current state is: active" because
 * the app is only visible to the user when in the `active` state, and the null
 * state will happen only momentarily.
 */

class AppState {
  _handlers: Object;
  currentState: ?string;

  constructor() {
    this.currentState = 'active';
    this._handlers = {
      change: [],
      memoryWarning: []
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    var hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }

    document.addEventListener(visibilityChange, () => {
      this.currentState = document[hidden] ? 'background' : 'active';
      this._handlers.change.forEach(handler => handler(this.currentState));
    }, false);
  }

  /**
   * Add a handler to AppState changes by listening to the `change` event type
   * and providing the handler
   */
  addEventListener(
    type: string,
    handler: Function
  ) {
    invariant(
      ['change', 'memoryWarning'].indexOf(type) !== -1,
      'Trying to subscribe to unknown event: "%s"', type
    );

    if (type !== 'change') return;

    this._handlers[type].push(handler);
    return () => this.removeEventListener(type, handler);
  }

  /**
   * Remove a handler by passing the `change` event type and the handler
   */
  removeEventListener(
    type: string,
    handler: Function
  ) {
    invariant(
      ['change', 'memoryWarning'].indexOf(type) !== -1,
      'Trying to remove listener for unknown event: "%s"', type
    );

    const idx = this._handlers[type];
    if (idx !== -1) {
      this._handlers[type].splice(idx, 1);
    }
  }
}

module.exports = new AppState();
