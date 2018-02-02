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
        _horizonSpeed : 0,
        heroCarScript: null,

        audioCollision: {
            type: cc.AudioSource,
            default: null
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getType () {
        return this._type;
    },

    setType (value) {
        this._type = value;
    },

    getX () {
        return this._x;
    },

    setX (value) {
        this._x = value;
    },

    getY () {
        return this._y;
    },

    setY (value) {
        this._y = value;
    },

    getSpeed () {
        return this._speed;
    },

    setSpeed (value) {
        this._speed = value;
    },

    getHorizonSpeed() {
        return this._horizonSpeed;
    },

    updateData (blockData) {
        this.setType(blockData["type"]);
        this.setX(blockData["x"]);
        this.setY(blockData["y"]);
        this.setSpeed(blockData["speed"]);

        var colliders = this.node.getComponents(cc.BoxCollider);
        var cfg = BLOCK_CONFIG[blockData["type"] - 1];
        if (cfg){
            this._horizonSpeed = cfg.horiSpeed/60;
            for (var i=0; i < colliders.length; ++i){ //设置ai检测范围
                let tmpCollider = colliders[i]
                if (tmpCollider.tag == 1){
                    tmpCollider.size.width = cfg.checkWidth;
                    tmpCollider.size.height = cfg.checkHeight;
                    break;
                }
            }
        }

        var colliders = this.node.getComponents(cc.BoxCollider);
        for (var i=0; i < colliders.length; ++i){ //设置ai检测范围
            let tmpCollider = colliders[i]
            if (tmpCollider.tag == 1){
                console.log(tmpCollider.size.width, tmpCollider.size.height)
                break;
            }
        }

    },
    

    nodeRotateAction (node, during, angle, time) {
        let actions = [];
        let action = cc.repeat(cc.rotateBy(during, angle), time);
        actions.push(action);
        actions.push(cc.callFunc(function (target) {
            node.rotation = 0;
        }, self, null));
        node.runAction(new cc.Sequence(actions));
    },

    leftBigRoll (node, heroCarScript) {
        let actions = [];
        let action = null;
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

    rightBigRoll (node, heroCarScript) {
        let actions = [];
        let action = null;
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
    rollBigOrSmall (gear) {
        var rangeDatas = [
            {"limit": 10 + (gear * 3), "result": true},
            {"limit": 100, "result": false},
        ];
        var randNum = UTIL.randInt(0, 100);
        var index = UTIL.inRange(randNum, rangeDatas);
        var rangeData = rangeDatas[index];
        return rangeData.result;
    },

    // update (dt) {},
});

exports.clsBlock = clsBlock;
