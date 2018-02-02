"use strict";
cc._RF.push(module, '1ed37EiSaxFm56JpSMF7bud', 'GameConfig');
// script/GameConfig.js

"use strict";

// 障碍配置配置
//{类型, ai检测宽， ai检测高, 横向移动速度(像素/秒),横向移动最少距离， 横向移动最大距离, 出现概率, 速度}
window.BLOCK_CONFIG = [{ "blockType": 1, "checkWidth": 0, "checkHeight": 0, "horiSpeed": 0, "horiLenMin": 0, "horiLenMax": 0, "limit": 5, "speed": 0 }, // 减速带
{ "blockType": 2, "checkWidth": 0, "checkHeight": 0, "horiSpeed": 0, "horiLenMin": 0, "horiLenMax": 0, "limit": 10, "speed": 0 }, // 加速带
{ "blockType": 3, "checkWidth": 0, "checkHeight": 0, "horiSpeed": 0, "horiLenMin": 0, "horiLenMax": 0, "limit": 60, "speed": 20 }, // 小货车
{ "blockType": 4, "checkWidth": 500, "checkHeight": 500, "horiSpeed": 300, "horiLenMin": 100, "horiLenMax": 150, "limit": 80, "speed": 20 }, // 小汽车
{ "blockType": 5, "checkWidth": 400, "checkHeight": 400, "horiSpeed": 300, "horiLenMin": 100, "horiLenMax": 400, "limit": 100, "speed": 20 // 警车
}];

window.SPEED_UP_TIME = 5000; // 加速带效果持续时间毫秒

window.BLOCK_SHOW_GEER = 3; // 多少档车速时会出现障碍物
window.BLOCK_SHOW_INTERVAL_MIN = 2500; //障碍物出现最少间隔(毫秒)
window.BLOCK_SHOW_INTERVAL_MAX = 4000; //障碍物出现最大间隔(毫秒)

window.SPEED_UP_PER_FRAME = 0.5; // 玩家赛车每帧速度增加
window.SPEED_DOWN_PER_FRAME = -0.9; // 玩家赛车每帧速度减少
window.SPEED_HORIZON = 400; // 玩家赛车横向速度(像素/秒)
window.ROAD_LENGTH = 120000; //赛道长度
window.COLLIDE_GEAR = 5; // 多少档会被警车追

window.SPEED_UP_PER_GEAR = 6; // 每档间隔 (x像素/秒)
window.MAX_GEAR = 9; //总共多少档
window.TEST_ROOM_ID = 5;

window.EXPLODE_BLINK_DT = 1; // 爆炸闪烁间隔x秒
window.EXPLODE_BLINK_TIME = 3; // 闪烁次数
window.EXPLODE_PRE_TIME = 0.1; // 爆炸特效前多长时间

window.BIG_EXPLODE_SPEED = 24; // 大碰撞后的速度
window.SMALL_EXPLODE_PARAM = 1; // 小碰撞速度参数 公式 当前速度 - (5*当前档)


window.BIG_EXPLODE_X_TIME_PARAM = 4; //大碰撞横向移动多少帧  当前档数*2；
window.BIG_EXPLODE_PER_MIN_X = 10; //大碰撞每帧横向移动最少
window.BIG_EXPLODE_PER_MAX_X = 16; // 大碰撞每帧横向移动最大

window.SMALL_EXPLODE_TIME_PARAM = 4; // 小碰撞横向移动多少帧  当前档数*2.5；
window.SMALL_EXPLODE_PER_MIN_X = 6; // 小碰撞 每帧横向移动最少
window.SMALL_EXPLODE_PER_MAX_X = 9; // 小碰撞每帧横向移动最大

window.SMALL_COLLIDE_ROTATE = 30; // 小碰撞旋转角度
window.SMALL_COLLIDE_ROTATE2 = 20; // 小碰撞AI车的旋转角度
window.SMALL_COLLIDE_ROTATE_DT2 = 0.1; // AI 车旋转时间

cc._RF.pop();