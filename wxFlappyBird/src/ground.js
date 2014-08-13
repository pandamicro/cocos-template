/**
 * Created by Administrator on 14-2-15.
 */
var Ground = cc.Sprite.extend({
    ctor:function(){
        this._super();
        this.star();
    },
    star:function(){
        this.init(res.s_ground);
        this.setAnchorPoint(cc.p(0,0));
    },
    destory:function(){
        this.removeFromParent(true);
    }
});
Ground.create = function(){
    return new Ground();
}