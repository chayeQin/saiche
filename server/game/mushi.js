// 木虱游戏
// --------------------------------------------------------------------------------
var GAME_STATE = {
    NONE: 0,
    SHUFFLE: 1,
    DEAL: 2,
    ADDUP: 3,
}

var DEFAULT_ADDUP_COUNTDOWN = 6;

class clsMushi {
    constructor() {
        this._state = GAME_STATE.NONE;
        this._inturnIndex = 0;
        this._countdown = DEFAULT_ADDUP_COUNTDOWN;
        this._cardIndexs = [];
        this._players = [];
        this._playerCardIndexs = [];
    }

    start() {
        var playerTotal = this._players.length;
        for (var index = 0; index < playerTotal; index ++) {
            this._playerCardIndexs[index] = [];
        }
    }

    shuffle() {
        this._state = GAME_STATE.SHUFFLE;
        var array = new Array(total);
        array[0] = 0;
        for (var i = 1; i < total; i ++) {
            var rand = Math.floor(Math.random() * (i + 1));
            array[i] = array[rand];
            array[rand] = i;
        }
        for (var i = 1; i < total; i ++) {
            array[i] += 1;
        }
        this._cardIndexs = array;
    }

    deal() {
    }

    parse() {
    }

    addup() {
    }
}

