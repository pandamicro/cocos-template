/**
 * Created by Administrator on 14-2-15.
 */
var GROUND_HEIGHT = 0;
var Ground = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.star();
    },
    star: function () {
        this.initWithTexture(TemplateUtils.getVariable("ground"));
        this.setAnchorPoint(cc.p(0, 0));
        if (!GROUND_HEIGHT)
            GROUND_HEIGHT = this.height;
    },
    destory: function () {
        this.removeFromParent(true);
    }
});
Ground.create = function () {
    return new Ground();
}