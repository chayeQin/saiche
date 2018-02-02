// 玩家对象

class clsChar {
    constructor(OCI) {
        this.__data = {};
        this._bindVarFunc();
        this.onCreate(OCI);
    }

    onCreate(OCI) {
        this.setId(OCI.id);
        this.setName(OCI.name);
    }

    getVar(key) {
        return this.__data[key];
    }

    setVar(key, value) {
        this.__data[key] = value;
    }

    _getBindVars() {
        return ["id", "name"];
    }

    _bindVarFunc() {
        var bindVars = this._getBindVars();
        for (var i = 0; i < bindVars.length; i ++) {
            var bindVarName = bindVars[i];
            var bindFuncName = bindVarName.slice(0, 1).toUpperCase() +bindVarName.slice(1);

            // 这写法有点蛋疼
            (function(obj) {
                // 创建此属性的一个新的getter(读取器)
                (function(bindVarName) {
                    obj["get" + bindFuncName] = function() {
                        return this.getVar(bindVarName);
                    }
                    // 创建此属性的一个新的setter(设置器)
                    obj["set" + bindFuncName] = function(value) {
                        this.setVar(bindVarName, value);
                    };
                })(bindVarName);
            })(this);
        }
    }

    destroy() {
        CALLOUT.removeAll(this);
    }
}

exports.clsChar = clsChar;

