/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import EventPluginRegistry from 'react/lib/EventPluginRegistry';
import ResponderEventPlugin from 'react/lib/ResponderEventPlugin';
import EventConstants from 'react/lib/EventConstants';
import ResponderTouchHistoryStore from 'react/lib/ResponderTouchHistoryStore';

let topLevelTypes = EventConstants.topLevelTypes;

let eventTypes = ResponderEventPlugin.eventTypes;
eventTypes.startShouldSetResponder.dependencies = [
  topLevelTypes.topTouchStart,
];

eventTypes.scrollShouldSetResponder.dependencies = [
  topLevelTypes.topScroll,
];

eventTypes.selectionChangeShouldSetResponder.dependencies = [
  topLevelTypes.topSelectionChange,
];

eventTypes.moveShouldSetResponder.dependencies = [
  topLevelTypes.topTouchMove,
];

['responderStart', 'responderMove', 'responderEnd', 'responderRelease',
'responderTerminationRequest', 'responderGrant', 'responderReject', 'responderTerminate'].forEach((type) => {
  let dependencies;
  if ('ontouchstart' in window) {
    dependencies = [
      topLevelTypes.topTouchStart,
      topLevelTypes.topTouchCancel,
      topLevelTypes.topTouchEnd,
      topLevelTypes.topTouchMove
    ];
  } else {
    // TODO: support move event
    dependencies = [
      topLevelTypes.topMouseDown,
      topLevelTypes.topMouseUp
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
