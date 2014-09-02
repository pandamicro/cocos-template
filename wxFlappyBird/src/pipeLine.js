/**
 * Created by Administrator on 14-2-16.
 */
var PipeLine = cc.Sprite.extend({
    score: false,
    maxWidth: 130,
    maxHeight: 700,
    __height: null,
    scaleX: 1,
    scaleY: 1,
    ctor: function (direction) {
        this._super();
        this.init(direction);
    },
    init: function (direction) {
        this.initWithTexture(TemplateUtils.getVariable("pineLine"));
        if (direction == 2) this.setFlippedY(true);
        this.setAnchorPoint(cc.p(0, 0));
        if (this.width > this.maxWidth) {
            this.scaleX = this.maxWidth / this.width;
        }
        if (this.height > this.maxHeight) {
            this.scaleY = this.maxHeight / this.height;
        }
//        var frame= cc.spriteFrameCache;
//        var spriteName = "holdback1.png";
//        var pipe = frame.getSpriteFrame(spriteName);
//        this.initWithSpriteFrame(pipe);
    },
    getSize: function () {
        return cc.size(this.width * this.scaleX, this.height * this.scaleY);
    },
    getCollideBox: function () {
        return  cc.rect(this.x, this.y, this.width * this.scaleX, this.height * this.scaleY);
    },
    setScored: function () {
        this.score = true;
    },
    isScore: function () {
        return this.score;
    }
});
PipeLine.create = function (direction) {
    return new PipeLine(direction);
}
