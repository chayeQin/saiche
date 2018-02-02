var base64 = protobuf.util.base64;

var PROTOCOL_PATH = "./protocol";

// 上行协议全局变量
var for_maker = {}
// 下行协议全局变量
var for_caller = {}

window.for_maker = for_maker;
window.for_caller = for_caller;
require("binding");

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
            for_caller[protocolName] = function (...args) {
                // TODO 连接已断开的处理
                if (!isConnect) {
                    cc.log("> 连接已断开");
                    return;
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
                var message = protocolName + "|" + base64.encode(buffer, 0, buffer.length);
                socket.send(message);
            }
        }
    });
}

// 初始化协议
function initProtocols() {
    // 先获取协议目录下的所有协议文件
    var files = [
        "./protocol/login",
        "./protocol/user",
        "./protocol/racing"
    ];

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
}

exports.connect = function (url) {
    // 连接
    cc.log("connect->" + url)
    socket = new WebSocket(url);

    socket.onopen = function () {
        isConnect = true;
        cc.log("服务器已连接");
        for_caller.s_login_version(1);
    }

    socket.onmessage = function (e) {
        var message = e.data;
        console.log("received: %s", message);
        var datas = message.split("|");
        if (datas.length != 2) return;

        // 查找for_maker函数
        var protocolName = datas[0];
        if (for_maker[protocolName]) {
            var map = protocolInfos[protocolName];
            var data = datas[1];
            var decodeArray = new Uint8Array(base64.length(data));
            base64.decode(data, decodeArray, 0);
            var args = map.protocol.decode(decodeArray);

            cc.log("> " + protocolName + ": " + JSON.stringify(args));

            var argValues = [];
            for (var i = 0; i < map.fieldNames.length; i++) {
                var argName = map.fieldNames[i];
                argValues.push("args." + argName);
            }
            var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
            eval(code);
        }
    }

    socket.onclose = function () {
        isConnect = false;
        cc.log("服务器已断开连接");
        cc.director.emit("FINISH", {});
    };

    socket.onerror = function (evt) {
        isConnect = false;
        cc.log("服务器链接错误");
        cc.director.emit("FINISH", {});
    };

}

exports.isConnected = function () {
    return isConnect;
}

