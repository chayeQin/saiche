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
        time: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.director.getCollisionManager().enabled = true;
    },

    onCollisionEnter: function (other, self) {
        if (other.name.substring(0,3) == 'car') {
            this.heroCarScript = other.node.getComponent("car");
            this.heroCarScript.setSpeed(this.heroCarScript.getSpeedUpMax());
            this.heroCarScript.setSpeedUpMax();
            this.time = SPEED_UP_TIME/60;
        }
    },

    update (dt) {
        if (this.time > 0) {
            this.time--;
            if (this.time <= 0) {
                this.heroCarScript.setSpeedMax();
            }
        }
    },
});
