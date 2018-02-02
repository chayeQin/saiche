"use strict";
cc._RF.push(module, 'cb370IUSFJJNIJ4k3sNZ7Iz', 'ui');
// script/game/ui.js

"use strict";

// UI管理模块
// --------------------------------------------------------------------------------

exports.show = function (parentNode, uiPath) {
    var onLoaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    cc.loader.loadRes(uiPath, function (err, prefab) {
        var ui = cc.instantiate(prefab);
        if (parentNode === null) {
            parentNode = cc.director.getScene();
        }
        parentNode.addChild(ui);
        if (onLoaded !== null) {
            onLoaded(ui);
        }
    });
};

exports.setSwallow = function (target, swallowLayer) {
    swallowLayer.on("touchstart", function (event) {
        event.stopPropagation();
    });
};

exports.changeFrame = function (spriteNode, frameName) {
    var onLoaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var sprite = spriteNode.getComponent(cc.Sprite);
    cc.loader.loadRes(frameName, cc.SpriteFrame, function (err, spriteFrame) {
        sprite.spriteFrame = spriteFrame;
        if (onLoaded !== null) {
            onLoaded(sprite);
        }
    });
};

cc._RF.pop();