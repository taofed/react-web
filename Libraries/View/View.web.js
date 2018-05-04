/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactView
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyleSheet from 'ReactStyleSheet';
import mixin from 'react-mixin';
import { Mixin as LayoutMixin } from 'ReactLayoutMixin';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';

class View extends Component {

  static propTypes = {
    /**
     * Used to locate this view in end-to-end tests. NB: disables the 'layout-only
     * view removal' optimization for this view!
     */
    testID: PropTypes.string,

    /**
     * For most touch interactions, you'll simply want to wrap your component in
     * `TouchableHighlight` or `TouchableOpacity`. Check out `Touchable.js`,
     * `ScrollResponder.js` and `ResponderEventPlugin.js` for more discussion.
     */
    onMoveShouldSetResponder: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderMove: PropTypes.func,
    onResponderReject: PropTypes.func,
    onResponderRelease: PropTypes.func,
    onResponderTerminate: PropTypes.func,
    onResponderTerminationRequest: PropTypes.func,
    onStartShouldSetResponder: PropTypes.func,
    onStartShouldSetResponderCapture: PropTypes.func,

    /**
     * Invoked on mount and layout changes with
     *
     *   {nativeEvent: { layout: {x, y, width, height}}}.
     *
     * This event is fired immediately once the layout has been calculated, but
     * the new layout may not yet be reflected on the screen at the time the
     * event is received, especially if a layout animation is in progress.
     */
    onLayout: PropTypes.func,

    /**
     * In the absence of `auto` property, `none` is much like `CSS`'s `none`
     * value. `box-none` is as if you had applied the `CSS` class:
     *
     * ```
     * .box-none {
     *   pointer-events: none;
     * }
     * .box-none * {
     *   pointer-events: all;
     * }
     * ```
     *
     * `box-only` is the equivalent of
     *
     * ```
     * .box-only {
     *   pointer-events: all;
     * }
     * .box-only * {
     *   pointer-events: none;
     * }
     * ```
     *
     * But since `pointerEvents` does not affect layout/appearance, and we are
     * already deviating from the spec by adding additional modes, we opt to not
     * include `pointerEvents` on `style`. On some platforms, we would need to
     * implement it as a `className` anyways. Using `style` or not is an
     * implementation detail of the platform.
     */
    pointerEvents: PropTypes.oneOf([
      'box-none',
      'none',
      'box-only',
      'auto',
    ]),

    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
  };

  render() {
    const {
      pointerEvents
    } = this.props;
    var mergedProps = this.props;
    if (pointerEvents) {
      mergedProps = Object.assign({}, this.props, {style: {...mergedProps.style, pointerEvents}});
    }

    mergedProps = {
        ...mergedProps,
        'aria-label': mergedProps.accessibilityLabel,
    }

    delete mergedProps.accessibilityLabel;
    delete mergedProps.accessible;
    delete mergedProps.accessibilityComponentType;
    delete mergedProps.accessibilityTraits;
    delete mergedProps.testID;
    delete mergedProps.onLayout;
    delete mergedProps.collapsable;
    delete mergedProps.showsVerticalScrollIndicator;
    delete mergedProps.removeClippedSubviews;
    delete mergedProps.enableEmptySections;
    delete mergedProps.initialListSize;
    delete mergedProps.pagingEnabled;
    delete mergedProps.scrollRenderAheadDistance;
    delete mergedProps.dataSource;
    delete mergedProps.renderRow;
    delete mergedProps.onEndReachedThreshold;
    delete mergedProps.onEndReached;
    delete mergedProps.renderFooter;
    delete mergedProps.refreshControl;
    delete mergedProps.pageSize;
    delete mergedProps.stickyHeaderIndices;
    delete mergedProps.scrollEventThrottle;
    delete mergedProps.onKeyboardWillShow;
    delete mergedProps.onKeyboardWillHide;
    delete mergedProps.onKeyboardDidShow;
    delete mergedProps.onKeyboardDidHide;
    delete mergedProps.scrollEnabled;
    delete mergedProps.onContentSizeChange;
    delete mergedProps.alwaysBounceHorizontal;
    delete mergedProps.alwaysBounceVertical;
    delete mergedProps.onScrollBeginDrag;
    delete mergedProps.onScrollEndDrag;
    delete mergedProps.onMomentumScrollBegin;
    delete mergedProps.onMomentumScrollEnd;
    delete mergedProps.horizontal;
    delete mergedProps.automaticallyAdjustContentInsets;
    delete mergedProps.contentOffset;
    delete mergedProps.scrollsToTop;
    delete mergedProps.showsHorizontalScrollIndicator;
    delete mergedProps.directionalLockEnabled;
    delete mergedProps.keyboardDismissMode;
    delete mergedProps.tabLabel;
    delete mergedProps.ItemSeparatorComponent;
    delete mergedProps.ListFooterComponent;
    delete mergedProps.ListHeaderComponent;
    delete mergedProps.debug;
    delete mergedProps.disableVirtualization;
    delete mergedProps.getItemLayout;
    delete mergedProps.keyboardShouldPersistTaps;
    delete mergedProps.legacyImplementation;
    delete mergedProps.numColumns;
    delete mergedProps.onRefresh;
    delete mergedProps.refreshing;
    delete mergedProps.renderItem;
    delete mergedProps.contentContainerStyle;
    delete mergedProps.viewabilityConfig;
    delete mergedProps.keyExtractor;
    delete mergedProps.getItem;
    delete mergedProps.getItemCount;
    delete mergedProps.initialNumToRender;
    delete mergedProps.maxToRenderPerBatch;
    delete mergedProps.renderScrollComponent;
    delete mergedProps.shouldItemUpdate;
    delete mergedProps.updateCellsBatchingPeriod;
    delete mergedProps.windowSize;
    delete mergedProps.onViewableItemsChanged;
    delete mergedProps.foo;
    delete mergedProps.accessibilityViewIsModal;
    delete mergedProps.viewabilityConfigCallbackPairs;
    delete mergedProps.stickySectionHeadersEnabled;
    delete mergedProps.DEPRECATED_sendUpdatedChildFrames;
    delete mergedProps.onLeftActionActivate;
    delete mergedProps.onLeftActionDeactivate;
    delete mergedProps.onLeftActionRelease;
    delete mergedProps.onLeftActionComplete;
    delete mergedProps.leftActionActivationDistance;
    delete mergedProps.leftActionReleaseAnimationFn;
    delete mergedProps.leftActionReleaseAnimationConfig;
    delete mergedProps.onRightActionActivate;
    delete mergedProps.onRightActionDeactivate;
    delete mergedProps.onRightActionRelease;
    delete mergedProps.onRightActionComplete;
    delete mergedProps.rightActionActivationDistance;
    delete mergedProps.rightActionReleaseAnimationFn;
    delete mergedProps.rightActionReleaseAnimationConfig;
    delete mergedProps.onLeftButtonsActivate;
    delete mergedProps.onLeftButtonsDeactivate;
    delete mergedProps.onLeftButtonsOpenRelease;
    delete mergedProps.onLeftButtonsOpenComplete;
    delete mergedProps.onLeftButtonsCloseRelease;
    delete mergedProps.onLeftButtonsCloseComplete;
    delete mergedProps.leftButtonWidth;
    delete mergedProps.leftButtonsActivationDistance;
    delete mergedProps.leftButtonsOpenReleaseAnimationFn;
    delete mergedProps.leftButtonsOpenReleaseAnimationConfig;
    delete mergedProps.leftButtonsCloseReleaseAnimationFn;
    delete mergedProps.leftButtonsCloseReleaseAnimationConfig;
    delete mergedProps.onRightButtonsActivate;
    delete mergedProps.onRightButtonsDeactivate;
    delete mergedProps.onRightButtonsOpenRelease;
    delete mergedProps.onRightButtonsOpenComplete;
    delete mergedProps.onRightButtonsCloseRelease;
    delete mergedProps.onRightButtonsCloseComplete;
    delete mergedProps.rightButtonWidth;
    delete mergedProps.rightButtonsActivationDistance;
    delete mergedProps.rightButtonsOpenReleaseAnimationFn;
    delete mergedProps.rightButtonsOpenReleaseAnimationConfig;
    delete mergedProps.rightButtonsCloseReleaseAnimationFn;
    delete mergedProps.rightButtonsCloseReleaseAnimationConfig;
    delete mergedProps.onSwipeStart;
    delete mergedProps.onSwipeMove;
    delete mergedProps.onSwipeRelease;
    delete mergedProps.onSwipeComplete;
    delete mergedProps.swipeReleaseAnimationFn;
    delete mergedProps.swipeReleaseAnimationConfig;
    delete mergedProps.onRef;
    delete mergedProps.onPanAnimatedValueRef;
    delete mergedProps.swipeStartMinDistance;
    delete mergedProps.ListEmptyComponent;
    delete mergedProps.columnWrapperStyle;
    delete mergedProps.paddingBottom;
    delete mergedProps.isItemSeparator;
    delete mergedProps.isFoot;
    delete mergedProps.fixedHeight;
    delete mergedProps.itemCount;
    delete mergedProps.isLoadMore;
    delete mergedProps.isEmpty;
    delete mergedProps.isAllLoaded;
    delete mergedProps.itemSeparator;

    return (
      <div className={StyleSheet.viewClassName} {...mergedProps}>
        {this.props.children}
      </div>
    );
  }
}

mixin.onClass(View, LayoutMixin);
mixin.onClass(View, NativeMethodsMixin);

View.isReactNativeComponent = true;

export default View;
