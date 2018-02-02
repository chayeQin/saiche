// 协议捆绑
var logger = getLogger("network");

// --------------------------------------------------------------------------------
// 登录协议
for_maker.c_hello = function (client, hello) {
    console.log("c_hello, ", hello);
}

for_maker.c_login_version = function (client, versionOk) {
    for_caller.s_login_player_create(client, "玩家", "0");
}

for_maker.c_login_sign_check = function (client, signOk) {
    console.log("c_login_sign_check, ", signOk);
}

for_maker.c_login_player_create = function (client, userId) {
    for_caller.s_login_player_enter(client, userId);
}

// 玩家协议
for_maker.c_user = function (client, oci) {
    console.log("[INFO]玩家", oci.userid, "已成功登入");
    for_caller.s_racing_start_game(client, "", "saiche", "test");
}

// 游戏协议
for_maker.c_racing_start_game = function (client, ownerId, opponentId) {
    console.log("[INFO]玩家[" + ownerId + "]与[" + opponentId + "]开始游戏");
    var delay = 100;
    var _run = function() {
        if (client.increaseX()) {
            for_caller.s_racing_sync_data(client, client.getX(), 0);
            setTimeout(_run, delay);
        } else {
            for_caller.s_racing_finish_game(client);
        }
    }
    setTimeout(_run, delay);
}

for_maker.c_racing_sync_data = function (client, distance, x) {
}

for_maker.c_racing_block_data = function (client, blockDatas) {
}

for_maker.c_racing_finish_game = function (client, winnerId, time, result) {
    logger.info("结束游戏，胜方:", winnerId, "时间", time);
    REPORT.addFinish();
    REPORT.report();
}
