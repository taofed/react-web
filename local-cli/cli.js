/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

require("babel-core/register")({
  only: /local-cli/,
});

var generateWeb = require('./generator-web');
var server = require('./server');
var bundle = require('./bundle');
var defaultConfig = require('./defaultConfig');
var Config = require('./util/Config');
var path = require('path');
var Promise = require('promise');
var fs = require('fs');
var gracefulFs = require('graceful-fs');

// graceful-fs helps on getting an error when we run out of file
// descriptors. When that happens it will enqueue the operation and retry it.
gracefulFs.gracefulify(fs);

var documentedCommands = {
  'start': [server, 'starts the webserver'],
  'bundle': [bundle, 'builds the javascript bundle'],
}

var undocumentedCommands = {
  'init': [printInitWarning, ''],
};

var commands = Object.assign({}, documentedCommands, undocumentedCommands);

/**
 * Parses the command line and runs a command of the CLI.
 */
function run() {
  var args = process.argv.slice(2);
  if (args.length === 0) {
    printUsage();
  }

  var command = commands[args[0]];
  if (!command) {
    console.error('Command `%s` unrecognized', args[0]);
    printUsage();
    return;
  }

  command[0](args, Config.get(__dirname, defaultConfig)).done();
}

function printUsage() {
  console.log([
    'Usage: react-web <command>',
    '',
    'Commands:'
  ].concat(Object.keys(documentedCommands).map(function(name) {
    return '  - ' + name + ': ' + documentedCommands[name][1];
  })).join('\n'));
  process.exit(1);
}

// The user should never get here because projects are inited by
// using `react-web-cli` from outside a project directory.
function printInitWarning() {
  return Promise.resolve().then(function() {
    console.log([
      'Looks like React Web project already exists in the current',
      'folder. Run this command from a different folder or remove node_modules/react-web'
    ].join('\n'));
    process.exit(1);
  });
}

/**
 * Creates the template for a React Web project given the provided
 * parameters:
 *   - projectDir: templates will be copied here.
 *   - argsOrName: project name or full list of custom arguments to pass to the
 *                 generator.
 */
function init(projectDir, argsOrName) {
  console.log('Setting up new React Web app in ' + projectDir);

  // argv is for instance
  // ['node', 'react-web', 'init', 'AwesomeApp', '--verbose']
  // args should be ['AwesomeApp', '--verbose']
  var args = Array.isArray(argsOrName)
    ? argsOrName
    : [argsOrName].concat(process.argv.slice(4));

  generateWeb(projectDir, defaultConfig);

}

if (require.main === module) {
  run();
}

module.exports = {
  run: run,
  init: init,
};
