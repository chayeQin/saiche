"use strict";
cc._RF.push(module, '088362lqWtCH7AOZJH1p7sP', 'init');
// script/init.js

"use strict";

// 初始化
// --------------------------------------------------------------------------------
require("GameConfig");
window.YYSDK = require('yysdk').YYSDK;
window.NETWORK = require("network2");
window.UTIL = require("util");
window.UI = require("ui");

// NETWORK.initProtocols();

window.WS_URL = YYSDK.GetWssUrl();
cc.log('init->' + WS_URL);
if (window.WS_URL === null) {
    // window.WS_URL = 'ws://39.108.173.10:10020';
    window.WS_URL = 'ws://192.168.1.192:10020';
}

//NETWORK.connect(WS_URL);

cc._RF.pop();