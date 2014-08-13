/**
 * Created by wzm on 14-8-9.
 */
var Block = cc.Sprite.extend({
    colorStatus: null,
    clicked: false,
    _index: null,
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        this.colorStatus = false;
        this.anchorX = 0;
        this.anchorY = 0;
        this._index = 0;
        var winSize = cc.winSize;
        var blockWidth = (winSize.width -TemplateUtils.getVariable("numPerLine") - 1) / TemplateUtils.getVariable("numPerLine");
        var blockHeight = Block.conputeBlockHeight();
        this.setTextureRect(cc.rect(0, 0, blockWidth, blockHeight));
        this.setColor(cc.color(TemplateUtils.getVariable("blockColor")));
    },
    getColorStatus: function () {
        return this.colorStatus;
    },
    setClickPic: function () {
        var texture = TemplateUtils.getVariable("block_normal");
        this.sprite = new cc.Sprite(texture);
        this.sprite.x = this.width / 2;
        this.sprite.y = this.height / 2;
        if(this.sprite.width>this.width){
            this.sprite.scaleX = this.width/this.sprite.width;
        }
        if(this.sprite.height>this.height){
            this.sprite.scaleY = this.height/this.sprite.height;
        }
        this.addChild(this.sprite);
        this.colorStatus = true;
    },
    click: function () {
        if (this.colorStatus) {
            var texture = TemplateUtils.getVariable("block_sel");
            this.sprite.initWithTexture(texture);
//            this.sprite.initWithFile()
            if(this.sprite.width>this.width){
                this.sprite.scaleX = this.width/this.sprite.width;
            }
            if(this.sprite.height>this.height){
                this.sprite.scaleY = this.height/this.sprite.height;
            }
            this.clicked = true;
        }
    },
    whiteClick: function (cb) {
        var sprite = new cc.Sprite();
        sprite.setTextureRect(this.getTextureRect());
        sprite.setColor(cc.color(242, 21, 21));
        sprite.x = this.width / 2;
        sprite.y = this.height / 2;
        var repeat = cc.Repeat.create(cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.2)), 3);
        var fadeAnim = cc.sequence(repeat, cc.delayTime(0.5), cc.callFunc(function () {
            if (cb)cb();
        }));
        sprite.runAction(fadeAnim);
        this.addChild(sprite);

    },
    getClicked: function () {
        return this.clicked;
    },
    setIndex: function (index) {
        this._index = index;
    },
    getIndex: function () {
        return this._index;
    }
});
Block.make = function () {
    return new Block();
}
Block.conputeBlockHeight = function () {
    return (cc.winSize.height - TemplateUtils.getVariable("linePerScreen") + 1) / TemplateUtils.getVariable("linePerScreen");
}