// 定时器模块
function addTimer(type, obj, timmer) {
    var allTimers = obj["__allTimers"];
    if (typeof(allTimers) == "undefined") {
        allTimers = [];
        obj["__allTimers"] = allTimers;
    }
    return allTimers.push({"type": type, "timmer": timmer});
}

function objCallFre(obj, func, freqency, ...args) {
    var interval = setInterval(function() {
        func(...args);
    }, freqency);
    addTimer("INTERVAL", obj, interval);
    return interval;
}

function objCallOut(obj, func, delay, ...args) {
    var timeout = setTimeout(function() {
        func(...args);
    }, delay);
    addTimer("TIMEOUT", obj, timeout);
    return timeout;
}

function remove(obj, timmer) {
    var allTimers = obj["__allTimers"];
    if (allTimers) {
        var position = allTimers.indexOf(timmer)
        if (position >= 0) {
            timmer.unref();
            allTimers.splice(position, 1);
        }
    }
}

function removeAll(obj) {
    var allTimers = obj["__allTimers"];
    if (allTimers) {
        for (var position = 0; position < allTimers.length; position ++) {
            var timmerData = allTimers[position];
            var type = timmerData.type;
            var timmer = timmerData.timmer;
            if (timmerData.type == "INTERVAL") {
                clearInterval(timmer);
            } else {
                clearTimeout(timmer);
            }
            // timmer.unref();
        }
        obj["__allTimers"] = null;
    }
}

var CALLOUT = {
    "objCallFre": objCallFre,
    "objCallOut": objCallOut,
    "remove": remove,
    "removeAll": removeAll
}

global.CALLOUT = CALLOUT;

