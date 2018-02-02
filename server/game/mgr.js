// 赛车游戏管理
// --------------------------------------------------------------------------------

var allRooms = {};

function getRoom(userId) {
    var roomIds = Object.keys(allRooms);
    for (var i = 0; i < roomIds.length; i++) {
        var roomObj = allRooms[roomIds[i]];
        if (roomObj && roomObj.inRoom(userId)) {
            return roomObj;
        }
    }
    return null;
}

function getWaitingRoom() {
    var roomIds = Object.keys(allRooms);
    for (var i = 0; i < roomIds.length; i++) {
        var roomObj = allRooms[roomIds[i]];
        if (roomObj && roomObj.isWaiting()) {
            return roomObj;
        }
    }
    return null;
}

function startGame(userObj, platformRoomId, gameId, channelId) {
    if (userObj === null) return;
    var userId = userObj.getId();

    // 先处理平台
    if (platformRoomId != "") {
        var roomObj = allRooms[platformRoomId]
        if (roomObj != null) {
            roomObj.join(userId);
            roomObj.start();
            return;
        }

        // 新建房间
        var roomObj = new RACING.clsRacing(userId, platformRoomId, gameId, channelId);
        allRooms[platformRoomId] = roomObj;
        return;
    }

    // 无平台处理方式
    var existRoomObj = getRoom(userId);
    if (existRoomObj != null) return;

    // 先找有没有创建好的房间
    var waitingRoomObj = getWaitingRoom();
    if (waitingRoomObj != null) {
        waitingRoomObj.join(userId);
        waitingRoomObj.start();
        return;
    }

    // 新建房间，以userId为roomId
    var roomObj = new RACING.clsRacing(userId, userId, gameId, channelId);
    allRooms[userId] = roomObj;
}

function finishGame(userId) {
    if (userId == null) return;

    var roomObj = getRoom(userId);
    if (roomObj == null) return;

    roomObj.finish(userId);

    var roomId = roomObj.getId();
    if (allRooms[roomId] !== null) {
        allRooms[roomId] = null
    }
}

function removeUser(userId) {
    if (userId == null) return;

    var roomObj = getRoom(userId);
    if (roomObj == null) return;

    var opponentId = roomObj.getOpponentId(userId);

    if (roomObj.isRunning()) {
        finishGame(opponentId);
    }

    var roomId = roomObj.getId();
    if (allRooms[roomId] !== null) {
        allRooms[roomId] = null
    }

    // if (opponentObj != null) {
        // console.log("重新创建房间");
        // startGame(userObj);
    // }
}

// --------------------------------------------------------------------------------
for_maker.s_racing_start_game = function (vfd, platformRoomId, gameId, channelId) {
    var userObj = USERMGR.getByVfd(vfd);
    if (userObj == null) return;
    userObj.updateOpTime();
    startGame(userObj, platformRoomId, gameId, channelId);
}

for_maker.s_racing_sync_data = function (vfd, distance, x) {
    var userObj = USERMGR.getByVfd(vfd);
    if (userObj == null) return;

    userObj.updateOpTime();
    var userId = userObj.getId();
    var roomObj = getRoom(userId);
    if (roomObj == null) return;

    roomObj.syncGameData(userId, distance, x);
}

for_maker.s_racing_finish_game = function (vfd) {
    var userObj = USERMGR.getByVfd(vfd);
    if (userObj == null) return;

    userObj.updateOpTime();
    finishGame(userObj.getId());
}

exports.removeUser = removeUser;
