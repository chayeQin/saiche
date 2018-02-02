// UTIL模块
// --------------------------------------------------------------------------------
// var seedrandom = require("seedrandom");
// current no install.
// npm install seedrandom --save
exports.randInt = function (min, max) {
    var range = max - min;
    // var rng = seedrandom();
    // var rand = rng();
    var rand = Math.random();
    return (min + Math.round(rand * range));
}

exports.inRange = function (randNum, rangeDatas) {
    // 查看randNum落在哪个区间
    // i.e: 0-10, 11-20, 20-
    // rangeDatas: [
    //  {"limit": 10},
    //  {"limit": 20},
    //  {},
    //  ]

    for (var index in rangeDatas) {
        var data = rangeDatas[index];
        var limit = data.limit;
        if (limit !== null && randNum < limit) {
            return index
        }
    }

    return rangeDatas.length - 1;
}

exports.randRange = function (infos, key = "limit", randMax = null) {
    var rangeDatas = [];
    var total = 0;

    Object.keys(infos).forEach(function(id) {
        var info = infos[id];
        let limit = info[key];
        total += limit;
        var rangeData = {"limit": total, "info": info};
        rangeDatas.push(rangeData);
    });

    total = (randMax !== null) ? randMax : total;
    var randNum = UTIL.randInt(0, total);
    var index = UTIL.inRange(randNum, rangeDatas);
    var rangeData = rangeDatas[index];

    return rangeData.info
}