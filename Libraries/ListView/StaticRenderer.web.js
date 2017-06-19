/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStaticRenderer
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StaticRenderer extends Component {
  static propTypes = {
    shouldUpdate: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  }

  render() {
    return this.props.render();
  }
};

export default StaticRenderer;
