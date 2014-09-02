/**
 * Created by Administrator on 14-2-15.
 */
var Bird_Fly_Tag = 1000;
var Bird_Move_Tag = 1001;
var Bird = cc.Sprite.extend({
    gravity: 1200,
    velocity: 0,
    nowTime: 0,
    maxWidth: 60,
    maxHeight: 60,
    scaleX: 1,
    scaleY: 1,
    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
        this.init();
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },
    init: function () {
        this.size = cc.winSize;
        var texture = TemplateUtils.getVariable("bridPhoto");
        var texturePipeLine = TemplateUtils.getVariable("bridPhoto");
        this.initWithTexture(texture);
        if (this.width > this.maxWidth) {
            this.scaleX = this.maxWidth / this.width;
        }
        if (this.height > this.maxHeight) {
            this.scaleY = this.maxHeight / this.height;
        }
        this.__height = this.height * this.scaleY;
        this.initAnim();
    },
    initAnim: function () {
        var vanim1 = cc.MoveBy.create(0.25, cc.p(0, 15));
        var vanim2 = cc.MoveBy.create(0.25, cc.p(0, 0));
        var vanim3 = cc.MoveBy.create(0.25, cc.p(0, -15));
        var vanim4 = cc.MoveBy.create(0.25, cc.p(0, 0));
        var vanim = cc.Sequence.create(vanim1, vanim2, vanim3, vanim4);
        var action = cc.RepeatForever.create(vanim);
        action.setTag(Bird_Move_Tag);
        this.runAction(action);
    },
    fly: function () {
        var audio = audioMng.getInstance();
        audio.playEffect(res.s_sfx_winge_ogg);
        if (this.getPosition().y <= this.size.height) {
            this.velocity = -750;
            this.nowTime = 0;
        }
    },
    startGravity: function () {
        this.stopActionByTag(Bird_Move_Tag);
    },
//    d:123,
    getCollideBox: function () {
//        var layer = cc.director.getRunningScene().getChildByTag(this.d);
//        if(!layer){
//            var layer = new cc.LayerColor(cc.color(100,100,100,255));
//            cc.director.getRunningScene().addChild(layer,1000000);
//            layer.setTag(this.d);
//        }
//        layer.setPosition(cc.p(this.x - this.width * this.scaleX / 4, this.y - this.height * this.scaleY / 4));
//        layer.setContentSize(cc.size(this.width / 4 * 3 * this.scaleX, this.height / 4 * 3 * this.scale));
        return cc.rect(this.x - this.width * this.scaleX / 4, this.y - this.height * this.scaleY / 4, this.width / 4 * 3 * this.scaleX, this.height / 4 * 3 * this.scale);
    },
    update: function (dt) {
        var position = this.getPosition();
        if (position.y >= GROUND_HEIGHT + this.__height / 2 + 8) {
            var distance = this.velocity * (this.nowTime + dt) + this.gravity * (this.nowTime + dt) * (this.nowTime + dt) / 2 - this.velocity * this.nowTime - this.gravity * this.nowTime * this.nowTime / 2;
            this.velocity = this.velocity + this.gravity * dt;
            this.nowTime += dt;
            if (this.velocity < 0) {
                var panc = this.velocity / 18;
                this.setRotation(panc);
            } else {
                var panc = this.velocity / 3;
                if (panc <= 90) {
                    this.setRotation(panc);
                }
            }
            this.setPosition(cc.p(this.getPosition().x, this.getPosition().y - distance));
        } else {
            this.stopActionByTag(Bird_Fly_Tag);
            this.gameLayer.lostGame();
        }
    }
});
Bird.create = function (gameLayer) {
    return new Bird(gameLayer);
}