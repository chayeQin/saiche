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

var id = Util.getId();
var default_level = Util.getLevel();
var logPath = '/data/yy/log/xyx_saiche_d/xyx_saiche_' + id;

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
var getLogger = function(name, level) {
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

var singleLogger = function(level) {
    log4js.loadAppender('dateFile');
    log4js.addAppender(log4js.appenders.dateFile(logPath + "/info.log", "-yyyy-MM-dd-hh" + ".log"), "log_date");
    var logger = log4js.getLogger("log_date");
    logger.setLevel(getLevel(level));
    return logger;
}

function getLevel(level) {
    if (default_level) {
        return default_level;
    } else {
        return LEVEL[level] ? LEVEL[leve] : LEVEL.INFO;
    }
}

global.getLogger = getLogger;
global.singleLogger = singleLogger;