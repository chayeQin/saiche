"use strict";

// UI管理模块
// --------------------------------------------------------------------------------
exports.show = function(parentNode, uiPath, onLoaded = null) {
    cc.loader.loadRes(uiPath, function(err, prefab) {
        let ui = cc.instantiate(prefab);
        if (parentNode === null) {
            parentNode = cc.director.getScene();
        }
        parentNode.addChild(ui);
        if (onLoaded !== null) {
            onLoaded(ui)
        }
    });
}

exports.setSwallow = function(target, swallowLayer) {
    swallowLayer.on("touchstart", function(event) {
        event.stopPropagation();
    });
}

exports.changeFrame = function(spriteNode, frameName, onLoaded = null) {
    let sprite = spriteNode.getComponent(cc.Sprite);
    cc.loader.loadRes(frameName, cc.SpriteFrame, function(err, spriteFrame) {
        sprite.spriteFrame = spriteFrame;
        if (onLoaded !== null) {
            onLoaded(sprite)
        }
    });
}
