"use strict";
cc._RF.push(module, '6674b06ccpNDaZ1Iv8QPwiB', 'block5');
// script/game/block5.js

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
        touchAI: false,
        targetX: 0,
        changeLane: 10,
        touchX: 0,
        time: 0,
        time2: 0,
        selfX: 0,
        audioHorn: {
            type: cc.AudioSource,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        cc.director.getCollisionManager().enabled = true;
    },


    onCollisionEnter: function onCollisionEnter(other, self) {
        if (other.name.substring(0, 3) != "car") return;

        this.heroCarScript = other.node.getComponent("car");
        var gear = this.heroCarScript.getNowGear();
        if (self.tag == 1 && this.touchAI == false && gear >= COLLIDE_GEAR) {
            this.touchAI = true;
            this.selfX = this.node.x;
            this.targetX = other.node.x;
            var t = this.getType();
            var cfg = BLOCK_CONFIG[t - 1];
            this.audioHorn.play();
            this.horiMax = UTIL.randInt(cfg.horiLenMin, cfg.horiLenMax);
        }

        if (self.tag == 0) {
            this.audioCollision.play();
            var nowSpeed = this.heroCarScript.getSpeed();
            if (nowSpeed > 72) {
                nowSpeed = 72;
            }
            var gearNow = this.heroCarScript.getNowGear();
            var shiftBigX = UTIL.randInt(BIG_EXPLODE_PER_MIN_X, BIG_EXPLODE_PER_MAX_X);
            var shiftSmallX = UTIL.randInt(SMALL_EXPLODE_PER_MIN_X, SMALL_EXPLODE_PER_MAX_X);
            this.time = gearNow * SMALL_EXPLODE_TIME_PARAM;

            if (this.selfX > this.targetX) {
                this.touchX = -shiftSmallX;
                this.nodeRotateAction(self.node, SMALL_COLLIDE_ROTATE_DT2, SMALL_COLLIDE_ROTATE2, 1);
                this.nodeRotateAction(self.node, SMALL_COLLIDE_ROTATE_DT2, -SMALL_COLLIDE_ROTATE2, 1);
                if (this.rollBigOrSmall(gearNow) == true) {
                    this.heroCarScript.setSpeed(BIG_EXPLODE_SPEED);
                    this.time2 = gearNow * BIG_EXPLODE_X_TIME_PARAM;
                    this.touchX = -shiftBigX;
                    this.heroCarScript.setCanChangeLane(false);
                    this.leftBigRoll(other.node, this.heroCarScript);
                    this.heroCarScript.playBigCrashSound();
                } else {
                    this.heroCarScript.playSmallCrashSound();
                    this.nodeRotateAction(other.node, 0.3, -SMALL_COLLIDE_ROTATE, 1);
                    this.nodeRotateAction(other.node, 0.3, SMALL_COLLIDE_ROTATE, 1);
                    this.heroCarScript.setSpeed(nowSpeed - SMALL_EXPLODE_PARAM * gearNow);
                }
            } else {
                this.touchX = shiftSmallX;
                this.nodeRotateAction(self.node, SMALL_COLLIDE_ROTATE_DT2, SMALL_COLLIDE_ROTATE2, 1);
                this.nodeRotateAction(self.node, SMALL_COLLIDE_ROTATE_DT2, -SMALL_COLLIDE_ROTATE2, 1);
                if (this.rollBigOrSmall(gearNow) == true) {

                    this.heroCarScript.setSpeed(BIG_EXPLODE_SPEED);
                    this.time2 = gearNow * BIG_EXPLODE_X_TIME_PARAM;
                    this.touchX = shiftBigX;
                    this.heroCarScript.setCanChangeLane(false);
                    this.rightBigRoll(other.node, this.heroCarScript);
                    this.heroCarScript.playBigCrashSound();
                } else {
                    this.heroCarScript.playSmallCrashSound();
                    this.nodeRotateAction(other.node, 0.3, SMALL_COLLIDE_ROTATE, 1);
                    this.nodeRotateAction(other.node, 0.3, -SMALL_COLLIDE_ROTATE, 1);
                    this.nodeRotateAction(self.node, 0.3, -SMALL_COLLIDE_ROTATE2, 1);
                    this.nodeRotateAction(self.node, 0.3, SMALL_COLLIDE_ROTATE2, 1);
                    this.heroCarScript.setSpeed(nowSpeed - SMALL_EXPLODE_PARAM * gearNow);
                }
            }
        }
    },

    update: function update(dt) {
        if (this.touchAI == false) {
            return;
        }
        if (this.time > 0) {
            this.heroCarScript.changeX(this.touchX);
            this.time--;
        }
        if (this.time2 > 0) {
            this.heroCarScript.changeSpeed(-12);
            this.time2--;
        }
        if (this.node.x == this.targetX) {
            return;
        }
        if (Math.abs(this.node.x - this.targetX) < this.changeLane) {
            this.node.x = this.targetX;
            return;
        }

        if (Math.abs(this.node.x - this.selfX) < this.horiMax) {
            if (this.node.x > this.targetX) {
                this.node.x -= this.getHorizonSpeed();
            } else {
                this.node.x += this.getHorizonSpeed();
            }
        }
    }
});

cc._RF.pop();