/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactJsonp
 */
'use strict';

import Promise from 'ReactPromise';

// From https://github.com/camsong/fetch-jsonp
const defaultOptions = {
  timeout: 5000,
  jsonpCallback: 'callback'
};

function generateCallbackFunction() {
  return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName];
  } catch(e) {
    window[functionName] = undefined;
  }
}

function removeScript(scriptId) {
  const script = document.getElementById(scriptId);
  document.getElementsByTagName("head")[0].removeChild(script);
}

const fetchJsonp = function(url, options = {}) {
  const timeout = options.timeout != null ? options.timeout : defaultOptions.timeout;
  const jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;

  let timeoutId;

  return new Promise((resolve, reject) => {
    const callbackFunction = generateCallbackFunction();

    window[callbackFunction] = function(response) {
      resolve({
        ok: true,
        // keep consistent with fetch API
        json: function() {
          return Promise.resolve(response);
        }
      });

      if (timeoutId) clearTimeout(timeoutId);

      removeScript(jsonpCallback + '_' + callbackFunction);

      clearFunction(callbackFunction);
    };

    // Check if the user set their own params, and if not add a ? to start a list of params
    url += (url.indexOf('?') === -1) ? '?' : '&';

    const jsonpScript = document.createElement('script');
    jsonpScript.setAttribute("src", url + jsonpCallback + '=' + callbackFunction);
    jsonpScript.id = jsonpCallback + '_' + callbackFunction;
    document.getElementsByTagName("head")[0].appendChild(jsonpScript);

    timeoutId = setTimeout(() => {
      reject(new Error(`JSONP request to ${url} timed out`));

      clearFunction(callbackFunction);
      removeScript(jsonpCallback + '_' + callbackFunction);
    }, timeout);
  });
};

module.exports = fetchJsonp;
