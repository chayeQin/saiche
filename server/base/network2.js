var protobuf = require("protobufjs");
var base64 = protobuf.util.base64;
var fs = require("fs");
//var logger = getLogger("network");
var logger = singleLogger();

//启动脚本使用 npm start [port]
//日志独立开在logs下的对应端口号下

var PORT = Util.getPort();
logger.info("启动端口:" + PORT);

// 上行协议全局变量
var for_maker = {};
// 下行协议全局变量
var for_caller = {};

var noLoginProtocols = {
    ["s_login_version"]: true,
    ["s_login_player_create"]: true,
    ["s_login_player_enter"]: true,
};

var loginedVfds = {};

var PROTOCOL_PATH = "protocol";

// 创建WebSocket对象
var WebSocket = require("ws");
var server = new WebSocket.Server({port: PORT});

// 配置只需要这4种数据类型
var protocolInfos = {};

function dirProtocols(path) {
    var files = [];
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item) {
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

function getClientByVfd(vfd) {
    var client = null;
    server.clients.forEach(function each(_client) {
        if (client == null && _client._ultron.id == vfd) {
            client = _client;
        }
    });
    return client;
}

// 分析协议文件
function parseProtocol(filedata) {
    var result = protobuf.parse(filedata);
    var packageName = result.package;
    logger.debug("parse package:", packageName);

    var objects = result.root.lookup(packageName).toJSON();
    Object.keys(objects.nested).forEach(function(protocolName) {
        var protocol = result.root.lookup(packageName + "." + protocolName);
        logger.debug(" | protocol:", protocolName);

        var map = {
            "protocol": protocol, // 协议数据
            "packageName": packageName, // 协议package名
            "fieldNames": [] // 协议参数列表
        };
        protocolInfos[protocolName] = map;

        Object.keys(protocol.fields).forEach(function(fieldName) {
            logger.debug(" |-- field:", fieldName);
            protocolInfos[protocolName]["fieldNames"].push(fieldName);
        });

        // 封装协议函数
        if (protocolName.startsWith("c_")) {
            logger.debug("init protocol:", protocolName);
            // 下行协议for_caller封装
            for_caller[protocolName] = function(vfd,...args
        )
            {
                console.assert(args.length == map.fieldNames.length);
                var client = getClientByVfd(vfd);
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
                var message = protocolName + "|" + base64.encode(buffer, 0, buffer.length);
                client.send(message);
            }
        }
    });
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

initProtocols();

server.on("connection", function(client) {
    // logger.info(server.clients);
    // logger.info(client._ultron.id);
    // logger.info(server.clients.Set.WebSocket._ultron);

    client.on("message", function(message) {
        // console.log("received: %s", message);
        var vfd = client._ultron.id;
        var datas = message.split("|");
        if (datas.length != 2) return;

        // 查找for_maker函数
        var protocolName = datas[0];
        if (for_maker[protocolName]) {
            var map = protocolInfos[protocolName];
            var data = datas[1];
            // console.log("kering -> data:", data);
            var decodeArray = new Uint8Array(base64.length(data));
            base64.decode(data, decodeArray, 0);
            var args = map.protocol.decode(decodeArray);
            // console.log("kering -> args:", args);

            logger.debug("> " + protocolName + ": " + JSON.stringify(args));

            var argValues = ["vfd"];
            for (var i = 0; i < map.fieldNames.length; i++) {
                var argName = map.fieldNames[i];
                argValues.push("args." + argName);
            }
            var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
            // logger.info("kering -> code:", code);
            eval(code);
        }
    });

    client.on("error", function(error) {
        logger.error("连接出错或断开" + error);
        var vfd = client._ultron.id;
        var userObj = USERMGR.getByVfd(vfd);
        if (userObj == null) return;
        USERMGR.removeUserObj(userObj);
    });
});

// --------------------------------------------------------------------------------
var NETWORK = {
    getIpByVfd: function(vfd) {
        var socket = getClientByVfd(vfd);
        if (socket) {
            // return socket.handshake.address || socket.handshake.headers['x-forwarded-for'];
            return "";
        }
        return null;
    },
    closeClient: function(vfd) {
        var socket = getClientByVfd(vfd);
        if (socket) {
            socket.disconnect(true);
        }
        loginedVfds[vfd] = null;

        if (NETWORK.onCloseClient) {
            NETWORK.onCloseClient(socket);
        }
    },
    setLogined: function(vfd) {
        loginedVfds[vfd] = true;
    },
    hasVfd: function(vfd) {
        var socket = getClientByVfd(vfd);
        return (socket !== null) ? true : false;
    },
}

global.for_maker = for_maker;
global.for_caller = for_caller;

global.NETWORK = NETWORK;

