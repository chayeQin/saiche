var protobuf = require("protobufjs");
var base64 = protobuf.util.base64;
var fs = require("fs");
var logger = getLogger("network");

// 上行协议全局变量
var for_maker = {};
// 下行协议全局变量
var for_caller = {};

var noLoginProtocols = {
    ["s_login_version"]: true,
    ["s_login_player_create"]: true,
    ["s_login_player_enter"]: true,
};

function isNoLoginProtocol (protocolName) {
    return noLoginProtocols[protocolName] ? true : false;
}

var PROTOCOL_PATH = "./protocol";

// 配置只需要这4种数据类型
function dirProtocols(path) {
    var files = [];
    var dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
        if (fs.statSync(path + "/" + item).isDirectory()) {
            dirProtocols(path + "/" + item);
        } else {
            if (item.endsWith(".proto")) {
                files.push(path + "/" + item);
            }
        }
    });
    return files;
}

// 分析协议文件
var protocolInfos = {};
function parseProtocol(filedata) {
    var result = protobuf.parse(filedata);
    var packageName = result.package;
    logger.debug("parse package:", packageName);

    var objects = result.root.lookup(packageName).toJSON();
    Object.keys(objects.nested).forEach(function (protocolName) {
        var protocol = result.root.lookup(packageName + "." + protocolName);
        logger.debug(" | protocol:", protocolName);

        var map = {
            "protocol": protocol, // 协议数据
            "packageName": packageName, // 协议package名
            "fieldNames": [] // 协议参数列表
        };
        protocolInfos[protocolName] = map;

        Object.keys(protocol.fields).forEach(function (fieldName) {
            logger.debug(" |-- field:", fieldName);
            protocolInfos[protocolName]["fieldNames"].push(fieldName);
        });

        // 封装协议函数
        if (protocolName.startsWith("c_")) {
            logger.debug("init protocol:", protocolName);
            // 下行协议for_caller封装
            for_caller[protocolName] = function (vfd, ...args) {
                console.assert(args.length == map.fieldNames.length);

                var client = NETWORK.getClient(vfd);
                if (!client) {
                    logger.warn("找不到连接的socket");
                    return;
                }

                // 创建协议参数数据结构
                var data = {};
                for (var i = 0; i < map.fieldNames.length; i++) {
                    var argName = map.fieldNames[i];
                    data[argName] = args[i];
                }

                logger.debug("> " + protocolName + ": " + JSON.stringify(data));

                // Protobuf编码script\module\binding.js
                var buffer = map.protocol.encode(data).finish();
                // Base64编码之后发送出去
                var data = base64.encode(buffer, 0, buffer.length);
                NETWORK.send(vfd, protocolName, data);
            }
        }
    });
}

function onData(vfd, protocolName, data) {
    // console.log("received: %s", message);
    try{
        // 查找for_maker函数
        if (for_maker[protocolName] == null) return;

        var map = protocolInfos[protocolName];
        var decodeArray = new Uint8Array(base64.length(data));
        base64.decode(data, decodeArray, 0);

        var args = map.protocol.decode(decodeArray);

        logger.debug("> " + protocolName + ": " + JSON.stringify(args));

        var argValues = ["vfd"];
        for (var i = 0; i < map.fieldNames.length; i++) {
            var argName = map.fieldNames[i];
            argValues.push("args." + argName);
        }
        

        for_maker[protocolName](...argValues);

        // var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
        // eval(code);
    }catch(e){
        logger.error(e);
    }
}

// 初始化协议
function initProtocols() {
    // 先获取协议目录下的所有协议文件
    var files = dirProtocols(PROTOCOL_PATH);
    // logger.info(files)
    for (var i = 0, length = files.length; i < length; i++) {
        // 文件相对路径
        var filepath = files[i];
        // 文件内容
        var data = fs.readFileSync(filepath);
        // 分析协议文件
        parseProtocol(data.toString());
    }
}

// initProtocols();

// --------------------------------------------------------------------------------

global.for_maker = for_maker;
global.for_caller = for_caller;

exports.isNoLoginProtocol = isNoLoginProtocol;
exports.initProtocols = initProtocols;
exports.onData = onData;

