/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function appendSytle({
  reference,
  rootClassName,
  viewClassName
}) {

  var docEl = document.documentElement;
  var styleEl = document.createElement('style');
  docEl.firstElementChild.appendChild(styleEl);
  var rem = docEl.clientWidth / reference;

  var boxStyle = `
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  `;

  styleEl.innerHTML = `
  html {
    font-size: ${rem}px!important;
  }
  body {
    font-size: 14px;
    margin: 0;
  }
  .${rootClassName} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .${rootClassName} > .${viewClassName} {
    height: 100%;
  }
  .${rootClassName} .${viewClassName} {
    position: relative;
    ${boxStyle}
  }
  `;
}

function setDefaultStyle(options) {
  var metaEl = document.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    return console.warn('Viewport meta not set');
  }

  window.addEventListener('resize', function() {
    appendSytle(options);
  }, false);

  appendSytle(options);
}

module.exports = setDefaultStyle;
