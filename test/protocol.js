var protobuf = require("protobufjs");
var base64 = protobuf.util.base64;
var fs = require("fs");
var logger = getLogger("network");


// 上行协议全局变量
var for_maker = {}
// 下行协议全局变量
var for_caller = {}

global.for_maker = for_maker;
global.for_caller = for_caller;

require("./binding");


// 配置只需要这4种数据类型
var protocolInfos = {};

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
function parseProtocol(filedata) {
    // logger.info("parse filedata:", filedata);
    var result = protobuf.parse(filedata);
    var packageName = result.package;
    // logger.info("parse package:", packageName);

    var objects = result.root.lookup(packageName).toJSON();
    Object.keys(objects.nested).forEach(function (protocolName) {
        var protocol = result.root.lookup(packageName + "." + protocolName);
        // logger.info(" | protocol:", protocolName);

        var map = {
            "protocol": protocol, // 协议数据
            "packageName": packageName, // 协议package名
            "fieldNames": [] // 协议参数列表
        };
        protocolInfos[protocolName] = map;

        Object.keys(protocol.fields).forEach(function (fieldName) {
            // logger.info(" |-- field:", fieldName);
            protocolInfos[protocolName]["fieldNames"].push(fieldName);
        });

        // 封装协议函数
        if (protocolName.startsWith("s_")) {
            // logger.info("init protocol:", protocolName);
            // 下行协议for_caller封装
            for_caller[protocolName] = function (client, ...args) {
                if (client.isConnected() == false) {
                    logger.info("> 连接已断开");
                    return;
                }
                console.assert(args.length == map.fieldNames.length);

                // 创建协议参数数据结构
                var data = {};
                for (var i = 0; i < map.fieldNames.length; i++) {
                    var argName = map.fieldNames[i];
                    data[argName] = args[i];
                }
                // logger.info("> " + protocolName + ": " + JSON.stringify(data));

                // Protobuf编码
                var buffer = map.protocol.encode(data).finish();
                // Base64编码之后发送出去
                var message = protocolName + "|" + base64.encode(buffer, 0, buffer.length);
                client.send(message);
            }
        }
    });
}

function onMessage(client, message) {
    // console.log("received: %s", message);
    var datas = message.split("|");
    if (datas.length != 2) return;

    // 查找for_maker函数
    var protocolName = datas[0];
    if (for_maker[protocolName] == null) return;

    var map = protocolInfos[protocolName];
    var data = datas[1];
    var decodeArray = new Uint8Array(base64.length(data));
    base64.decode(data, decodeArray, 0);
    var args = map.protocol.decode(decodeArray);

    // logger.info("> " + protocolName + ": " + JSON.stringify(args));

    var argValues = ["client"];
    for (var i = 0; i < map.fieldNames.length; i++) {
        var argName = map.fieldNames[i];
        argValues.push("args." + argName);
    }
    var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
    eval(code);
}

// 初始化协议
var isProtocolInited = false;
var PROTOCOL_PATH = "./protocol";
function initProtocols() {
    if (isProtocolInited) return;
    isProtocolInited = true;

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
exports.initProtocols = initProtocols;
exports.onMessage = onMessage;

