global.Util = require('./util/util.js')
require("./base/logger")
require("./base/callout")

// require("./base/network2")

// 协议部分
global.PROTOCOL = require("./base/protocol")
PROTOCOL.initProtocols();

// 网络部分
var PORT = Util.getPort();
var network = require("./base/network_ws");
global.NETWORK = new network.network(PORT);

require("./base/modulelist")
global.Crypto = require('./util/crypto.js')

global.APPKEY = '71lUO4aVbZbmcXOYiHUM31xdWiqc5LJg'

/*
NETWORK.onCloseClient = function (client) {
    var vfd = client.id;
    var userObj = USERMGR.getByVfd(vfd);
    if (userObj == null) return;
    USERMGR.removeUserObj(userObj);
}
*/
