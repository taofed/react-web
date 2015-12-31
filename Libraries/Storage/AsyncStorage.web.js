/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactAsyncStorage
 */
'use strict';

import Promise from 'ReactPromise';
var localStorage = window.localStorage;

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 *
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge(obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (var attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
}

// AsyncStorage Object
var AsyncStorage = {};

// both methods in localStorage and AsyncStorage
var bothMethods = [
  'getItem', 'setItem', 'removeItem', 'clear'
];

/**
 * Add 'getItem', 'setItem', 'removeItem', 'clear' to AsyncStorage
 *
 * Every method returns a `Promise` object.
 */
bothMethods.forEach(function(item) {

  var promiseMethod = function() {

    var args = arguments;

    return new Promise(function(resolve, reject) {

      try {

        var result = localStorage[item].apply(localStorage, args);
        resolve(result);

      } catch (err) {

        // Maybe in the browser private mode will cause this problem
        reject(err);

      }

    });
  };
  AsyncStorage[item] = promiseMethod;
});

/**
 * Merges existing value with input value, assuming they are stringified json. Returns a `Promise` object.
 */
AsyncStorage.mergeItem = function(key, value) {

  return new Promise(function(resolve, reject) {

    try {
      var oldValue = localStorage.getItem(key);
      var oldObj = JSON.parse(oldValue);
      var newObj = JSON.parse(value);

      // merge define in the file end
      var mergedObj = merge(oldObj, newObj);

      localStorage.setItem(key, JSON.stringify(mergedObj));
      resolve();

    } catch (err) {
      reject(err);
    }

  });

};

/**
 * Gets *all* keys known to the system, for all callers, libraries, etc. Returns a `Promise` object.
 */
AsyncStorage.getAllKeys = function() {

  var keys = [];

  for (var i = 0, len = localStorage.length; i < len; ++i) {
    keys.push(localStorage.key(i));
  }

  return new Promise(function(resolve, reject) {
    resolve(keys);
  });

};

/**
 * The following batched functions are useful for executing a lot of
 * operations at once, allowing for native optimizations and provide the
 * convenience of a single callback after all operations are complete.
 *
 * These functions return arrays of errors, potentially one for every key.
 * For key-specific errors, the Error object will have a key property to
 * indicate which key caused the error.
 */

/**
 * multiGet invokes callback with an array of key-value pair arrays that
 * matches the input format of multiSet. Returns a `Promise` object.
 *
 *   multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
 */
AsyncStorage.multiGet = function() {

  var keys = [].splice.call(arguments);
  var results = null;

  return new Promise(function(resolve, reject) {

    try {

      results = keys.map(function(key) {
        return [
          key, localStorage.getItem(key)
        ];
      });

      resolve(results);

    } catch (err) {
      reject(err);
    }

  });
};

/**
 * multiSet and multiMerge take arrays of key-value array pairs that match
 * the output of multiGet, e.g. Returns a `Promise` object.
 *
 *   multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
 */
AsyncStorage.multiSet = function() {

  var args = [].splice.call(arguments);

  return new Promise(function(resolve, reject) {

    try {

      args.forEach(function(item) {
        return localStorage.setItem(item[0], item[1]);
      });

      resolve();

    } catch (err) {
      reject(err);
    }

  });

};

/**
 * Delete all the keys in the `keys` array. Returns a `Promise` object.
 */
AsyncStorage.multiRemove = function() {

  var keys = [].splice.call(arguments);

  return new Promise(function(resolve, reject) {

    try {

      keys.forEach(function(key) {
        return localStorage.removeItem(key);
      });

      resolve();

    } catch (err) {
      reject(err);
    }

  });
};

/**
 * Merges existing values with input values, assuming they are stringified
 * json. Returns a `Promise` object.
 *
 * Not supported by all native implementations.
 */
AsyncStorage.multiMerge = function() {

  var self = this;
  var args = [].splice.call(arguments);

  return new Promise(function(resolve, reject) {
    try {
      var promiseQueue = args.map(function(arg) {
        return self.mergeItem(arg[0], arg[1]);
      });
      resolve(Promise.all(promiseQueue));
    } catch (err) {
      reject(err);
    }

  });

};

module.exports = AsyncStorage;
