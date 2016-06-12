/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTextInput
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import View from 'ReactView';
import autobind from 'autobind-decorator';

let typeMap = {
  'default': 'text',
  'ascii-capable': 'text',
  'numbers-and-punctuation': 'number',
  'url': 'url',
  'number-pad': 'number',
  'phone-pad': 'tel',
  'name-phone-pad': 'text',
  'email-address': 'email',
  'decimal-pad': 'number',
  'twitter': 'text',
  'web-search': 'search',
  'numeric': 'number'
};

class TextInput extends Component {

  static defaultProps = {
    editable: true,
    multiline: false,
    secureTextEntry: false,
    keyboardType: 'default',
    autoFocus: false
  }

  _onBlur(e) {
    const { onBlur } = this.props;
    if (onBlur) {
      e.nativeEvent.text = e.target.value;
      onBlur(e);
    }
  }

  _onChange(e) {
    const { onChange, onChangeText } = this.props;
    if (onChangeText) onChangeText(e.target.value);
    if (onChange) {
      e.nativeEvent.text = e.target.value;
      onChange(e);
    }
  }

  _onFocus(e) {
    const { clearTextOnFocus, onFocus, selectTextOnFocus } = this.props;
    const node = ReactDOM.findDOMNode(this);
    if (clearTextOnFocus) node.value = '';
    if (selectTextOnFocus) node.select();
    if (onFocus) {
      e.nativeEvent.text = e.target.value;
      onFocus(e);
    }
  }

  _onSelectionChange(e) {
    const { onSelectionChange } = this.props;

    if (onSelectionChange) {
      const { selectionDirection, selectionEnd, selectionStart } = e.target;
      e.nativeEvent.text = e.target.value;
      const event = {
        selectionDirection,
        selectionEnd,
        selectionStart,
        nativeEvent: e.nativeEvent
      };
      onSelectionChange(event);
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }
  }

  render() {

    const {
      accessibilityLabel,
      autoComplete,
      autoFocus,
      defaultValue,
      editable,
      keyboardType,
      maxLength,
      maxNumberOfLines,
      multiline,
      numberOfLines,
      onBlur,
      onChange,
      onKeyDown,
      onKeyUp,
      onKeyPress,
      onChangeText,
      onSelectionChange,
      placeholder,
      password,
      secureTextEntry,
      style,
      testID,
      value
    } = this.props;

    const propsCommon = {
      ref: 'input',
      'aria-label': accessibilityLabel,
      autoComplete: autoComplete && 'on',
      autoFocus,
      defaultValue,
      maxLength,
      onBlur: onBlur && this._onBlur,
      onChange: (onChange || onChangeText) && this._onChange,
      onFocus: this._onFocus,
      onSelect: onSelectionChange && this._onSelectionChange,
      placeholder,
      readOnly: !editable,
      style: {
        ...styles.initial,
        ...style
      },
      testID,
      value,
      onKeyDown,
      onKeyUp,
      onKeyPress
    };

    let input;
    if (multiline) {
      const propsMultiline = {
        ...propsCommon,
        maxRows: maxNumberOfLines || numberOfLines,
        minRows: numberOfLines
      };

      input = <textarea {...propsMultiline} />;

    } else {

      let type = typeMap[keyboardType];

      if (password || secureTextEntry) {
        type = 'password';
      }

      const propsSingleline = {
        ...propsCommon,
        type
      };

      input = <input {...propsSingleline} />;
    }

    if (this.props.children) {
      return (
        <View>
          {input}
          {this.props.children}
        </View>
      );
    } else {
      return input;
    }
  }
};

const styles = {
  initial: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    font: 'inherit',
    padding: 0,
    height: 30, // default height
  }
};

autobind(TextInput);

TextInput.isReactNativeComponent = true;

export default TextInput;
