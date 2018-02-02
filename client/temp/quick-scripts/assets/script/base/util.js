(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/base/util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ddac2uUcSNH1r9eE2wjeTxP', 'util', __filename);
// script/base/util.js

"use strict";

// UTIL模块
// --------------------------------------------------------------------------------
// var seedrandom = require("seedrandom");
// current no install.
// npm install seedrandom --save
exports.randInt = function (min, max) {
    var range = max - min;
    // var rng = seedrandom();
    // var rand = rng();
    var rand = Math.random();
    return min + Math.round(rand * range);
};

exports.inRange = function (randNum, rangeDatas) {
    // 查看randNum落在哪个区间
    // i.e: 0-10, 11-20, 20-
    // rangeDatas: [
    //  {"limit": 10},
    //  {"limit": 20},
    //  {},
    //  ]

    for (var index in rangeDatas) {
        var data = rangeDatas[index];
        var limit = data.limit;
        if (limit !== null && randNum < limit) {
            return index;
        }
    }

    return rangeDatas.length - 1;
};

exports.randRange = function (infos) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "limit";
    var randMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var rangeDatas = [];
    var total = 0;

    Object.keys(infos).forEach(function (id) {
        var info = infos[id];
        var limit = info[key];
        total += limit;
        var rangeData = { "limit": total, "info": info };
        rangeDatas.push(rangeData);
    });

    total = randMax !== null ? randMax : total;
    var randNum = UTIL.randInt(0, total);
    var index = UTIL.inRange(randNum, rangeDatas);
    var rangeData = rangeDatas[index];

    return rangeData.info;
};

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
        //# sourceMappingURL=util.js.map
        