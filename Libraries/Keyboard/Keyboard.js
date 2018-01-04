/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactKeyboard
 */
'use strict';

import dismissKeyboard from 'ReactDismissKeyboard';

const Keyboard = {
    addListener() {
        return {
            remove() {}
        };
    },
    dismiss() {
        dismissKeyboard();
    },
    removeAllListeners() {},
    removeListener() {}
};

export default Keyboard;
