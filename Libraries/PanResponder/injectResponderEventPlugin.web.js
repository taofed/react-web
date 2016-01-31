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
  return collection && Array.prototype.slice.call(collection);
}

var argumentTimestamp = function(timestamp, touch) {
  touch.timestamp = timestamp;
};

var originRecordTouchTrack = ResponderTouchHistoryStore.recordTouchTrack;
ResponderTouchHistoryStore.recordTouchTrack = function(topLevelType, nativeEvent) {
  var timestamp = nativeEvent.timestamp || nativeEvent.timeStamp;

  if (nativeEvent.changedTouches) {
    var changedTouches = toArray(nativeEvent.changedTouches);
    changedTouches.forEach(argumentTimestamp.bind(null, timestamp));
  }

  originRecordTouchTrack.call(ResponderTouchHistoryStore, topLevelType, {
    changedTouches: changedTouches || [],
    touches: toArray(nativeEvent.touches) || [],
  });
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
