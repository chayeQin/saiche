var logger = getLogger("report");

var clientCount = 0;
var sendCount = 0;
var recvCount = 0;
var finishCount = 0;

function addClient () {
    clientCount += 1;
}

function addSend () {
    sendCount += 1;
}

function addRecv () {
    recvCount += 1;
}

function addFinish () {
    finishCount += 1;
}

function report () {
    if (clientCount != finishCount) return;

    logger.info("压测报告:");
    logger.info("----------------------------------------");
    logger.info("创建连接:", clientCount);
    logger.info("移动发送:", sendCount);
    logger.info("移动接受:", recvCount);
    logger.info("游戏结束:", finishCount);
    logger.info("\r");
}

exports.addClient = addClient;
exports.addSend = addSend;
exports.addRecv = addRecv;
exports.addFinish = addFinish;
exports.report = report;

