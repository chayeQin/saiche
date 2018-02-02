exports.randomString = function(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var nonceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        nonceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return nonceStr;
}

exports.getPort = function() {
    var port = 10020;
    if (process.env.PORT) {
        port = process.env.PORT;
    } else {
        var arg = process.argv;
        if (arg.length == 3) {
            port = process.argv.slice(2);
        }
    }
    return port;
}

exports.getId = function() {
    if (process.env.ID) {
        return process.env.ID;
    }
    return "";
}

exports.getLevel = function() {
    if (process.env.LEVEL) {
        return process.env.LEVEL;
    }
    return "info";
}