// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html


cc.Class({
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
        carIndex: {
            default: 1,
            type: cc.Integer,
            visible: true,
        },
        speedUp: cc.Node,
        _speed: 0,
        carTag: null,
        gears: [],
        _speedMax: 0,
        canMove: true,
        canChangeLane: true,
        audioBomb: {
            type: cc.AudioSource,
            default: null
        },
        audioRun: {
            type: cc.AudioSource,
            default: null
        },
        audioSmallCrash: {
            type: cc.AudioSource,
            default: null
        },
        audioBigCrash: {
            type: cc.AudioSource,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let boomNode = cc.find("boom", this.node)
        boomNode.active = false;

        this.gears = [];
        for (var i = 0; i < MAX_GEAR -1; ++i){
            this.gears[i] = (i+1)*SPEED_UP_PER_GEAR
        }
        this._speedMax = this.gears[MAX_GEAR-4];
        cc.director.getCollisionManager().enabled = true;
    },

    setCarTag (value) {
        this.carTag = value + 1;
    },

    setCarIndex (index) {
        this.carIndex = index;
        UI.changeFrame(this.node, "game/car" + index);
    },

    setSpeed (value) {
        if (!this.canMove) {
            return;
        }
        if (value < 0)
        {
            value = 0;
        }
        this._speed = value;
    },

    setCanMove (value) {
        this.canMove = value;
    },

    changeX (value) {
        if (this.canMove == false) return;
        this.node.x += value;
    },

    getSpeedMax () {
        return this._speedMax;
    },

    setSpeedMax () {
        this._speedMax = this.gears[MAX_GEAR-4];
    },

    setSpeedUpMax () {
        this._speedMax = this.gears[this.gears.length - 1];
    },

    setCanChangeLane (value) {
        this.canChangeLane = value;
    },

    getCanChangeLane () {
        return this.canChangeLane;
    },

    getSpeedUpMax () {
        return this.gears[this.gears.length - 1];
    },

    getGears () {
        return this.gears;
    },

    getNowGear () {
        return Math.floor(this._speed / SPEED_UP_PER_GEAR) + 1;
    },

    changeSpeed (value) {
        if (!this.canMove) {
            return;
        }
        this._speed += value;
        if (this._speed <= 0) {
            this._speed = 0;
        }

        this._speed = this._speed > this._speedMax ? this._speedMax : this._speed;
    },

    getSpeed () {
        return this._speed;
    },

    playSmallCrashSound(){
        let self = this;
        let tmpNode = cc.find("audioSmallCrash", this.node)
        tmpNode.stopAllActions()
        tmpNode.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(()=>{
                    self.audioSmallCrash.play();
                })
            )
        )
    },
    playBigCrashSound() {
        let self = this;
        let tmpNode = cc.find("audioBigCrash", this.node)
        tmpNode.stopAllActions()
        tmpNode.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(()=>{
                    self.audioBigCrash.play();
                })
            )
        )
    },

    bomb () {
        let self = this;
        self.speedUp.acitve = false;
        if (self.canMove == false) return;
        self.node.stopAllActions();
        //爆炸的时候去掉碰撞器
        cc.director.getCollisionManager().enabled = false;
        self.node.rotation = 0;
        //TODO 处理一下爆炸音效
        if (self.audioBomb) {
            self.audioBomb.play();
        }
        self.setSpeed(0);
        self.canMove = false;
        // UI.changeFrame(self.node, "game/bomb");
        let boomNode = cc.find("boom", this.node)
        let actions = [];
        actions.push(cc.delayTime(EXPLODE_PRE_TIME));
        actions.push(cc.callFunc(function (target) {
            self.node.getComponent(cc.Sprite).spriteFrame = null;
            boomNode.active = true;
            let boomEffect = this.node.getComponent(cc.Animation)
            boomEffect.play("boom");
        }, self, null));
        actions.push(cc.delayTime(0.3));
        actions.push(cc.callFunc(function (target) {
            self.node.x = 0;
            self.node.rotation = 0;
            self.node.getComponent(cc.Sprite).spriteFrame = null;
            boomNode.active = false;
            UI.changeFrame(self.node, "game/car" + self.carIndex);
        }, self, null));
        actions.push(cc.blink(EXPLODE_BLINK_DT, EXPLODE_BLINK_TIME)); 
        actions.push(cc.callFunc(function (target) {
            self.canMove = true;
            self.canChangeLane = true;
            cc.director.getCollisionManager().enabled = true;
        }, self, null));
        self.node.runAction(new cc.Sequence(actions));
    },

    update (dt) {
        let self = this;

        if (self.carTag != self.carIndex) {
            self.audioRun.stop();
            return;
        }
        self.speedUp.active = false;
        self.audioRun.volume = 0.65 + 0.05 * self.getNowGear();


        if (self.canMove == false) {
            self.audioRun.stop();
            return;
        }

        if (self._speed > self.gears[MAX_GEAR-4]) {
            self.speedUp.active = true;
            self.node.getComponent(cc.Sprite).spriteFrame = null;
            if (self.node.rotation == 0) {
                if (! self.audioRun.isPlaying)
                {
                    self.audioRun.play();
                }
                UI.changeFrame(self.speedUp, "game/car" + self.carIndex + "_3");
            }else{
                self.audioRun.stop();
                UI.changeFrame(self.speedUp, "game/car" + self.carIndex );
            }
            return;
        }
        if (self._speed >= self.gears[3]) {
            self.speedUp.active = true;
            self.node.getComponent(cc.Sprite).spriteFrame = null;
            if (self.node.rotation == 0) {
                if (! self.audioRun.isPlaying)
                {
                    self.audioRun.play();
                }
                UI.changeFrame(self.speedUp, "game/car" + self.carIndex + "_2");
            }else{
                self.audioRun.stop();
                UI.changeFrame(self.speedUp, "game/car" + self.carIndex );
            }
            return;
        } else {
            if (self._speed > 0) {
                if (! self.audioRun.isPlaying)
                {
                    self.audioRun.play();
                }
            } else {
                self.audioRun.stop();
            }
            UI.changeFrame(self.node, "game/car" + self.carIndex);
            return;
        }
    },
});
