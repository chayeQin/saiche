"use strict";
cc._RF.push(module, '18fc9oOvg1GnIDnJWJ9GRJC', 'block');
// script/game/block.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var clsBlock = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _type: 0,
        _x: 0,
        _y: 0,
        _speed: 0,
        _horizonSpeed: 0,
        heroCarScript: null,

        audioCollision: {
            type: cc.AudioSource,
            default: null
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    getType: function getType() {
        return this._type;
    },
    setType: function setType(value) {
        this._type = value;
    },
    getX: function getX() {
        return this._x;
    },
    setX: function setX(value) {
        this._x = value;
    },
    getY: function getY() {
        return this._y;
    },
    setY: function setY(value) {
        this._y = value;
    },
    getSpeed: function getSpeed() {
        return this._speed;
    },
    setSpeed: function setSpeed(value) {
        this._speed = value;
    },
    getHorizonSpeed: function getHorizonSpeed() {
        return this._horizonSpeed;
    },
    updateData: function updateData(blockData) {
        this.setType(blockData["type"]);
        this.setX(blockData["x"]);
        this.setY(blockData["y"]);
        this.setSpeed(blockData["speed"]);

        var colliders = this.node.getComponents(cc.BoxCollider);
        var cfg = BLOCK_CONFIG[blockData["type"] - 1];
        if (cfg) {
            this._horizonSpeed = cfg.horiSpeed / 60;
            for (var i = 0; i < colliders.length; ++i) {
                //设置ai检测范围
                var tmpCollider = colliders[i];
                if (tmpCollider.tag == 1) {
                    tmpCollider.size.width = cfg.checkWidth;
                    tmpCollider.size.height = cfg.checkHeight;
                    break;
                }
            }
        }

        var colliders = this.node.getComponents(cc.BoxCollider);
        for (var i = 0; i < colliders.length; ++i) {
            //设置ai检测范围
            var _tmpCollider = colliders[i];
            if (_tmpCollider.tag == 1) {
                console.log(_tmpCollider.size.width, _tmpCollider.size.height);
                break;
            }
        }
    },
    nodeRotateAction: function nodeRotateAction(node, during, angle, time) {
        var actions = [];
        var action = cc.repeat(cc.rotateBy(during, angle), time);
        actions.push(action);
        actions.push(cc.callFunc(function (target) {
            node.rotation = 0;
        }, self, null));
        node.runAction(new cc.Sequence(actions));
    },
    leftBigRoll: function leftBigRoll(node, heroCarScript) {
        var actions = [];
        var action = null;
        action = cc.repeat(cc.rotateBy(0.1, -60), 1);
        actions.push(action);
        action = cc.repeat(cc.rotateBy(0.35, -360), 1);
        actions.push(action);
        action = cc.repeat(cc.rotateBy(0.1, 60), 1);
        actions.push(action);
        actions.push(cc.callFunc(function (target) {
            node.rotation = 0;
            heroCarScript.setCanChangeLane(true);
        }, self, null));
        node.runAction(new cc.Sequence(actions));
    },
    rightBigRoll: function rightBigRoll(node, heroCarScript) {
        var actions = [];
        var action = null;
        action = cc.repeat(cc.rotateBy(0.1, 60), 1);
        actions.push(action);
        action = cc.repeat(cc.rotateBy(0.35, 360), 1);
        actions.push(action);
        action = cc.repeat(cc.rotateBy(0.1, -60), 1);
        actions.push(action);
        actions.push(cc.callFunc(function (target) {
            node.rotation = 0;
            heroCarScript.setCanChangeLane(true);
        }, self, null));
        node.runAction(new cc.Sequence(actions));
    },


    // true调用大碰撞，false调用小碰撞
    rollBigOrSmall: function rollBigOrSmall(gear) {
        var rangeDatas = [{ "limit": 10 + gear * 3, "result": true }, { "limit": 100, "result": false }];
        var randNum = UTIL.randInt(0, 100);
        var index = UTIL.inRange(randNum, rangeDatas);
        var rangeData = rangeDatas[index];
        return rangeData.result;
    }
}

// update (dt) {},
);

exports.clsBlock = clsBlock;

cc._RF.pop();