// 网络
var logger = getLogger("network");
var WebSocket = require("ws");

class network {
    constructor(port) {
        var self = this;
        this._isConnected = false;
        this._loginedVfds = {};

        this.server = new WebSocket.Server({port: port});
        this.server.on("connection", function (client) {
            // logger.info(server.clients);
            // logger.info(client._ultron.id);
            // logger.info(server.clients.Set.WebSocket._ultron);

            client.on("message", function (message) {
                logger.debug("received: %s", message);

                var datas = message.split("|");
                if (datas.length != 2) return;

                var vfd = client._ultron.id;
                var protocolName = datas[0];
                var data = datas[1];

                if (self._loginedVfds[vfd] == null && PROTOCOL.isNoLoginProtocol(protocolName) == false) return;

                PROTOCOL.onData(vfd, protocolName, data);
            });

            client.on("error", function (error) {
                logger.error("连接出错或断开" + error);
                var vfd = client._ultron.id;
                var userObj = USERMGR.getByVfd(vfd);
                if (userObj == null) return;
                userObj.logout();
            });
        });
    }

    isConnected () {
        return this._isConnected;
    }

    send (vfd, protocolName, data) {
        var client = this.getClient(vfd);
        var message = protocolName + "|" + data;
        client.send(message);
    }

    getClient (vfd) {
        var client = null;
        this.server.clients.forEach(function each(_client) {
            if (client == null && _client._ultron.id == vfd) {
                client = _client;
            }
        });
        return client;
    }

    closeClient (vfd) {
        var socket = this.getClient(vfd);
        if (socket) {
            socket.close();
        }

        this._loginedVfds[vfd] = null;

        var userObj = USERMGR.getByVfd(vfd);
        if (userObj == null) return;

        userObj.logout();

        /*
        if (NETWORK.onCloseClient) {
            NETWORK.onCloseClient(socket);
        }
        */
    }

    setLogined (vfd) {
        this._loginedVfds[vfd] = true;
    }

    hasVfd (vfd) {
        var socket = this.getClient(vfd);
        return (socket !== null) ? true : false;
    }
}

exports.network = network;

