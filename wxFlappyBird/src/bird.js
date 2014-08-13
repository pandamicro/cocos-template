/**
 * Created by Administrator on 14-2-15.
 */
var Bird_Fly_Tag = 1000;
var Bird_Move_Tag = 1001;
var Bird = cc.Sprite.extend({
    gravity: 1200,
    velocity: 0,
    nowTime: 0,
    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
        this.init();
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },
    init: function () {
        this.size = cc.winSize;
        this.initAnim();
//        this.startGravity();
    },
    initAnim: function () {
        var animFrames = [];
        var frameCache = cc.spriteFrameCache;
        for (var i = 1; i < 4; i++) {
            var frame = frameCache.getSpriteFrame("bird" + i + ".png");
            if (i == 1) this.initWithSpriteFrame(frame);
            animFrames.push(frame);
        }
        var anim = cc.RepeatForever.create(cc.Animate.create(cc.Animation.create(animFrames, 0.15)));
        var vanim1 = cc.MoveBy.create(0.25, cc.p(0, 15));
        var vanim2 = cc.MoveBy.create(0.25, cc.p(0, 0));
        var vanim3 = cc.MoveBy.create(0.25, cc.p(0, -15));
        var vanim4 = cc.MoveBy.create(0.25, cc.p(0, 0));
        var vanim = cc.Sequence.create(vanim1, vanim2, vanim3, vanim4);
        var action = cc.RepeatForever.create(vanim);
        anim.setTag(Bird_Fly_Tag);
        action.setTag(Bird_Move_Tag);
        this.runAction(action);
        this.runAction(anim);
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
    update: function (dt) {
        var position = this.getPosition();
        if (position.y >= 325) {
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