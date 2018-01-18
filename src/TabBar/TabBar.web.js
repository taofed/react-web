/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabBarItem from './TabBarItem.web';
import TabBarContents from './TabBarContents.web';
import {View, StyleSheet} from 'react-native-web';

class TabBar extends Component {
  state = {
    selectedIndex: 0
  }

  static Item = TabBarItem

  static propTypes = {
    style: PropTypes.object,
    /**
     * Color of the currently selected tab icon
     */
    tintColor: PropTypes.string,
    /**
     * Background color of the tab bar
     */
    barTintColor: PropTypes.string,

    clientHeight: PropTypes.number
  }

  getStyles() {
    return StyleSheet.create({
      container: {
        width: '100%',
        height: this.props.clientHeight || document.documentElement.clientHeight,
        position: 'relative',
        overflow: 'hidden'
      },
      content: {
        width: '100%',
        height: '100%'
      },
      bar: {
        width: '100%',
        position: 'absolute',
        padding: 0,
        margin: 0,
        listStyle: 'none',
        left: 0,
        bottom: 0,
        // borderTop: '1px solid #e1e1e1',
        backgroundColor: 'rgba(250,250,250,.96)',
        display: 'table'
      }
    });
  }

  handleTouchTap(index) {
    this.setState({
      selectedIndex: index
    });
  }

  render() {
    let self = this;
    let styles = self.getStyles();
    let barStyle = {
      ...styles.bar,
      ...this.props.style || {},
      ...this.props.barTintColor ? {backgroundColor: this.props.barTintColor} : {}
    };

    let tabContent = [];

    let tabs = React.Children.map(this.props.children, (tab,
      index) => {
      if (tab.type.displayName === 'TabBarItem') {
        if (tab.props.children) {
          tabContent.push(React.createElement(TabBarContents, {
            key: index,
            selected: self.state.selectedIndex === index
          }, tab.props.children));
        } else {
          tabContent.push(undefined);
        }

        return React.cloneElement(tab, {
          index: index,
          selected: self.state.selectedIndex === index,
          selectedColor: self.props.tintColor,
          handleTouchTap: self.handleTouchTap
        });

      } else {
        let type = tab.type.displayName || tab.type;
        throw 'Tabbar only accepts TabBar.Item Components as children. Found ' + type + ' as child number ' + (index + 1) + ' of Tabbar';
      }
    });

    return (
      <View style={styles.container}>
        <View style={styles.content}>{tabContent}</View>
        <ul style={barStyle}>
          {tabs}
        </ul>
      </View>
    );
  }
}

export default TabBar;
