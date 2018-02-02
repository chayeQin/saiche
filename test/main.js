require("./logger")
global.PROTOCOL = require("./protocol")
global.NETWORK = require("./network")
global.REPORT = require("./report")

PROTOCOL.initProtocols();

// var url = "ws://127.0.0.1:10020";
var url = "ws://39.108.173.10:10020";

var CLIENT_MAX = 10000;
var INTERVAL = 50;
var count = 0;

function newClient() {
    count += 1;
    var network = new NETWORK.network(url);

    if (count < CLIENT_MAX) {
        setTimeout(newClient, INTERVAL);
    }
}

setTimeout(newClient, INTERVAL);

