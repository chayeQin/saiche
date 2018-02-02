(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/module/binding.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '810d4fbZ1dJoaw72eQW5umt', 'binding', __filename);
// script/module/binding.js

"use strict";

// 协议捆绑
// --------------------------------------------------------------------------------
// 登录协议
for_maker.c_hello = function (hello) {
    // for_caller.s_login_version(1);
};

for_maker.c_login_version = function (versionOk) {
    var player = YYSDK.getPlayer();
    console.log(player);
    if (player) {
        for_caller.s_login_player_create(player.name, player.uid);
    } else {
        for_caller.s_login_player_create("测试玩家", "0");
    }
};

for_maker.c_login_sign_check = function (signOk) {
    if (!signOk) {
        //TODO 签名验证失败
    }
    var player = YYSDK.getPlayer();
    if (player) {
        for_caller.s_login_player_create(player.name, player.uid);
    }
};

for_maker.c_login_player_create = function (userId) {
    for_caller.s_login_player_enter(userId);
    cc.director.emit("ENTER", { "heroId": userId });
};

// 玩家协议
for_maker.c_user = function (oci) {
    // 无平台传test
    var gameData = YYSDK.getGameData();
    if (gameData) {
        for_caller.s_racing_start_game(gameData.roomid, gameData.gameid, gameData.channelid);
    } else {
        //测试
        for_caller.s_racing_start_game(TEST_ROOM_ID, "saiche", "test");
    }
    var signData = YYSDK.getSignData();
    if (signData) {
        for_caller.s_login_sign_check(signData.timestamp, signData.nonstr, signData.post_data, signData.sign);
    } else {
        for_caller.s_login_player_create("测试玩家", "0");
    }

    // for_maker.c_racing_start_game(oci.userid+ "", oci.userid+1 + "")
};

// 游戏协议
for_maker.c_racing_start_game = function (ownerId, opponentId) {
    console.log("c_racing_start_game", ownerId, opponentId);
    cc.director.emit("START", { "ownerId": ownerId, "opponentId": opponentId });
};

for_maker.c_racing_sync_data = function (distance, x) {
    cc.director.emit("RACE", { "distance": distance, "x": x });
};

for_maker.c_racing_block_data = function (blockDatas) {
    cc.director.emit("BLOCK", { "blockDatas": blockDatas });
};

for_maker.c_racing_finish_game = function (winnerId, time, result) {
    cc.director.emit("RESULT", { "winnerId": winnerId, "time": time, "result": result });
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=binding.js.map
        