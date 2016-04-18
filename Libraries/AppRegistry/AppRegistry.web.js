/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactAppRegistry
 */
'use strict';

import renderApplication from 'ReactRenderApplication';

let runnables = {};

type ComponentProvider = () => ReactClass < any, any, any > ;

type AppConfig = {
  appKey: string;
  component ? : ComponentProvider;
  run ? : Function;
};

/**
 * `AppRegistry` is the JS entry point to running all React Native apps.  App
 * root components should register themselves with
 * `AppRegistry.registerComponent`, then the native system can load the bundle
 * for the app and then actually run the app when it's ready by invoking
 * `AppRegistry.runApplication`.
 *
 * `AppRegistry` should be `require`d early in the `require` sequence to make
 * sure the JS execution environment is setup before other modules are
 * `require`d.
 */
let AppRegistry = {
  registerConfig: function(config: Array < AppConfig > ) {
    for (let i = 0; i < config.length; ++i) {
      let appConfig = config[i];
      if (appConfig.run) {
        AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);
      } else {
        AppRegistry.registerComponent(appConfig.appKey, appConfig.component);
      }
    }
  },

  registerComponent: function(appKey: string, getComponentFunc: ComponentProvider): string {
    runnables[appKey] = {
      run: (appParameters) =>
        renderApplication(getComponentFunc(), appParameters.initialProps, appParameters.rootTag)
    };
    return appKey;
  },

  registerRunnable: function(appKey: string, func: Function): string {
    runnables[appKey] = {
      run: func
    };
    return appKey;
  },

  getAppKeys: function(): Array < string > {
    return Object.keys(runnables);
  },

  runApplication: function(appKey: string, appParameters: any): void {
    runnables[appKey].run(appParameters);
  },
};

export default AppRegistry;
