/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigationContext
 */
'use strict';

import NavigationEvent from 'ReactNavigationEvent';
import NavigationEventEmitter from 'ReactNavigationEventEmitter';
import NavigationTreeNode from 'ReactNavigationTreeNode';
import emptyFunction from 'fbjs/lib/emptyFunction';
import invariant from 'fbjs/lib/invariant';

import type * as EventSubscription from 'EventSubscription';

var {
  AT_TARGET,
  BUBBLING_PHASE,
  CAPTURING_PHASE,
} = NavigationEvent;

/**
 * Class that contains the info and methods for app navigation.
 */
class NavigationContext {
  __node: NavigationTreeNode;
  _bubbleEventEmitter: ?NavigationEventEmitter;
  _captureEventEmitter: ?NavigationEventEmitter;
  _currentRoute: any;
  _emitCounter: number;
  _emitQueue: Array<any>;

  constructor() {
    this._bubbleEventEmitter = new NavigationEventEmitter(this);
    this._captureEventEmitter = new NavigationEventEmitter(this);
    this._currentRoute = null;

    // Sets the protected property `__node`.
    this.__node = new NavigationTreeNode(this);

    this._emitCounter = 0;
    this._emitQueue = [];

    this.addListener('willfocus', this._onFocus, this);
    this.addListener('didfocus', this._onFocus, this);
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get parent(): ?NavigationContext {
    var parent = this.__node.getParent();
    return parent ? parent.getValue() : null;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get currentRoute(): any {
    return this._currentRoute;
  }

  appendChild(childContext: NavigationContext): void {
    this.__node.appendChild(childContext.__node);
  }

  addListener(
    eventType: string,
    listener: Function,
    context: ?Object,
    useCapture: ?boolean
  ): EventSubscription {
    var emitter = useCapture ?
      this._captureEventEmitter :
      this._bubbleEventEmitter;
    if (emitter) {
      return emitter.addListener(eventType, listener, context);
    } else {
      return {remove: emptyFunction};
    }
  }

  emit(eventType: String, data: any, didEmitCallback: ?Function): void {
    if (this._emitCounter > 0) {
      // An event cycle that was previously created hasn't finished yet.
      // Put this event cycle into the queue and will finish them later.
      var args: any = Array.prototype.slice.call(arguments);
      this._emitQueue.push(args);
      return;
    }

    this._emitCounter++;

    var targets = [this];
    var parentTarget = this.parent;
    while (parentTarget) {
      targets.unshift(parentTarget);
      parentTarget = parentTarget.parent;
    }

    var propagationStopped = false;
    var defaultPrevented = false;
    var callback = (event) => {
      propagationStopped = propagationStopped || event.isPropagationStopped();
      defaultPrevented = defaultPrevented || event.defaultPrevented;
    };

    // capture phase
    targets.some((currentTarget) => {
      if (propagationStopped) {
        return true;
      }

      var extraInfo = {
        defaultPrevented,
        eventPhase: CAPTURING_PHASE,
        propagationStopped,
        target: this,
      };

      currentTarget.__emit(eventType, data, callback, extraInfo);
    }, this);

    // bubble phase
    targets.reverse().some((currentTarget) => {
      if (propagationStopped) {
        return true;
      }
      var extraInfo = {
        defaultPrevented,
        eventPhase: BUBBLING_PHASE,
        propagationStopped,
        target: this,
      };
      currentTarget.__emit(eventType, data, callback, extraInfo);
    }, this);

    if (didEmitCallback) {
      var event = NavigationEvent.pool(eventType, this, data);
      propagationStopped && event.stopPropagation();
      defaultPrevented && event.preventDefault();
      didEmitCallback.call(this, event);
      event.dispose();
    }

    this._emitCounter--;
    while (this._emitQueue.length) {
      var args: any = this._emitQueue.shift();
      this.emit.apply(this, args);
    }
  }

  dispose(): void {
    // clean up everything.
    this._bubbleEventEmitter && this._bubbleEventEmitter.removeAllListeners();
    this._captureEventEmitter && this._captureEventEmitter.removeAllListeners();
    this._bubbleEventEmitter = null;
    this._captureEventEmitter = null;
    this._currentRoute = null;
  }

  // This method `__method` is protected.
  __emit(
    eventType: String,
    data: any,
    didEmitCallback: ?Function,
    extraInfo: Object,
  ): void {
    var emitter;
    switch (extraInfo.eventPhase) {
      case CAPTURING_PHASE: // phase = 1
        emitter = this._captureEventEmitter;
        break;
      case BUBBLING_PHASE: // phase = 3
        emitter = this._bubbleEventEmitter;
        break;
      default:
        invariant(false, 'invalid event phase %s', extraInfo.eventPhase);
    }

    if (extraInfo.target === this) {
      // phase = 2
      extraInfo.eventPhase = AT_TARGET;
    }

    if (emitter) {
      emitter.emit(
        eventType,
        data,
        didEmitCallback,
        extraInfo
      );
    }
  }

  _onFocus(event: NavigationEvent): void {
    invariant(
      event.data && event.data.hasOwnProperty('route'),
      'didfocus event should provide route'
    );
    this._currentRoute = event.data.route;
  }
}

module.exports = NavigationContext;
