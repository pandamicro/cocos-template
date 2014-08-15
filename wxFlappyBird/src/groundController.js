/**
 * Created by Administrator on 14-2-16.
 */
var GroundController = cc.Class.extend({
    ctor: function (gameLayer) {
        this.gameLayer = gameLayer;
        this.init();
    },
    init: function () {
        this.groundArray = [];
        var ground1 = Ground.create();
        var ground2 = Ground.create();
        ground1.setPosition(cc.p(0, 0));
        ground2.setPosition(cc.p(ground1.getContentSize().width, 0));
        this.addGroundToGame(ground1);
        this.addGroundToGame(ground2);
    },
    addGroundToGame: function (ground) {
        if (ground) {
            this.gameLayer.addChild(ground, CrazyBird.GROUND);
            this.groundArray.push(ground);
        }
    },
    makeGround: function (dt) {
        if (this.groundArray.length <= 0)return;
        for (var i = 0; i < this.groundArray.length; i++) {
            var ground = this.groundArray[i];
            var position = ground.getPosition();
            var contentSize = ground.getContentSize();
            if (position.x + contentSize.width < 0) {
                ground.setVisible(false);
                var newGround = Ground.create();
                var endGround = this.groundArray[this.groundArray.length - 1];
                var px = endGround.getPosition().x + endGround.getContentSize().width;
                newGround.setPosition(cc.p(px, 0));
                this.addGroundToGame(newGround);
            } else {
                ground.setPosition(cc.p(position.x - CrazyBird.MOVESPEED * dt, position.y));
            }
        }
        for (var i = 0; i < this.groundArray.length; i++) {
            var ground = this.groundArray[i];
            if (!ground.isVisible()) {
                ground.destory();
                this.groundArray.splice(i, 1);
            }
        }
    }

});
GroundController.create = function (gameLayer) {
    return new GroundController(gameLayer);
}