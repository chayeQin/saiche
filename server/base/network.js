var protobuf = require("protobufjs");
var base64 = protobuf.util.base64;
var fs = require("fs");
var logger = getLogger("network");

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

// 创建SocketIO对象
var server = require("socket.io")();

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
            for_caller[protocolName] = function (vfd, ...args)
            {
                console.assert(args.length == map.fieldNames.length);
                var client = server.sockets.sockets[vfd];
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
                logger.info("> " + protocolName + ": " + JSON.stringify(data));
                // Protobuf编码
                var buffer = map.protocol.encode(data).finish();
                // Base64编码之后发送出去
                client.emit(protocolName, base64.encode(buffer, 0, buffer.length));
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

server.on("connection", function (client) {
    //logger.info(client.id);
    //logger.info(server.sockets.sockets[client.id]);
    logger.info("connected");
    // e.g.
    // for_caller.c_example(client.id, "中文", 1234, new Date().getTime(), true);
    // for_caller.c_nested_example(client.id, {stringValue: "string", int32Value: 32, int64Value: 64, boolValue: false});
    // for_caller.c_hello(client.id, "ok");

    Object.keys(protocolInfos).forEach(function (protocolName) {
        var map = protocolInfos[protocolName];
        // 上行协议for_maker封装
        if (protocolName.startsWith("s_")) {
            logger.debug("init protocol:", protocolName);
            // 监听协议事件
            client.on(protocolName, function (data) {
                var vfd = client.id;
                if (loginedVfds[vfd] || noLoginProtocols[protocolName]) {
                    // Base64解码
                    var decodeArray = new Uint8Array(base64.length(data));
                    base64.decode(data, decodeArray, 0);
                    var data = map.protocol.decode(decodeArray);

                    logger.info("> " + protocolName + ": " + JSON.stringify(data));
                    // 查找for_maker函数
                    if (for_maker[protocolName]) {
                        var argValues = ["vfd"];
                        for (var i = 0; i < map.fieldNames.length; i++) {
                            var argName = map.fieldNames[i];
                            argValues.push("data." + argName);
                        }
                        var code = "for_maker[protocolName](" + argValues.join(", ") + ");";
                        eval(code);
                    }
                }
            });
        }
    });

    client.on("disconnect", function () {
        if (NETWORK.onCloseClient) {
            NETWORK.onCloseClient(this);
        }
    });
});


server.listen(PORT);

var NETWORK = {
    getIpByVfd: function (vfd) {
        var socket = server.sockets.sockets[vfd];
        if (socket) {
            return socket.handshake.address || socket.handshake.headers['x-forwarded-for'];
        }
        return null;
    },
    closeClient: function (vfd) {
        var socket = server.sockets.sockets[vfd];
        if (socket) {
            socket.disconnect(true);
        }
        loginedVfds[vfd] = null;

        if (NETWORK.onCloseClient) {
            NETWORK.onCloseClient(socket);
        }
    },
    setLogined: function (vfd) {
        loginedVfds[vfd] = true;
    },
    hasVfd: function (vfd) {
        var socket = server.sockets.sockets[vfd];
        return (socket !== null) ? true : false;
    },
}

global.for_maker = for_maker;
global.for_caller = for_caller;

global.NETWORK = NETWORK;

