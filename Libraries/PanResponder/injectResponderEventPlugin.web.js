/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import EventPluginRegistry from 'react-dom/lib/EventPluginRegistry';
import ResponderEventPlugin from 'react-dom/lib/ResponderEventPlugin';
import ResponderTouchHistoryStore from 'react-dom/lib/ResponderTouchHistoryStore';


let eventTypes = ResponderEventPlugin.eventTypes;
eventTypes.startShouldSetResponder.dependencies = [
  'topTouchStart',
];

eventTypes.scrollShouldSetResponder.dependencies = [
  'topScroll',
];

eventTypes.selectionChangeShouldSetResponder.dependencies = [
  'topSelectionChange',
];

eventTypes.moveShouldSetResponder.dependencies = [
  'topTouchMove',
];

['responderStart', 'responderMove', 'responderEnd', 'responderRelease',
'responderTerminationRequest', 'responderGrant', 'responderReject', 'responderTerminate'].forEach((type) => {
  let dependencies;
  if ('ontouchstart' in window) {
    dependencies = [
      'topTouchStart',
      'topTouchCancel',
      'topTouchEnd',
      'topTouchMove'
    ];
  } else {
    // TODO: support move event
    dependencies = [
      'topMouseDown',
      'topMouseUp'
    ];
  }

  eventTypes[type].dependencies = dependencies;
});

function toArray(collection) {
  return collection && Array.prototype.slice.call(collection) || [];
}

function fixIdentifier(identifier) {
  // Safari identifier is a large number
  if (identifier > 20) {
    return identifier % 20;
  }

  return identifier;
}

let normalizeTouches = function(touches, nativeEvent) {
  let timestamp = nativeEvent.timestamp || nativeEvent.timeStamp;

  return toArray(touches).map((touch) => {
    // Cloned touch
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
      force: touch.force,
      pageX: touch.pageX,
      pageY: touch.pageY,
      radiusX: touch.radiusX,
      radiusY: touch.radiusY,
      rotationAngle: touch.rotationAngle,
      screenX: touch.screenX,
      screenY: touch.screenY,
      target: touch.target,
      timestamp: timestamp,
      identifier: fixIdentifier(touch.identifier)
    };
  });
};

let originRecordTouchTrack = ResponderTouchHistoryStore.recordTouchTrack;
ResponderTouchHistoryStore.recordTouchTrack = (topLevelType, nativeEvent) => {

  originRecordTouchTrack.call(ResponderTouchHistoryStore, topLevelType, {
    changedTouches: normalizeTouches(nativeEvent.changedTouches, nativeEvent),
    touches: normalizeTouches(nativeEvent.touches, nativeEvent),
  });
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
