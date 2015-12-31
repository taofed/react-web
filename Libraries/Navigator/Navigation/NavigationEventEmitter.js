/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigationEventEmitter
 * @flow
 */
'use strict';

import EventEmitter from 'EventEmitter';
import NavigationEvent from 'ReactNavigationEvent';

type ExtraInfo = {
  defaultPrevented: ?boolean,
  eventPhase: ?number,
  propagationStopped: ?boolean,
  target: ?Object,
};

class NavigationEventEmitter extends EventEmitter {
  _emitQueue: Array<any>;
  _emitting: boolean;
  _target: Object;

  constructor(target: Object) {
    super();
    this._emitting = false;
    this._emitQueue = [];
    this._target = target;
  }

  emit(
    eventType: string,
    data: any,
    didEmitCallback: ?Function,
    extraInfo: ?ExtraInfo
  ): void {
    if (this._emitting) {
      // An event cycle that was previously created hasn't finished yet.
      // Put this event cycle into the queue and will finish them later.
      var args: any = Array.prototype.slice.call(arguments);
      this._emitQueue.unshift(args);
      return;
    }

    this._emitting = true;

    var event = NavigationEvent.pool(eventType, this._target, data);

    if (extraInfo) {
      if (extraInfo.target) {
        event.target = extraInfo.target;
      }

      if (extraInfo.eventPhase) {
        event.eventPhase = extraInfo.eventPhase;
      }

      if (extraInfo.defaultPrevented) {
        event.preventDefault();
      }

      if (extraInfo.propagationStopped) {
        event.stopPropagation();
      }
    }

    // EventEmitter#emit only takes `eventType` as `String`. Casting `eventType`
    // to `String` to make @flow happy.
    super.emit(String(eventType), event);

    if (typeof didEmitCallback === 'function') {
      didEmitCallback.call(this._target, event);
    }
    event.dispose();

    this._emitting = false;

    while (this._emitQueue.length) {
      var args: any = this._emitQueue.shift();
      this.emit.apply(this, args);
    }
  }
}

module.exports = NavigationEventEmitter;
