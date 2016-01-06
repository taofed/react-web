/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactListView
 */
'use strict';

import React, { PropTypes } from 'react';
import ListViewDataSource from 'ReactListViewDataSource';
import ReactDOM from 'react-dom';
import ScrollView from 'ReactScrollView';
import ScrollResponder from 'ReactScrollResponder';
import StaticRenderer from 'ReactStaticRenderer';
import TimerMixin from 'react-timer-mixin';
import assign from 'object-assign';
import getLayout from 'ReactGetLayout';

var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;
var SCROLLVIEW_REF = 'listviewscroll';

var ListView = React.createClass({
  mixins: [ScrollResponder.Mixin, TimerMixin],

  statics: {
    DataSource: ListViewDataSource,
  },

  /**
   * You must provide a renderRow function. If you omit any of the other render
   * functions, ListView will simply skip rendering them.
   *
   * - renderRow(rowData, sectionID, rowID, highlightRow);
   * - renderSectionHeader(sectionData, sectionID);
   */
  propTypes: {
    ...ScrollView.propTypes,

    dataSource: PropTypes.instanceOf(ListViewDataSource).isRequired,
    /**
     * (sectionID, rowID, adjacentRowHighlighted) => renderable
     * If provided, a renderable component to be rendered as the separator
     * below each row but not the last row if there is a section header below.
     * Take a sectionID and rowID of the row above and whether its adjacent row
     * is highlighted.
     */
    renderSeparator: PropTypes.func,
    /**
     * (rowData, sectionID, rowID, highlightRow) => renderable
     * Takes a data entry from the data source and its ids and should return
     * a renderable component to be rendered as the row.  By default the data
     * is exactly what was put into the data source, but it's also possible to
     * provide custom extractors. ListView can be notified when a row is
     * being highlighted by calling highlightRow function. The separators above and
     * below will be hidden when a row is highlighted. The highlighted state of
     * a row can be reset by calling highlightRow(null).
     */
    renderRow: PropTypes.func.isRequired,
    /**
     * How many rows to render on initial component mount.  Use this to make
     * it so that the first screen worth of data apears at one time instead of
     * over the course of multiple frames.
     */
    initialListSize: PropTypes.number,
    /**
     * Called when all rows have been rendered and the list has been scrolled
     * to within onEndReachedThreshold of the bottom.  The native scroll
     * event is provided.
     */
    onEndReached: PropTypes.func,
    /**
     * Threshold in pixels for onEndReached.
     */
    onEndReachedThreshold: PropTypes.number,
    /**
     * Number of rows to render per event loop.
     */
    pageSize: PropTypes.number,
    /**
     * () => renderable
     *
     * The header and footer are always rendered (if these props are provided)
     * on every render pass.  If they are expensive to re-render, wrap them
     * in StaticContainer or other mechanism as appropriate.  Footer is always
     * at the bottom of the list, and header at the top, on every render pass.
     */
    renderFooter: PropTypes.func,
    renderHeader: PropTypes.func,
    /**
     * (sectionData, sectionID) => renderable
     *
     * If provided, a sticky header is rendered for this section.  The sticky
     * behavior means that it will scroll with the content at the top of the
     * section until it reaches the top of the screen, at which point it will
     * stick to the top until it is pushed off the screen by the next section
     * header.
     */
    renderSectionHeader: PropTypes.func,
    /**
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     */
    renderScrollComponent: React.PropTypes.func.isRequired,
    /**
     * How early to start rendering rows before they come on screen, in
     * pixels.
     */
    scrollRenderAheadDistance: React.PropTypes.number,
    /**
     * (visibleRows, changedRows) => void
     *
     * Called when the set of visible rows changes.  `visibleRows` maps
     * { sectionID: { rowID: true }} for all the visible rows, and
     * `changedRows` maps { sectionID: { rowID: true | false }} for the rows
     * that have changed their visibility, with true indicating visible, and
     * false indicating the view has moved out of view.
     */
    onChangeVisibleRows: React.PropTypes.func,
    /**
     * An experimental performance optimization for improving scroll perf of
     * large lists, used in conjunction with overflow: 'hidden' on the row
     * containers.  Use at your own risk.
     */
    removeClippedSubviews: React.PropTypes.bool,
  },

  /**
   * Provides a handle to the underlying scroll responder to support operations
   * such as scrollTo.
   */
  getScrollResponder: function() {
    return this.refs[SCROLLVIEW_REF] &&
      this.refs[SCROLLVIEW_REF].getScrollResponder &&
      this.refs[SCROLLVIEW_REF].getScrollResponder();
  },

  /**
   * React life cycle hooks.
   */

  getDefaultProps: function() {
    return {
      initialListSize: DEFAULT_INITIAL_ROWS,
      pageSize: DEFAULT_PAGE_SIZE,
      renderScrollComponent: props => <ScrollView {...props} />,
      scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
      onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
    };
  },

  getInitialState: function() {
    return {
      curRenderedRowsCount: this.props.initialListSize,
      prevRenderedRowsCount: 0,
      highlightedRow: {},
    };
  },

  componentWillMount: function() {
    // this data should never trigger a render pass, so don't put in state
    this.scrollProperties = {
      visibleLength: null,
      contentLength: null,
      offset: 0
    };
    this._childFrames = [];
    this._visibleRows = {};
  },

  componentDidMount: function() {
    // do this in animation frame until componentDidMount actually runs after
    // the component is laid out
    this.requestAnimationFrame(() => {
      this._measureAndUpdateScrollProps();
    });
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState((state, props) => {
        var rowsToRender = Math.min(
          state.curRenderedRowsCount + props.pageSize,
          props.dataSource.getRowCount()
        );
        return {
          prevRenderedRowsCount: 0,
          curRenderedRowsCount: rowsToRender,
        };
      });
    }
  },

  componentDidUpdate: function() {
    this.requestAnimationFrame(() => {
      this._measureAndUpdateScrollProps();
    });
  },

  onRowHighlighted: function(sectionID, rowID) {
    this.setState({highlightedRow: {sectionID, rowID}});
  },

  render: function() {
    var bodyComponents = [];

    var dataSource = this.props.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var rowCount = 0;
    var sectionHeaderIndices = [];

    var header = this.props.renderHeader && this.props.renderHeader();
    var footer = this.props.renderFooter && this.props.renderFooter();
    var totalIndex = header ? 1 : 0;

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];
      if (rowIDs.length === 0) {
        continue;
      }

      if (this.props.renderSectionHeader) {
        var shouldUpdateHeader = rowCount >= this.state.prevRenderedRowsCount &&
          dataSource.sectionHeaderShouldUpdate(sectionIdx);
        bodyComponents.push(
          <StaticRenderer
            key={'s_' + sectionID}
            shouldUpdate={!!shouldUpdateHeader}
            render={this.props.renderSectionHeader.bind(
              null,
              dataSource.getSectionHeaderData(sectionIdx),
              sectionID
            )}
          />
        );
        sectionHeaderIndices.push(totalIndex++);
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + rowID;
        var shouldUpdateRow = rowCount >= this.state.prevRenderedRowsCount &&
          dataSource.rowShouldUpdate(sectionIdx, rowIdx);
        var row =
          <StaticRenderer
            key={'r_' + comboID}
            shouldUpdate={!!shouldUpdateRow}
            render={this.props.renderRow.bind(
              null,
              dataSource.getRowData(sectionIdx, rowIdx),
              sectionID,
              rowID,
              this.onRowHighlighted
            )}
          />;
        bodyComponents.push(row);
        totalIndex++;

        if (this.props.renderSeparator &&
            (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          var adjacentRowHighlighted =
            this.state.highlightedRow.sectionID === sectionID && (
              this.state.highlightedRow.rowID === rowID ||
              this.state.highlightedRow.rowID === rowIDs[rowIdx + 1]
            );
          var separator = this.props.renderSeparator(
            sectionID,
            rowID,
            adjacentRowHighlighted
          );
          bodyComponents.push(separator);
          totalIndex++;
        }
        if (++rowCount === this.state.curRenderedRowsCount) {
          break;
        }
      }
      if (rowCount >= this.state.curRenderedRowsCount) {
        break;
      }
    }

    var {
      renderScrollComponent,
      ...props,
    } = this.props;
    if (!props.scrollEventThrottle) {
      props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE;
    }

    assign(props, {
      onScroll: this._onScroll,

      onMoveShouldSetResponderCapture: this.scrollResponderHandleMoveShouldSetResponderCapture,

      stickyHeaderIndices: sectionHeaderIndices,

      // Do not pass these events downstream to ScrollView since they will be
      // registered in ListView's own ScrollResponder.Mixin
      onKeyboardWillShow: undefined,
      onKeyboardWillHide: undefined,
      onKeyboardDidShow: undefined,
      onKeyboardDidHide: undefined,
    });

    // TODO(ide): Use function refs so we can compose with the scroll
    // component's original ref instead of clobbering it
    return React.cloneElement(renderScrollComponent(props), {
      ref: SCROLLVIEW_REF,
    }, header, bodyComponents, footer);
  },

  /**
   * Private methods
   */

  _measureAndUpdateScrollProps: function() {
    var scrollComponent = this.getScrollResponder();
    if (!scrollComponent || !scrollComponent.getInnerViewNode) {
      return;
    }

    // TODO: get layout maybe couse performance problem
    var innerLayout = getLayout(ReactDOM.findDOMNode(scrollComponent.getInnerViewNode()));
    this._setScrollContentLength(innerLayout.x, innerLayout.y, innerLayout.width, innerLayout.height);

    var layout = getLayout(ReactDOM.findDOMNode(scrollComponent));
    this._setScrollVisibleLength(layout.x, layout.y, layout.width, layout.height);

  },

  _setScrollContentLength: function(left, top, width, height) {
    this.scrollProperties.contentLength = !this.props.horizontal ?
      height : width;
  },

  _setScrollVisibleLength: function(left, top, width, height) {
    this.scrollProperties.visibleLength = !this.props.horizontal ?
      height : width;
    this._renderMoreRowsIfNeeded();
  },

  _maybeCallOnEndReached: function(event) {
    if (this.props.onEndReached &&
        this.scrollProperties.contentLength !== this._sentEndForContentLength &&
        this._getDistanceFromEnd(this.scrollProperties) < this.props.onEndReachedThreshold &&
        this.state.curRenderedRowsCount === this.props.dataSource.getRowCount()) {
      this._sentEndForContentLength = this.scrollProperties.contentLength;
      this.props.onEndReached(event);
      return true;
    }
    return false;
  },

  _renderMoreRowsIfNeeded: function() {
    if (this.scrollProperties.contentLength === null ||
      this.scrollProperties.visibleLength === null ||
      this.state.curRenderedRowsCount === this.props.dataSource.getRowCount()) {
      this._maybeCallOnEndReached();
      return;
    }

    var distanceFromEnd = this._getDistanceFromEnd(this.scrollProperties);
    if (distanceFromEnd < this.props.scrollRenderAheadDistance) {
      this._pageInNewRows();
    }
  },

  _pageInNewRows: function() {
    this.setState((state, props) => {
      var rowsToRender = Math.min(
        state.curRenderedRowsCount + props.pageSize,
        props.dataSource.getRowCount()
      );
      return {
        prevRenderedRowsCount: state.curRenderedRowsCount,
        curRenderedRowsCount: rowsToRender
      };
    }, () => {
      this._measureAndUpdateScrollProps();
      this.setState(state => ({
        prevRenderedRowsCount: state.curRenderedRowsCount,
      }));
    });
  },

  _getDistanceFromEnd: function(scrollProperties) {
    return scrollProperties.contentLength -
      scrollProperties.visibleLength -
      scrollProperties.offset;
  },

  // _updateVisibleRows: function(updatedFrames) {
  //   if (!this.props.onChangeVisibleRows) {
  //     return; // No need to compute visible rows if there is no callback
  //   }
  //   if (updatedFrames) {
  //     updatedFrames.forEach((newFrame) => {
  //       this._childFrames[newFrame.index] = merge(newFrame);
  //     });
  //   }
  //   var isVertical = !this.props.horizontal;
  //   var dataSource = this.props.dataSource;
  //   var visibleMin = this.scrollProperties.offset;
  //   var visibleMax = visibleMin + this.scrollProperties.visibleLength;
  //   var allRowIDs = dataSource.rowIdentities;
  //
  //   var header = this.props.renderHeader && this.props.renderHeader();
  //   var totalIndex = header ? 1 : 0;
  //   var visibilityChanged = false;
  //   var changedRows = {};
  //   for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
  //     var rowIDs = allRowIDs[sectionIdx];
  //     if (rowIDs.length === 0) {
  //       continue;
  //     }
  //     var sectionID = dataSource.sectionIdentities[sectionIdx];
  //     if (this.props.renderSectionHeader) {
  //       totalIndex++;
  //     }
  //     var visibleSection = this._visibleRows[sectionID];
  //     if (!visibleSection) {
  //       visibleSection = {};
  //     }
  //     for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
  //       var rowID = rowIDs[rowIdx];
  //       var frame = this._childFrames[totalIndex];
  //       totalIndex++;
  //       if (!frame) {
  //         break;
  //       }
  //       var rowVisible = visibleSection[rowID];
  //       var min = isVertical ? frame.y : frame.x;
  //       var max = min + (isVertical ? frame.height : frame.width);
  //       if (min > visibleMax || max < visibleMin) {
  //         if (rowVisible) {
  //           visibilityChanged = true;
  //           delete visibleSection[rowID];
  //           if (!changedRows[sectionID]) {
  //             changedRows[sectionID] = {};
  //           }
  //           changedRows[sectionID][rowID] = false;
  //         }
  //       } else if (!rowVisible) {
  //         visibilityChanged = true;
  //         visibleSection[rowID] = true;
  //         if (!changedRows[sectionID]) {
  //           changedRows[sectionID] = {};
  //         }
  //         changedRows[sectionID][rowID] = true;
  //       }
  //     }
  //     if (!isEmpty(visibleSection)) {
  //       this._visibleRows[sectionID] = visibleSection;
  //     } else if (this._visibleRows[sectionID]) {
  //       delete this._visibleRows[sectionID];
  //     }
  //   }
  //   visibilityChanged && this.props.onChangeVisibleRows(this._visibleRows, changedRows);
  // },

  _onScroll: function(e) {
    var isVertical = !this.props.horizontal;

    var target = ReactDOM.findDOMNode(this.refs[SCROLLVIEW_REF]);

    this.scrollProperties.visibleLength = target[
      isVertical ? 'offsetHeight' : 'offsetWidth'
    ];
    this.scrollProperties.contentLength = target[
      isVertical ? 'scrollHeight' : 'scrollWidth'
    ];
    this.scrollProperties.offset = target[
      isVertical ? 'scrollTop' : 'scrollTop'
    ];

    // this._updateVisibleRows(e.nativeEvent.updatedChildFrames);
    if (!this._maybeCallOnEndReached(e)) {
      this._renderMoreRowsIfNeeded();
    }

    this.props.onScroll && this.props.onScroll(e);
  },
});

module.exports = ListView;
