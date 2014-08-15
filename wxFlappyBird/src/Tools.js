/**
 * Created by Administrator on 14-2-16.
 */
var CrazyBird = {};
CrazyBird.random = function (x, y) {
    return parseInt(Math.random() * (y - x) + x);
}
CrazyBird.MOVESPEED = 300;

CrazyBird.LINEPIPE = 2000;
CrazyBird.GROUND = 2001;
CrazyBird.BIRD = 2002;
CrazyBird.SCORE = 2003;
CrazyBird.MENU = 2004;

CrazyBird.GAMESTATUS = {};

CrazyBird.GAMESTATUS.NORMAL = 1;//游戏正常状态
CrazyBird.GAMESTATUS.LOST = 0;//游戏失败
CrazyBird.GAMESTATUS.PAUSE = 2;//游戏暂停
CrazyBird.GAMESTATUS.WAITFORLOST = 3;//游戏暂停
CrazyBird.GAMESTATUS.NOWSTATUS = CrazyBird.GAMESTATUS.PAUSE;//游戏当前状态

CrazyBird.AUIDIO = {};
CrazyBird.AUIDIO.PLAYMUSIC = true;

CrazyBird.scaleFactor = 1;