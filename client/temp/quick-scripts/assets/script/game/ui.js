(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/ui.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cb370IUSFJJNIJ4k3sNZ7Iz', 'ui', __filename);
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
        //# sourceMappingURL=ui.js.map
        