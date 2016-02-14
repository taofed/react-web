/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactSwitch
 */
'use strict';

import React, { PropTypes } from 'react';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';

var Switch = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    onTintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
    tintColor: PropTypes.string
  },

  getDefaultProps: function() {
    return {
      onTintColor: '#00e158',
      thumbTintColor: '#fff',
      tintColor: '#fff'
    };
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      disabled: this.props.disabled
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      value: nextProps.value,
      disabled: nextProps.disabled
    });
  },

  getStyles: function() {
    return {
      span: {
        position: 'relative',
        display: 'inline-block',
        margin: 2,
        height: 30,
        width: 50,
        cursor: 'default', // pointer will cause a grey background color on chrome
        verticalAlign: 'middle',
        borderRadius: 20,
        borderColor: '#dfdfdf',
        borderWidth: 1,
        borderStyle: 'solid',
        WebkitUserSelect: 'none',
        WebkitBoxSizing: 'content-box',
        WebkitBackfaceVisibility: 'hidden'
      },
      checkedSpan: {
        borderColor: this.props.onTintColor,
        backgroundColor: this.props.onTintColor,
        boxShadow: this.props.onTintColor + ' 0 0 0 16px inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s, background-color 1s'
      },
      uncheckedSpan: {
        borderColor: '#dfdfdf',
        backgroundColor: this.props.tintColor,
        boxShadow: '#dfdfdf 0 0 0 0 inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s'
      },
      disabledSpan: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none'
      },
      small: {
        position: 'absolute',
        top: 0,
        width: 30,
        height: 30,
        backgroundColor: this.props.thumbTintColor,
        borderRadius: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        WebkitTransition: '-webkit-transform 0.2s ease-in'
      },
      checkedSmall: {
        WebkitTransform: 'translateX(20px)'
      },
      uncheckedSmall: {
        WebkitTransform: 'translateX(0)'
      }
    };
  },

  handleClick: function(e) {
    if (this.state.disabled) {
      return null;
    }

    var newVal = !this.state.value;
    this.props.onValueChange && this.props.onValueChange.call(this, newVal);
    this.setState({
      value: newVal
    });

    var oldValue = this.props.value;
    setTimeout(function() {
      if (this.props.value == oldValue) {
        this.setState({
          value: this.props.value
        });
      }
    }.bind(this), 200);
  },

  render: function() {
    var styles = this.getStyles();
    var spancss = this.state.value ? {...styles.span, ...styles.checkedSpan} : {...styles.span, ...styles.uncheckedSpan};
    var smallcss = this.state.value ? {...styles.small, ...styles.checkedSmall} : {...styles.small, ...styles.uncheckedSmall};
    spancss = this.state.disabled ? {...spancss, ...styles.disabledSpan} : spancss;

    return (
      <span onClick={this.handleClick} style={spancss}>
        <small style={smallcss}/>
      </span>
    );
  }

});
module.exports = Switch;
