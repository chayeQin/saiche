// 网络
var logger = getLogger("network");
var WebSocket = require("ws");

class network {
    constructor(url) {
        var self = this;

        self._socket = new WebSocket(url);
        self._isConnected = false;
        self._x = 0;

        self._socket.onopen = function () {
            self._isConnected = true;
            logger.info("服务器已连接");
            REPORT.addClient();
            for_caller.s_login_version(self, 1);
        }

        self._socket.onmessage = function (e) {
            REPORT.addRecv();
            var message = e.data;
            PROTOCOL.onMessage(self, message);
        }

        self._socket.onclose = function () {
            self._isConnected = false;
            logger.info("服务器已断开连接");
        };

        self._socket.onerror = function (evt) {
            self._isConnected = false;
            logger.info("服务器链接错误");
        };
    }

    isConnected () {
        return this._isConnected;
    }

    send (data) {
        REPORT.addSend();
        this._socket.send(data);
    }

    getX () {
        return this._x;
    }

    increaseX() {
        this._x += 1;

        if (this._x >= 300) {
            return false;
        }

        return true;
    }
}

exports.network = network;
