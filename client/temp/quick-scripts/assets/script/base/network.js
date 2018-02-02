(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/base/network.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0c4ffFXrllH4aqHOUH/ahl4', 'network', __filename);
// script/base/network.js

"use strict";

var base64 = protobuf.util.base64;

var PROTOCOL_PATH = "./protocol";

// 上行协议全局变量
var for_maker = {};
// 下行协议全局变量
var for_caller = {};

// window.for_maker = for_maker;
// window.for_caller = for_caller;
// require("binding");

var socket = null;
var isConnect = false;

var isProtocolInited = false;

// 配置只需要这4种数据类型
var protocolInfos = {};

// 分析协议文件
function parseProtocol(filedata) {
    cc.log("parse filedata:", filedata);
    var result = protobuf.parse(filedata);
    var packageName = result.package;
    cc.log("parse package:", packageName);

    var objects = result.root.lookup(packageName).toJSON();
    Object.keys(objects.nested).forEach(function (protocolName) {
        var protocol = result.root.lookup(packageName + "." + protocolName);
        cc.log(" | protocol:", protocolName);

        var map = {
            "protocol": protocol, // 协议数据
            "packageName": packageName, // 协议package名
            "fieldNames": [] // 协议参数列表
        };
        protocolInfos[protocolName] = map;

        Object.keys(protocol.fields).forEach(function (fieldName) {
            cc.log(" |-- field:", fieldName);
            protocolInfos[protocolName]["fieldNames"].push(fieldName);
        });

        // 封装协议函数
        if (protocolName.startsWith("s_")) {
            cc.log("init protocol:", protocolName);
            // 下行协议for_caller封装
            for_caller[protocolName] = function () {
                // TODO 连接已断开的处理
                if (!isConnect) {
                    cc.log("> 连接已断开");
                    return;
                }

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                console.assert(args.length == map.fieldNames.length);

                // 创建协议参数数据结构
                var data = {};
                for (var i = 0; i < map.fieldNames.length; i++) {
                    var argName = map.fieldNames[i];
                    data[argName] = args[i];
                }
                // cc.log("> " + protocolName + ": " + JSON.stringify(data));

                // Protobuf编码
                var buffer = map.protocol.encode(data).finish();
                // Base64编码之后发送出去
                socket.emit(protocolName, base64.encode(buffer, 0, buffer.length));
            };
        }
    });
}

// 初始化协议
function initProtocols() {
    // 先获取协议目录下的所有协议文件
    var files = ["./protocol/login", "./protocol/user", "./protocol/racing"];

    // cc.log(files)
    for (var i = 0, length = files.length; i < length; i++) {
        // 文件相对路径
        var filepath = files[i];
        // 文件内容
        cc.loader.loadRes(filepath, function (err, filedata) {
            // 分析协议文件
            parseProtocol(filedata);
        });
    }
}

exports.initProtocols = function () {
    if (isProtocolInited) return;
    isProtocolInited = true;
    initProtocols();
};

exports.connect = function (url) {
    if (cc.sys.isNative) {
        window.io = SocketIO.connect;
    } else {}
    // window.io = require('socket.io');


    // 连接
    cc.log("wsURL->" + url);
    socket = io(url);

    socket.on('disconnect', function () {
        isConnect = false;
        cc.log("服务器已断开连接");
        // reconnect
        // socket.open();
    });
    socket.on('connect', function () {
        isConnect = true;
        cc.log("服务器已连接");
        for_caller.s_login_version(1);
    });

    Object.keys(protocolInfos).forEach(function (protocolName) {
        var map = protocolInfos[protocolName];
        // 上行协议for_maker封装
        if (protocolName.startsWith("c_")) {
            cc.log("init protocol:", protocolName);
            // 监听协议事件
            socket.on(protocolName, function (data) {
                // Base64解码
                var decodeArray = new Uint8Array(base64.length(data));
                base64.decode(data, decodeArray, 0);
                // Protobuf解码
                var data = map.protocol.decode(decodeArray);

                cc.log("> " + protocolName + ": " + JSON.stringify(data));
                // 查找for_maker函数
                if (for_maker[protocolName]) {
                    var argValues = [];
                    for (var i = 0; i < map.fieldNames.length; i++) {
                        var argName = map.fieldNames[i];
                        argValues.push("data." + argName);
                    }
                    var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
                    eval(code);
                }
            });
        }
    });
};

exports.isConnected = function () {
    return isConnect;
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
        //# sourceMappingURL=network.js.map
        