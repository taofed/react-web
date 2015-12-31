/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStaticRenderer
 */
'use strict';

import React, { PropTypes } from 'react';

var StaticRenderer = React.createClass({
  propTypes: {
    shouldUpdate: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
  },

  shouldComponentUpdate: function(nextProps: { shouldUpdate: boolean }): boolean {
    return nextProps.shouldUpdate;
  },

  render: function(): ReactElement {
    return this.props.render();
  },
});

module.exports = StaticRenderer;
