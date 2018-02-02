(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/module/getWsUrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '123ddSDQcJC4oFdYRNg0NDn', 'getWsUrl', __filename);
// script/module/getWsUrl.js

"use strict";

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function GetWsUrl() {
    var wsdomain = GetQueryString("websocketdomain");
    if (wsdomain === null) {
        return null;
    }
    var port = GetQueryString("port");
    var sign = GetQueryString("sign");
    var nonstr = GetQueryString("nonstr");
    var timestamp = GetQueryString("timestamp");
    var post_data = GetQueryString("post_data");

    var obj = JSON.parse(post_data);
    var gameid = obj.gameid;
    var roomid = obj.roomid;

    var ws_url = "ws://" + wsdomain + ":" + port + "/" + gameid + "/" + roomid + "?nonstr=" + nonstr + "&sign=" + sign + "&timestamp=" + timestamp + "&post_data=" + post_data;

    return ws_url;
}

function GetWssUrl() {
    var wsdomain = GetQueryString("websocketdomain");
    if (wsdomain === null) {
        return null;
    }
    var port = GetQueryString("port");
    var sign = GetQueryString("sign");
    var nonstr = GetQueryString("nonstr");
    var timestamp = GetQueryString("timestamp");
    var post_data = GetQueryString("post_data");

    var obj = JSON.parse(post_data);
    var gameid = obj.gameid;
    var roomid = obj.roomid;

    var ws_url = "wss://" + wsdomain + ":" + port + "/" + gameid + "/" + roomid + "?nonstr=" + nonstr + "&sign=" + sign + "&timestamp=" + timestamp + "&post_data=" + post_data;

    return ws_url;
}

window.GetQueryString = GetQueryString;
window.GetWsUrl = GetWsUrl;
window.GetWssUrl = GetWssUrl;

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
        //# sourceMappingURL=getWsUrl.js.map
        