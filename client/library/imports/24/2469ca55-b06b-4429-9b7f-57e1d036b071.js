"use strict";
cc._RF.push(module, '2469cpVsGtEKZt/V+HQNrBx', 'game');
// script/game/game.js

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

require("init");

var FRAME_COUNT = 4;

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

        _heroId: 0,
        _heroCarIndex: 0,
        _opponentCarIndex: 0,
        _plyaerIds: [0, 0],
        _counter: 0,

        // 速度
        _frameCount: 99999999,

        _distances: [0, 0],

        // 左右偏移坐标
        _offsetXMin: -200,
        _offsetXMax: 200,

        //小地图偏移比例
        _presentY: 710,
        _presentX: 0,

        //跑道宽度
        _waywidth: 0,

        initOffsetXs: [0, 0],
        initOffsetY: -250,
        _offsetXs: [0, 0],

        // 是否在加速
        _accelerator: false,
        // 变道
        _changelane: false,

        // 游戏状态
        running: false,

        // 倒计时交通灯
        trafficlightIndex: 0,

        //终点
        _destination: 0,
        // ----------------------------------------
        maskLayer: cc.Node,

        // 道路
        roadNode: cc.Node,
        bg1: cc.Sprite,
        bg2: cc.Sprite,
        startLine: cc.Sprite,
        redpoint: cc.Sprite,
        bluepoint: cc.Sprite,

        // 赛车
        cars: {
            default: [],
            type: cc.Sprite
        },
        heroArrow: cc.Sprite,

        _blocks: [],

        // 速度计
        speedometer: cc.ProgressBar,
        speedLabel: cc.Label,
        speedupButton: cc.Button,
        wheelButton: cc.Button,
        tipsLabel: cc.Label,

        // 交通灯
        trafficlight: cc.Node,
        trafficlights: {
            default: [],
            type: cc.Sprite
        },

        // 声音
        // ----------------------------------------
        audioBackground: {
            url: cc.AudioClip,
            default: null
        },

        audioDaoshu: {
            type: cc.AudioSource,
            default: null
        },
        audioWin: {
            url: cc.AudioClip,
            default: null
        },
        audioLose: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        YYSDK.JYXStartGame();
        YYSDK.JYXFinishLoading();
    },
    start: function start() {
        var self = this;

        UI.setSwallow(this, this.maskLayer);
        self.initOffsetXs = [-125, 125];
        self.initOffsetY = -250;
        self._offsetXs = [-125, 125];
        self._destination = ROAD_LENGTH;
        self._frameCount = 0;
        self._waywidth = 200;
        self._presentX = 30;
        self.bindEvent();
        // self.current = cc.audioEngine.play(self.audioBackground, true, 0.3);
        // self.prepare();

        // let HOST = "127.0.0.1";
        // let HOST = "120.78.95.221";
        // let PORT = 3000;

        NETWORK.initProtocols();
        this.scheduleOnce(function () {
            // WS_URL = "ws://127.0.0.1:10020";
            NETWORK.connect(WS_URL);
        }, 2);

        var interval = 5;
        var repeat = 999999;
        var delay = 5;
        this.schedule(function () {
            if (NETWORK.isConnected()) {
                for_caller.s_user_heartbeat();
            }
        }, interval, repeat, delay);
    },
    reset: function reset() {
        var self = this;
        self.maskLayer.active = true;
        self.prepare();
    },
    prepare: function prepare() {
        var self = this;

        for (var i = 0; i < self.cars.length; i++) {
            var car = self.cars[i];
            var carScript = car.getComponent("car");
            carScript.setCarIndex(i + 1);
            car.node.x = self.initOffsetXs[i];
            car.node.y = -400;
            car.node.runAction(cc.moveTo(0.5, car.node.x, self.initOffsetY));
        }

        self._distances = [0, 0];

        self.heroArrow.node.x = self.initOffsetXs[self._heroCarIndex];
        var heroCarScript = this.cars[self._heroCarIndex].getComponent("car");
        heroCarScript.setCarTag(self._heroCarIndex);

        self.heroArrow.node.active = true;
        self.startLine.node.y = -150;
        self.speedometer.progress = 0;
        self.tipsLabel.string = "并驾齐驱";

        self.trafficlight.active = true;
        for (var _i = 0; _i < self.trafficlights.length; _i++) {
            self.trafficlights[_i].node.active = false;
        }
    },
    countdown: function countdown() {
        var self = this;

        self.maskLayer.active = false;
        self.trafficlightIndex = 0;
        self.running = false;

        // 以秒为单位的时间间隔
        var interval = 1;
        // 重复次数
        var repeat = 3;
        // 开始延时
        var delay = 1;

        self.schedule(function () {
            for (var i = 0; i < self.trafficlights.length; i++) {
                self.trafficlights[i].node.active = i === self.trafficlightIndex ? true : false;
            }
            console.log("****play countdown");
            self.audioDaoshu.stop();
            self.audioDaoshu.play();
            self.trafficlightIndex += 1;

            if (self.trafficlightIndex === 4) {
                self.trafficlight.active = false;
                self.heroArrow.node.active = false;
                self.running = true;
                //游戏开始
                YYSDK.JYXPKStart();
            }
        }, interval, repeat, delay);
    },
    bindEvent: function bindEvent() {
        var self = this;
        var heroCarScript = this.cars[self._heroCarIndex].getComponent("car");

        // 加油
        self.speedupButton.node.on("touchstart", function (event) {
            self._accelerator = true;
        }, self);

        self.speedupButton.node.on("touchend", function (event) {
            self._accelerator = false;
        }, self);

        self.speedupButton.node.on("touchcancel", function (event) {
            self._accelerator = false;
        }, self);

        // 变道
        self.wheelButton.node.on("touchstart", function (event) {
            // 233是轮盘向右的边界，149是向左的边界
            var touch = event.getLocation();
            if (touch.x >= 233) {
                self._changelane = SPEED_HORIZON / 60;
            }
            if (touch.x <= 149) {
                self._changelane = -SPEED_HORIZON / 60;
            }
        }, self);

        self.wheelButton.node.on("touchmove", function (event) {
            var touch = event.getLocation();
            if (touch.x >= 233) {
                self._changelane = SPEED_HORIZON / 60;
            }
            if (touch.x <= 149) {
                self._changelane = -SPEED_HORIZON / 60;
            }
        }, self);

        self.wheelButton.node.on("touchend", function (event) {
            self._changelane = 0;
        }, self);

        self.wheelButton.node.on("touchcancel", function (event) {
            self._changelane = 0;
        }, self);

        // 事件
        self.eventFuncs = {
            ENTER: function ENTER(event) {
                var detail = event.detail;
                self._heroId = detail.heroId;
            },
            START: function START(event) {
                var detail = event.detail;
                self._plyaerIds = [detail.ownerId, detail.opponentId];
                self._heroCarIndex = self._plyaerIds.indexOf(self._heroId);
                self._opponentCarIndex = self._heroCarIndex == 0 ? 1 : 0;
                self.prepare();
                self.countdown();
            },
            FINISH: function FINISH(event) {
                self.reset();
            },
            RACE: function RACE(event) {
                var detail = event.detail;
                self._distances[self._opponentCarIndex] = detail.distance;
                self._offsetXs[self._opponentCarIndex] = detail.x;
            },
            RESULT: function RESULT(event) {
                heroCarScript.setSpeed(0);
                heroCarScript.setCanMove(false);

                var detail = event.detail;
                var formatTime = function formatTime(time) {
                    var s = Math.floor(time / 1000);
                    var ms = time % 1000;
                    ms = ms.toString().substr(0, 2);
                    var m = Math.floor(s / 60);
                    s = s % 60;
                    if (m > 99) {
                        m = 99;
                    }
                    if (m < 10) {
                        m = "0" + m.toString();
                    }
                    if (s < 10) {
                        s = "0" + s.toString();
                    }
                    var time = m + ":" + s + ":" + ms;
                    return time;
                };
                if (detail.winnerId == self._heroId) {
                    self.running = false;
                    cc.audioEngine.play(self.audioWin, false, 1);
                    UI.show(null, "prefab/result_win", function (ui) {
                        var time = formatTime(detail.time);
                        ui.getComponent("result").showTime(time);
                    });
                } else {
                    self.running = false;
                    cc.audioEngine.play(self.audioLose, false, 1);
                    UI.show(null, "prefab/result_lose", function (ui) {
                        var time = formatTime(detail.time);
                        ui.getComponent("result").showTime(time);
                    });
                }

                //回传结果
                self.scheduleOnce(function () {
                    console.log(detail.result);
                    YYSDK.JYXPKFinish(detail.result);
                }, 2);
            },
            BLOCK: function BLOCK(event) {
                var detail = event.detail;
                var _createBlock = function _createBlock(prefabName, scriptName, blockData) {
                    UI.show(self.roadNode, prefabName, function (ui) {
                        ui.getComponent(scriptName).updateData(blockData);
                        self._blocks.push(ui);

                        ui.x = blockData["x"];
                        ui.y = blockData["y"];
                    });
                };
                var blockData = detail.blockData;
                var blockType = blockData["type"];
                var prefabName = "prefab/block" + blockType;
                var scriptName = "block" + blockType;
                _createBlock(prefabName, scriptName, blockData);
            }
        };

        for (var eventName in self.eventFuncs) {
            var eventFunc = self.eventFuncs[eventName];
            cc.director.on(eventName, eventFunc);
        }
    },
    genBlockDatas: function genBlockDatas() {
        var self = this;

        // console.log(self._frameCount);
        if (self._frameCount > 0) {
            self._frameCount -= 1;
            return;
        }

        var randNum = UTIL.randInt(0, 100);
        var index = UTIL.inRange(randNum, BLOCK_CONFIG);

        var rangeData = BLOCK_CONFIG[index];

        var blockType = rangeData["blockType"];
        var speed = rangeData["speed"];

        // let heroDistance = self._distances[self._heroCarIndex];
        // console.log("heroDistance = " + heroDistance + ",blocksNum = " + self._blocks.length);
        var blockData = {
            type: blockType,
            x: UTIL.randInt(-125, 125),
            y: 700,
            speed: speed
        };
        cc.director.emit("BLOCK", { "blockData": blockData });

        if (self._frameCount <= 0) {
            var randNum = UTIL.randInt(BLOCK_SHOW_INTERVAL_MIN, BLOCK_SHOW_INTERVAL_MAX);
            self._frameCount = Math.floor(randNum / 60);
        }
    },
    adjustRoad: function adjustRoad() {
        var self = this;
        var heroCarScript = this.cars[self._heroCarIndex].getComponent("car");
        var speed = heroCarScript.getSpeed();

        var topBG = void 0,
            bottomBG = void 0;
        if (self.bg1.node.y < self.bg2.node.y) {
            topBG = self.bg2;
            bottomBG = self.bg1;
        } else {
            topBG = self.bg1;
            bottomBG = self.bg2;
        }

        // TODO -1334 is Hard Code
        var screenHeight = 1334;
        bottomBG.node.y = bottomBG.node.y - speed;
        topBG.node.y = bottomBG.node.y + screenHeight;
        if (bottomBG.node.y < -screenHeight) {
            bottomBG.node.y = topBG.node.y + screenHeight;
        }

        self.startLine.node.y = self.startLine.node.y - speed;
        if (self.startLine.node.y < -700) {
            var heroCar = self.cars[self._heroCarIndex];
            self.startLine.node.y = heroCar.node.y + (self._destination - self._distances[self._heroCarIndex]);
        }

        var blocksGC = []; // 障碍物GC...START

        // 障碍物
        for (var _i2 = 0; _i2 < self._blocks.length; _i2++) {
            var _block = self._blocks[_i2];
            var blockSpeed = _block.getComponent("block").getSpeed();
            _block.y = _block.y - speed + blockSpeed;
            if (_block.y < -1334 || _block.y > 1334) {
                blocksGC.push(_block);
                var index = self._blocks.indexOf(_block);
                self._blocks.splice(index, 1);
            }
        }

        if (blocksGC.length > 0) {
            for (var i = 0; i < blocksGC.length; i++) {
                var block = blocksGC[i];
                if (block.getComponent("block").getType() == 2) continue;
                block.destroy();
            }
        }

        blocksGC = [];
        // 障碍物GC...DONE
    },
    mapWeiYi: function mapWeiYi(heroDistance, heroCar) {
        var self = this;
        var heroWeiYiY = heroDistance / self._destination * self._presentY;
        var heroWeiYiX = heroCar.node.x / self._waywidth * self._presentX;
        var opponentWeiYiY = self._distances[self._opponentCarIndex] / self._destination * self._presentY;
        var opponentWeiYiX = self._offsetXs[self._opponentCarIndex] / self._waywidth * self._presentX;
        if (self._heroCarIndex == 0) {
            //-350是本来Y轴的偏移量
            self.redpoint.node.y = -350 + heroWeiYiY;
            self.redpoint.node.x = heroWeiYiX;
            self.bluepoint.node.y = -350 + opponentWeiYiY;
            self.bluepoint.node.x = opponentWeiYiX;
        }
        if (self._heroCarIndex == 1) {
            self.bluepoint.node.y = -350 + heroWeiYiY;
            self.bluepoint.node.x = heroWeiYiX;
            self.redpoint.node.y = -350 + opponentWeiYiY;
            self.redpoint.node.x = opponentWeiYiX;
        }
    },
    update: function update(dt) {
        var self = this;
        var heroCarScript = this.cars[self._heroCarIndex].getComponent("car");
        //添加canMove限制碰撞后不可移动
        var canMove = true;
        var x = this.cars[self._heroCarIndex].node.x;
        if (x <= self._offsetXMin || x >= self._offsetXMax) {
            heroCarScript.setCanChangeLane(false);
            heroCarScript.bomb();
        }

        if (self.running === false) return;

        var speed = heroCarScript.getSpeed();
        var speedMax = heroCarScript.getSpeedMax();

        if (heroCarScript.getNowGear() > BLOCK_SHOW_GEER) {
            self.genBlockDatas();
        }
        if (heroCarScript.getCanChangeLane() == false) {
            canMove = false;
            // console.log("不许动")
        }
        if (self._accelerator && canMove) {
            heroCarScript.changeSpeed(SPEED_UP_PER_FRAME);
        } else {
            if (speed > 0) {
                heroCarScript.changeSpeed(SPEED_DOWN_PER_FRAME);
            }
        }
        speed = heroCarScript.getSpeed();

        self.adjustRoad();

        // 更新距离
        var heroDistance = self._distances[self._heroCarIndex];
        heroDistance += speed;
        self._distances[self._heroCarIndex] = heroDistance;
        var distance = heroDistance - self._distances[self._opponentCarIndex];
        if (distance === 0) {
            self.tipsLabel.string = "齐驱并驾";
        } else if (distance > 0) {
            self.tipsLabel.string = "领先" + Math.round(distance / 100) + "米";
        } else {
            self.tipsLabel.string = "落后" + Math.abs(Math.round(distance / 100)) + "米";
        }

        // 变道控制
        var heroCar = self.cars[self._heroCarIndex];
        if (self._changelane !== 0 && heroCarScript.getCanChangeLane() != false) {
            var _x = heroCar.node.x;
            _x += self._changelane;
            _x = _x < self._offsetXMin ? self._offsetXMin : _x;
            _x = _x > self._offsetXMax ? self._offsetXMax : _x;
            heroCar.node.x = _x;
        }

        var opponentCar = self.cars[self._opponentCarIndex];
        opponentCar.node.x = self._offsetXs[self._opponentCarIndex];
        opponentCar.node.y = heroCar.node.y - distance;
        self.mapWeiYi(heroDistance, heroCar);

        // 速度计
        self.speedometer.progress = speed / heroCarScript.getSpeedUpMax();
        self.speedLabel.string = Math.floor(speed * 3) + "";

        if (speed != 0) {
            for_caller.s_racing_sync_data(heroDistance, heroCar.node.x);
        }

        // 每FRAME_COUNT帧重置一下计数器，代表FRAME_COUNT帧可以发一次数据
        self._counter += 1;
        // 如果速度为0也需要重置一下
        if (speed == 0 || self._counter == FRAME_COUNT) {
            self._counter = 0;
        }

        if (heroDistance >= self._destination) {
            self.running = false;
            for_caller.s_racing_finish_game();
        }
    },


    onDestroy: function onDestroy() {
        var self = this;
        for (var eventName in self.eventFuncs) {
            var eventFunc = self.eventFuncs[eventName];
            cc.director.off(eventName, eventFunc);
        }

        // if (this.current !== "undefined") {
        //     cc.audioEngine.stop(this.current);
        // }
    }
});

cc._RF.pop();