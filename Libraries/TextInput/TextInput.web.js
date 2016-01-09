/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTextInput
 */
'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import View from 'ReactView';

var typeMap = {
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

var TextInput = React.createClass({
  propTypes: {
    /**
     * Can tell TextInput to automatically capitalize certain characters.
     *
     * - characters: all characters,
     * - words: first letter of each word
     * - sentences: first letter of each sentence (default)
     * - none: don't auto capitalize anything
     */
    autoCapitalize: PropTypes.oneOf([
      'none',
      'sentences',
      'words',
      'characters',
    ]),
    /**
     * If false, disables auto-correct. The default value is true.
     */
    autoCorrect: PropTypes.bool,
    /**
     * If true, focuses the input on componentDidMount.
     * The default value is false.
     */
    autoFocus: PropTypes.bool,
    /**
     * Set the position of the cursor from where editing will begin.
     * @platorm android
     */
    textAlign: PropTypes.oneOf([
      'start',
      'center',
      'end',
    ]),
    /**
     * Aligns text vertically within the TextInput.
     * @platform android
     */
    textAlignVertical: PropTypes.oneOf([
      'top',
      'center',
      'bottom',
    ]),
    /**
     * If false, text is not editable. The default value is true.
     */
    editable: PropTypes.bool,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     * - default
     * - numeric
     * - email-address
     */
    keyboardType: PropTypes.oneOf([
      // Cross-platform
      'default',
      'numeric',
      'email-address',
      // iOS-only
      'ascii-capable',
      'numbers-and-punctuation',
      'url',
      'number-pad',
      'phone-pad',
      'name-phone-pad',
      'decimal-pad',
      'twitter',
      'web-search',
    ]),
    /**
     * Determines how the return key should look.
     * @platform ios
     */
    returnKeyType: PropTypes.oneOf([
      'default',
      'go',
      'google',
      'join',
      'next',
      'route',
      'search',
      'send',
      'yahoo',
      'done',
      'emergency-call',
    ]),
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     * @platform ios
     */
    maxLength: PropTypes.number,
    /**
     * Sets the number of lines for a TextInput. Use it with multiline set to
     * true to be able to fill the lines.
     * @platform android
     */
    numberOfLines: PropTypes.number,
    /**
     * If true, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is false.
     * @platform ios
     */
    enablesReturnKeyAutomatically: PropTypes.bool,
    /**
     * If true, the text input can be multiple lines.
     * The default value is false.
     */
    multiline: PropTypes.bool,
    /**
     * Callback that is called when the text input is blurred
     */
    onBlur: PropTypes.func,
    /**
     * Callback that is called when the text input is focused
     */
    onFocus: PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     */
    onChange: PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     * Changed text is passed as an argument to the callback handler.
     */
    onChangeText: PropTypes.func,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing: PropTypes.func,
    /**
     * Callback that is called when the text input's submit button is pressed.
     */
    onSubmitEditing: PropTypes.func,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout: PropTypes.func,
    /**
     * The string that will be rendered before text input has been entered
     */
    placeholder: PropTypes.string,
    /**
     * The text color of the placeholder string
     */
    placeholderTextColor: PropTypes.string,
    /**
     * If true, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is false.
     */
    secureTextEntry: PropTypes.bool,

    /**
     * The value to show for the text input. TextInput is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value: PropTypes.string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you don't want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue: PropTypes.string,
    /**
     * When the clear button should appear on the right side of the text view
     * @platform ios
     */
    clearButtonMode: PropTypes.oneOf([
      'never',
      'while-editing',
      'unless-editing',
      'always',
    ]),
    /**
     * If true, clears the text field automatically when editing begins
     * @platform ios
     */
    clearTextOnFocus: PropTypes.bool,
    /**
     * If true, all text will automatically be selected on focus
     * @platform ios
     */
    selectTextOnFocus: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      editable: true,
      multiline: false,
      secureTextEntry: false,
      keyboardType: 'default',
      autoFocus: false
    };
  },

  _onBlur(e) {
    const { onBlur } = this.props;
    if (onBlur) {
      e.nativeEvent.text = e.target.value;
      onBlur(e);
    }
  },

  _onChange(e) {
    const { onChange, onChangeText } = this.props;
    if (onChangeText) onChangeText(e.target.value);
    if (onChange) {
      e.nativeEvent.text = e.target.value;
      onChange(e);
    }
  },

  _onFocus(e) {
    const { clearTextOnFocus, onFocus, selectTextOnFocus } = this.props;
    const node = ReactDOM.findDOMNode(this);
    if (clearTextOnFocus) node.value = '';
    if (selectTextOnFocus) node.select();
    if (onFocus) {
      e.nativeEvent.text = e.target.value;
      onFocus(e);
    }
  },

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
  },

  componentDidMount: function() {
    if (this.props.autoFocus) {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }
  },

  render: function() {

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
      value
    };

    var input;
    if (multiline) {
      const propsMultiline = {
        ...propsCommon,
        maxRows: maxNumberOfLines || numberOfLines,
        minRows: numberOfLines
      };

      input = <textarea {...propsMultiline} />;

    } else {

      var type = typeMap[keyboardType];

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
});

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

module.exports = TextInput;
