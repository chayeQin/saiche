var log4js = require("log4js");

log4js.configure({
    appenders: [{
        "type": "console",
        "layout": {
            "type": "pattern",
            "pattern": "%m"
        }
    },]
});

var logPath = 'logs/';

var logList = [];
const LEVEL = {
    ALL: "ALL",
    FATAL: "FATAL",
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    DEBUG: "DEBUG",
    TRACE: "TRACE",
    OFF: "OFF",
}
var getLogger = function (name, level) {
    var logger = logList[name]
    if (logger) {
        logger.setLevel(getLevel(level));
        return logger;
    }
    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file(logPath + "/" + name + ".log"), name);
    logger = log4js.getLogger(name);
    logList[name] = logger;
    logger.setLevel(getLevel(level));
    return logger;
}

function getLevel(level) {
    return LEVEL[level] ? LEVEL[leve] : LEVEL.INFO;
}

global.getLogger = getLogger;
