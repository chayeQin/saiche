// 登录模块
var clsLoginUser = require("../object/user/loginuser")

var loginList = {}
var loginCount = 0
//var logger = getLogger("login");
var logger = singleLogger();

function loginCheckIp(vfd) {
    return true
}

function signCheck(vfd, timstamp, nonstr, postData, sign) {
    var signStr = timstamp + nonstr + postData + APPKEY;
    logger.info('signStr' + signStr);
    var checkSign = Crypto.sha1(signStr);
    logger.info("sign result:" + checkSign);
    if (checkSign == sign) {
        return true;
    }
    return false;
}

function newLogin(vfd) {
    if (loginList[vfd]) {
        logger.error("Duplicate loginuser, vfd=%s", vfd);
        return;
    }
    var loginUser = new clsLoginUser(vfd);
    loginList[vfd] = loginUser;
    loginCount = loginCount + 1;
    logger.info("New login user, vfd=%s,totalLogin=%d", vfd, loginCount);
    return loginUser;
}

function removeLogin(vfd, why) {
    var loginUser = getLoginUser(vfd);
    if (loginUser) {
        loginCount = loginCount - 1;
        loginList[vfd] = null;
        logger.info("Remove login user, vfd=%s,why=%s,totalLogin=%d", vfd, why, LoginCount);
    }
    // NETWORK.closeClient(vfd);
}

function getLoginUser(vfd) {
    return loginList[vfd];
}

function tryEnterGame(vfd, loginUser) {
    enterGame(loginUser);
}

function enterGame(loginUser) {
    var vfd = loginUser.getVfd();
    NETWORK.setLogined(vfd);

    if (loginUser.getNewBirth()) {
        createNewUser(vfd);
        return;
    }

}

function createNewUser(vfd) {
    var loginUser = getLoginUser(vfd);
    if (!loginUser) {
        removeLogin(vfd, "No loginUser");
        return;
    }

    var userId = loginUser.getId();
    var userName = loginUser.getName();
    logger.info("createNewUser, vfd=%s,userId=%d,userName=%s", vfd, userId, userName);

    var OCI = {"id": userId, "name": userName};
    var userObj = new USER.clsUser(vfd, OCI);
    userObj.onCreateNewUser();
    userObj.restore()

}

// 协议绑定
// --------------------------------------------------------------------------------
for_maker.s_login_version = function (vfd, version) {
    // 检查该ip是否允许登录
    if (loginCheckIp(vfd) == false) return;

    var loginUser = newLogin(vfd)
    if (!loginUser) return;

    // TODO 这里最好比对一下服务器和客户端的版本
    loginUser.setState("ACCOUNT");

    for_caller.c_login_version(vfd, true);
}

for_maker.s_login_sign_check = function (vfd, timstamp, nonstr, postData, sign) {
    var signOk = signCheck(vfd, timstamp, nonstr, postData, sign);

    for_caller.c_login_sign_check(vfd, signOk);
}

for_maker.s_login_player_create = function (vfd, name, userId) {
    var loginUser = getLoginUser(vfd);
    if (!loginUser) {
        removeLogin(vfd, "No loginUser");
        return
    }
    logger.info("Add new user, vfd=%s,name=%s", vfd, name);

    if (USERMGR.hasUserObj(vfd)) {
        return;
    }

    loginUser.setState("PLAYER_ENTER_OR_ADD");
    loginUser.setId()
    // loginUser.setIp(NETWORK.getIpByVfd(vfd));
    loginUser.setNewBirth(true);

    // TODO 校验名字的合法性
    if (userId != "0") {
        loginUser.setId(userId)
    } else {
        userId = "" + USERMGR.getNextUserId()
    }
    console.assert(userId);

    loginUser.setId(userId);
    loginUser.setName(name);

    // TODO 记录名字已经被使用

    for_caller.c_login_player_create(vfd, userId)
}

for_maker.s_login_player_enter = function (vfd, userId) {
    var loginUser = getLoginUser(vfd);
    if (!loginUser) {
        removeLogin(vfd, "No loginUser");
        return
    }

    loginUser.setId(userId);
    tryEnterGame(vfd, loginUser)
}

