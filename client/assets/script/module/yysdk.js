function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}

function GetWsUrl() {
    var wsdomain = GetQueryString("websocketdomain");
    if (wsdomain === null) {
        return null;
    }
    var port = GetQueryString("port");
    var sign = GetQueryString("sign");
    var nonstr = GetQueryString("nonstr");
    var timestamp = GetQueryString("timestamp");
    var post_data = GetQueryString("post_data");

    var obj = JSON.parse(post_data);
    var gameid = obj.gameid;
    var roomid = obj.roomid;

    var ws_url = "ws://" + wsdomain + ":" + port + "/" + gameid + "/" + roomid +
        "?nonstr=" + nonstr + "&sign=" + sign +
        "&timestamp=" + timestamp + "&post_data=" + post_data;

    return ws_url;
}

function GetWssUrl() {
    var wsdomain = GetQueryString("websocketdomain");
    if (wsdomain === null) {
        return null;
    }
    var port = GetQueryString("port");
    var sign = GetQueryString("sign");
    var nonstr = GetQueryString("nonstr");
    var timestamp = GetQueryString("timestamp");
    var post_data = GetQueryString("post_data");

    var obj = JSON.parse(post_data);
    var gameid = obj.gameid;
    var roomid = obj.roomid;

    var ws_url = "wss://" + wsdomain + ":" + port + "/" + gameid + "/" + roomid +
        "?nonstr=" + nonstr + "&sign=" + sign +
        "&timestamp=" + timestamp + "&post_data=" + post_data;
    return ws_url;
}

// http://域名/xxx?timestamp=XXX&nonstr=YYY&sign=3jiu7e9o>&post_data=url_encode(请求的jsonbody)
// http://120.78.80.166/test/auth.php?nonstr=jg4g3b0i-7pb0-92y5-mu0ae997nmb6gg3p&
// sign=c7961cc7357f8a991edf5a93daf1e69b2d7c30ab×tamp=1509710152&post_data=%7B%22channelid%22%3A%22guangzhou1%22%2C%22gameid%22%3A%22ninedead%22%2C%22roomid%22%3A%22568bc11c-504c-4be8-9104-0be6b0cc2375%22%2C%22player%22%3A%7B%22uid%22%3A%221830969817%22%2C%22name%22%3A%22mr.yipxx%22%2C%22avatarurl%22%3A%22http%3A%2F%2Fs1.yy.com%2Fguild%2Fheader%2F10001.jpg%22%2C%22teamid%22%3A%221%22%2C%22opt%22%3A%22%22%7D%7D&websocketdomain=xyxng1.yystatic.com&port=10500
// {
//     "channelid":"guangzhou1",
//     "gameid":"ninedead",
//     "roomid":"568bc11c-504c-4be8-9104-0be6b0cc2375",
//     "player":{
//         "uid":"1830969817",
//         "name":"mr.yipxx",
//         "avatarurl":"http://s1.yy.com/guild/header/10001.jpg",
//         "teamid":"1",
//         "opt":""
//     }
// }

// 获取玩家数据
function JYXGetGameData() {
    var data = GetQueryString("post_data")
    return decodeURI(data)
}

// 开始加载游戏
function JYXStartGame() {
    if (window.nativeApp == null || window.nativeApp.onPKLoading == null) {
        return;
    }
    window.nativeApp.onPKLoading('{}');
}

// 游戏加载成功
function JYXFinishLoading() {
    if (window.nativeApp == null || window.nativeApp.onPKFinishLoading == null) {
        return;
    }
    window.nativeApp.onPKFinishLoading('{}');
}

// 游戏加载失败
function JYXLoadFail() {
    if (window.nativeApp == null || window.nativeApp.onPKLoadFail == null) {
        return;
    }
    window.nativeApp.onPKLoadFail('{}');
}

// 游戏开始
function JYXPKStart() {
    if (window.nativeApp == null || window.nativeApp.onPKStart == null) {
        return;
    }
    window.nativeApp.onPKStart('{}');
}

// 游戏结束
function JYXPKFinish(result) {
    if (window.nativeApp != null && window.nativeApp.onPKFinish != null) {
        window.nativeApp.onPKFinish(result);
        return;
    }

    try {
        TZOpen.getResult(result);
    } catch (e) {
    }
}

function JYXInfo(str) {
    if (window.nativeApp == null) {
        return;
    }
    window.nativeApp.logInfo(str);
}

function JYXError(str) {
    if (window.nativeApp == null) {
        return;
    }
    window.nativeApp.logError(str)
}

var YYSDK = {
    GetWsUrl: GetWsUrl,
    GetWssUrl: GetWssUrl,
    JYXStartGame: JYXStartGame,
    JYXFinishLoading: JYXFinishLoading,
    JYXLoadFail: JYXLoadFail,
    JYXPKStart: JYXPKStart,
    JYXPKFinish: JYXPKFinish,
    JYXInfo: JYXInfo,
    JYXError: JYXError,
    getSignData: function () {
        var timestamp = GetQueryString("timestamp");
        var nonstr = GetQueryString("nonstr");
        var sign = GetQueryString("sign");
        var post_data = GetQueryString("post_data");
        if (timestamp && nonstr && sign && post_data) {
            return {
                timestamp: timestamp,
                nonstr: nonstr,
                sign: sign,
                post_data: post_data,
            }
        }
        return null;
    },
    getGameData: function () {
        var userdata = JYXGetGameData();
        if (userdata) {
            try {
                userdata = JSON.parse(userdata);
                return userdata;
            } catch (e) {
                return null;
            }
        }
        return null;
    },
    getRoomId: function () {
        var userdata = this.getGameData();
        if (userdata) {
            return userdata.roomid;
        }
        return 0;
    },
    getPlayer: function () {
        var userdata = this.getGameData();
        if (userdata) {
            return userdata.player;
        }
        return null;
    }
}
exports.YYSDK = YYSDK;