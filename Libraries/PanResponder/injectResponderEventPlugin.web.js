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

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = ResponderEventPlugin.eventTypes;
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
'responderTerminationRequest', 'responderGrant', 'responderReject', 'responderTerminate'].forEach(function(type) {
  var dependencies;
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

var normalizeTouches = function(touches, nativeEvent) {
  var timestamp = nativeEvent.timestamp || nativeEvent.timeStamp;

  return toArray(touches).map(function(touch) {
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

var originRecordTouchTrack = ResponderTouchHistoryStore.recordTouchTrack;
ResponderTouchHistoryStore.recordTouchTrack = function(topLevelType, nativeEvent) {

  originRecordTouchTrack.call(ResponderTouchHistoryStore, topLevelType, {
    changedTouches: normalizeTouches(nativeEvent.changedTouches, nativeEvent),
    touches: normalizeTouches(nativeEvent.touches, nativeEvent),
  });
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
