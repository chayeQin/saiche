// 赛车游戏
// --------------------------------------------------------------------------------
//var logger = getLogger("racing");
var logger = singleLogger();

var BLOCKS = {
    BLOCK1: 1,
    BLOCK2: 2,
    BLOCK3: 3,
    BLOCK4: 4,
    BLOCK5: 5,
}

var DEFAULT_COUNTDOWN = 3;

class clsRacing {
    constructor(userId, roomId, gameId, channelId) {
        this._countdown = DEFAULT_COUNTDOWN;
        this._roomId = roomId;
        this._ownerId = userId;
        this._opponentId = null;
        this._gameId = gameId;
        this._channelId = channelId;
        this._startTime = 0;
        this._finishTime = 0;
        this._winnerId = null;
    }

    getId() {
        return this._roomId;
    }

    start() {
        if (this._ownerId == 0) return;
        if (!this._opponentId) return;
        if (this._ownerId == this._opponentId) return;
        this._winnerId = null;

        this.syncPlayerData(this._ownerId);
        this.syncPlayerData(this._opponentId);
        this._startTime = new Date().getTime();

        var blockDatas = this.genBlocks();
        // this.syncBlockData(this._ownerId, blockDatas);
        // this.syncBlockData(this._opponentId, blockDatas);
    }

    genBlocks() {
        var blockDatas = [];
        var pos = [-125, -60, 0, 60, 125];
        var distance = [500, 1000, 2000, 3000, 5000];
        for (var i = 0; i < 5; i++) {
            var blockType = i + 1;
            var data = {
                type: blockType,
                x: pos[i],
                y: distance[i],
                speed: 1,
            };
            blockDatas.push(data);
        }
        return blockDatas;
    }

    syncPlayerData(userId) {
        var userObj = USERMGR.getById(userId);
        if (userObj == null) return;
        for_caller.c_racing_start_game(userObj.getVfd(), this._ownerId, this._opponentId);
    }

    syncBlockData(userId, blockDatas) {
        var userObj = USERMGR.getById(userId);
        if (userObj == null) return;
        for_caller.c_racing_block_data(userObj.getVfd(), blockDatas);
    }

    syncGameData(userId, distance, x) {
        var opponentId = this.getOpponentId(userId);
        var userObj = USERMGR.getById(opponentId);
        if (userObj == null) return;
        for_caller.c_racing_sync_data(userObj.getVfd(), distance, x);
    }

    syncResultData(userId, time) {
        var userObj = USERMGR.getById(userId);
        if (userObj == null) return;

        //计算签名
        var timestamp = parseInt(Date.now() / 1000);
        var nonstr = Util.randomString(32);
        var result = {
            gameid: this._gameId,
            roomid: this._roomId,
            channelid: this._channelId,
            resulttype: 'not_draw',
            users: [this._ownerId, this._opponentId],
            winners: [this._winnerId]
        }
        var resultrawdata = JSON.stringify(result);
        var sign = Crypto.sha1(timestamp + nonstr + resultrawdata + APPKEY);
        var cbResult = {
            timestamp: timestamp,
            nonstr: nonstr,
            sign: sign,
            result: result,
            resultrawdata: resultrawdata,
        }
        logger.info('提供给yy的数据')
        logger.info(JSON.stringify(cbResult));
        for_caller.c_racing_finish_game(userObj.getVfd(), this._winnerId, time, JSON.stringify(cbResult));
    }

    isWaiting() {
        return !this._opponentId;
    }

    isRunning() {
        if (this._opponentId == null) return false;
        return this._winnerId == null ? true : false;
    }

    inRoom(userId) {
        return this._ownerId === userId || this._opponentId === userId;
    }

    join(userId) {
        if (this._opponentId > 0) return;
        if (userId == this._ownerId) return;
        this._opponentId = userId;
    }

    getOpponentId(userId) {
        if (userId == this._ownerId) {
            return this._opponentId;
        }
        return this._ownerId;
    }

    finish(userId) {
        logger.debug('winnerId->' + this._winnerId);
        if (this._winnerId) {
            return;
        }
        this._finishTime = new Date().getTime();
        this._winnerId = userId;
        var opponentId = this.getOpponentId(userId);
        var time = this._finishTime - this._startTime;
        this.syncResultData(userId, time);
        this.syncResultData(opponentId, time);
    }
}

exports.clsRacing = clsRacing;
