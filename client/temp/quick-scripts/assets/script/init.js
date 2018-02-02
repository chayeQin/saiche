(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/init.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '088362lqWtCH7AOZJH1p7sP', 'init', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=init.js.map
        