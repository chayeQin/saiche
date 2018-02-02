//var logger = getLogger("user");
var logger = singleLogger();

var nextUserId = 0;
var onlineCount = 0;

function getNextUserId() {
    nextUserId += 1;
    return nextUserId;
}

// 在线玩家列表，以vfd做key
var userTbl = {}
function addUserObj(userObj) {
    var vfd = userObj.getVfd();
    if (userTbl[vfd]) {
        logger.error("Repeat addUserObj, vfd=%s,userId=%d", vfd, userObj.getId());
        return;
    }

    userTbl[vfd] = userObj;
    onlineCount += 1;
    logger.info("Add user, vfd=%s,userId=%d", vfd, userObj.getId());
}

function removeUserObj(userObj) {
    var vfd = userObj.getVfd();
    if (userTbl[vfd]) {
        delete userTbl[vfd];
        onlineCount -= 1;
        logger.info("Remove user, vfd=%s,userId=%d", vfd, userObj.getId());
    }
}

function hasUserObj(vfd) {
    return getByVfd(vfd);
}

function getByVfd(vfd) {
    return userTbl[vfd];
}

function getById(userId) {
    var userObj = null;
    Object.keys(userTbl).forEach(function(vfd) {
        var _userObj = userTbl[vfd];
        if (_userObj.getId() == userId) {
            userObj = _userObj;
        }
    });
    return userObj;
}

// --------------------------------------------------------------------------------
for_maker.s_user_heartbeat = function(vfd) {
    var userObj = USERMGR.getByVfd(vfd);
    if (userObj === null) return;
    userObj.setVar("HEARTBEAT_TIME", new Date().getTime());
}

exports.getNextUserId = getNextUserId;
exports.addUserObj = addUserObj;
exports.removeUserObj = removeUserObj;
exports.hasUserObj = hasUserObj;
exports.getByVfd = getByVfd;
exports.getById = getById;

