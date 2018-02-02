(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/block3.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0b32cychhNGEYaJPkzcZUQR', 'block3', __filename);
// script/game/block3.js

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
var BLOCK = require("block");

cc.Class({
    extends: BLOCK.clsBlock,

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
        targetX: 0,
        changeLane: 5,
        touchX: 0,
        time: 0,
        time2: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        cc.director.getCollisionManager().enabled = true;
    },


    onCollisionEnter: function onCollisionEnter(other, self) {
        if (other.name.substring(0, 3) != "car") return;

        this.heroCarScript = other.node.getComponent("car");
        this.targetX = other.node.x;

        if (self.tag == 0) {
            this.audioCollision.play();
            var nowSpeed = this.heroCarScript.getSpeed();
            if (nowSpeed > 72) {
                nowSpeed = 72;
            }
            var gearNow = this.heroCarScript.getNowGear();
            var shiftBigX = UTIL.randInt(20, 40);
            var shiftSmallX = UTIL.randInt(10, 15);
            this.time = gearNow * 2.5;
            if (this.node.x > this.targetX) {
                this.touchX = -(shiftSmallX / 2.5);
                if (this.rollBigOrSmall(gearNow) == true) {
                    this.heroCarScript.playBigCrashSound();

                    this.heroCarScript.setSpeed(0);
                    this.time2 = gearNow * 2;
                    this.touchX = -(shiftBigX / 2.5);
                    this.heroCarScript.setCanChangeLane(false);
                    this.leftBigRoll(other.node, this.heroCarScript);
                } else {
                    this.heroCarScript.playSmallCrashSound();

                    this.nodeRotateAction(other.node, 0.3, 60, 1);
                    this.nodeRotateAction(other.node, 0.3, -60, 1);
                    this.heroCarScript.setSpeed(nowSpeed - 5 * gearNow);
                }
            } else {
                this.touchX = shiftSmallX / 2.5;
                if (this.rollBigOrSmall(gearNow) == true) {
                    this.heroCarScript.playBigCrashSound();

                    this.heroCarScript.setSpeed(0);
                    this.time2 = gearNow * 2;
                    this.touchX = shiftBigX / 2.5;
                    this.heroCarScript.setCanChangeLane(false);
                    this.rightBigRoll(other.node, this.heroCarScript);
                } else {
                    this.heroCarScript.playSmallCrashSound();

                    this.nodeRotateAction(other.node, 0.3, -60, 1);
                    this.nodeRotateAction(other.node, 0.3, 60, 1);
                    this.heroCarScript.setSpeed(nowSpeed - 5 * gearNow);
                }
            }
        }
    },

    update: function update(dt) {
        if (this.time > 0) {
            this.heroCarScript.changeX(this.touchX);
            this.time--;
        }
        if (this.time2 > 0) {
            this.heroCarScript.changeSpeed(-12);
            this.time2--;
        }
    }
});

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
        //# sourceMappingURL=block3.js.map
        