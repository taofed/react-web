/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import React, { PropTypes } from 'react';
import Image from 'ReactImage';
import Text from 'ReactText';
import View from 'ReactView';
import StyleSheet from 'ReactStyleSheet';

let TabBarItem = React.createClass({
  propTypes: {
    /**
     * Little red bubble that sits at the top right of the icon.
     */
    badge: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number,
    ]),
    /**
     * A custom icon for the tab. It is ignored when a system icon is defined.
     */
    icon: PropTypes.object,
    /**
     * A custom icon when the tab is selected. It is ignored when a system
     * icon is defined. If left empty, the icon will be tinted in blue.
     */
    selectedIcon: PropTypes.string,
    /**
     * Callback when this tab is being selected, you should change the state of your
     * component to set selected={true}.
     */
    onPress: PropTypes.func,
    /**
     * It specifies whether the children are visible or not. If you see a
     * blank content, you probably forgot to add a selected one.
     */
    selected: PropTypes.bool,
    /**
     * React style object.
     */
    style: PropTypes.object,
    /**
     * Text that appears under the icon. It is ignored when a system icon
     * is defined.
     */
    title: PropTypes.string,
    /**
     * Color of the currently selected tab icon
     */
    selectedColor: PropTypes.string
  },

  _onClick() {
    if (this.props.onPress) {
      this.props.onPress();
    }
    if (this.props.handleTouchTap) {
      this.props.handleTouchTap(this.props.index);
    }
  },

  render() {

    var tabStyle = {...styles.tab, ...this.props.style || {}, color: (this.props.selectedColor && this.props.selected) ? this.props.selectedColor : null};

    return (
      <li style={tabStyle}>
        <a onClick={this._onClick} style={styles.link}>
          {this.props.badge ? <em style={styles.badge}>{this.props.badge}</em> : ''}
          <Image source={(this.props.selected && this.props.selectedIcon) ? this.props.selectedIcon : this.props.icon} style={styles.icon} />
          <View style={{marginTop: 4}}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
        </a>
      </li>
    );
  }
});

let styles = StyleSheet.create({
  tab: {
    display: 'table-cell',
    textAlign: 'center',
    position: 'relative'
  },
  link: {
    display: 'block',
    padding: '0.3em 0'
  },
  badge: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    left: '52%',
    color: '#FFF',
    backgroundColor: '#FF0000',
    height: '1.6em',
    lineHeight: '1.6em',
    minWidth: '1.6em',
    fontSize: '0.7em',
    borderRadius: '0.8em',
    fontStyle: 'normal'
  },
  icon: {
    width: '1.875em',
    height: '1.875em'
  },
  title: {
    fontSize: 12
  }
});

export default TabBarItem;
