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
    };

    const {
      /* eslint-disable */
      accessibilityComponentType,
      accessibilityLabel,
      accessibilityTraits,
      accessibilityViewIsModal,
      accessible,
      alwaysBounceHorizontal,
      alwaysBounceVertical,
      animationType,
      automaticallyAdjustContentInsets,
      collapsable,
      columnWrapperStyle,
      contentContainerStyle,
      contentOffset,
      dataSource,
      debug,
      DEPRECATED_sendUpdatedChildFrames,
      directionalLockEnabled,
      disableVirtualization,
      emptyText,
      enableEmptySections,
      extraData,
      fixedHeight,
      foo,
      getItem,
      getItemCount,
      getItemLayout,
      horizontal,
      initialListSize,
      initialNumToRender,
      isAllLoaded,
      isEmpty,
      isFoot,
      isFooter,
      isItemSeparator,
      isLoadMore,
      itemCount,
      itemSeparator,
      ItemSeparatorComponent,
      keyboardDismissMode,
      keyboardShouldPersistTaps,
      keyExtractor,
      leftActionActivationDistance,
      leftActionReleaseAnimationConfig,
      leftActionReleaseAnimationFn,
      leftButtonsActivationDistance,
      leftButtonsCloseReleaseAnimationConfig,
      leftButtonsCloseReleaseAnimationFn,
      leftButtonsOpenReleaseAnimationConfig,
      leftButtonsOpenReleaseAnimationFn,
      leftButtonWidth,
      legacyImplementation,
      ListEmptyComponent,
      ListFooterComponent,
      ListHeaderComponent,
      maxToRenderPerBatch,
      numColumns,
      onAsyncPress,
      onComponentRef,
      onContentSizeChange,
      onEndReached,
      onEndReachedThreshold,
      onKeyboardDidHide,
      onKeyboardDidShow,
      onKeyboardWillHide,
      onKeyboardWillShow,
      onLayout,
      onLeftActionActivate,
      onLeftActionComplete,
      onLeftActionDeactivate,
      onLeftActionRelease,
      onLeftButtonsActivate,
      onLeftButtonsCloseComplete,
      onLeftButtonsCloseRelease,
      onLeftButtonsDeactivate,
      onLeftButtonsOpenComplete,
      onLeftButtonsOpenRelease,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
      onPanAnimatedValueRef,
      onRef,
      onRefresh,
      onRightActionActivate,
      onRightActionComplete,
      onRightActionDeactivate,
      onRightActionRelease,
      onRightButtonsActivate,
      onRightButtonsCloseComplete,
      onRightButtonsCloseRelease,
      onRightButtonsDeactivate,
      onRightButtonsOpenComplete,
      onRightButtonsOpenRelease,
      onScrollBeginDrag,
      onScrollEndDrag,
      onSlidingComplete,
      onSwipeComplete,
      onSwipeMove,
      onSwipeRelease,
      onSwipeStart,
      onSyncPress,
      onValueChange,
      onViewableItemsChanged,
      paddingBottom,
      pageSize,
      pagingEnabled,
      progressViewOffset,
      reachedEndFail,
      refPageList,
      refreshControl,
      refreshing,
      removeClippedSubviews,
      renderFooter,
      renderItem,
      renderRow,
      renderScrollComponent,
      renderToHardwareTextureAndroid,
      rightActionActivationDistance,
      rightActionReleaseAnimationConfig,
      rightActionReleaseAnimationFn,
      rightButtonsActivationDistance,
      rightButtonsCloseReleaseAnimationConfig,
      rightButtonsCloseReleaseAnimationFn,
      rightButtonsOpenReleaseAnimationConfig,
      rightButtonsOpenReleaseAnimationFn,
      rightButtonWidth,
      scrollEnabled,
      scrollEventThrottle,
      scrollEventThrottleDisable,
      scrollRenderAheadDistance,
      scrollsToTop,
      shouldItemUpdate,
      showsHorizontalScrollIndicator,
      showsVerticalScrollIndicator,
      stickyHeaderIndices,
      stickySectionHeadersEnabled,
      swipeReleaseAnimationConfig,
      swipeReleaseAnimationFn,
      swipeStartMinDistance,
      tabLabel,
      testID,
      thumbTouchSize,
      updateCellsBatchingPeriod,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      windowSize,
      /* eslint-enable */
      ...noWarningProps
    } = mergedProps;

    return (
      <div className={StyleSheet.viewClassName} {...noWarningProps}>
        {this.props.children}
      </div>
    );
  }
}

mixin.onClass(View, LayoutMixin);
mixin.onClass(View, NativeMethodsMixin);

View.isReactNativeComponent = true;

export default View;
