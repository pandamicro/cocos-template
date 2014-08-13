/**
 * Created by Administrator on 14-2-16.
 */
var PipeLineController = cc.Class.extend({
    createDistance: 390,
    nowDistance: 0,
    spaceHeight: 260,//管道中间空间大小
    minHeight: 430,//底部管道最小高度
    ctor: function (gameLayer) {
        this.gameLayer = gameLayer;
        this.init();
    },
    init: function () {
        this.pipeArray = [];
        this.pipeMidArray = [];
        this.createPipe();
    },
    createPipe: function () {
        var pipeLine1 = PipeLine.create(1);
        var pipeLine2 = PipeLine.create(2);
        var random = CrazyBird.random(0, this.minHeight);
        pipeLine1.setPosition(cc.p(this.gameLayer.size.width + 10, -random));
        pipeLine2.setPosition(cc.p(this.gameLayer.size.width + 10, this.spaceHeight + pipeLine1.getContentSize().height + pipeLine1.getPosition().y));
        this.addPipeToGame(pipeLine1, pipeLine2);
    },
    addPipeToGame: function (pipe1, pipe2) {
        if (pipe1, pipe2) {
            this.gameLayer.addChild(pipe1, CrazyBird.LINEPIPE);
            this.gameLayer.addChild(pipe2, CrazyBird.LINEPIPE);
            this.pipeArray.push(pipe1);
            this.pipeArray.push(pipe2);
//            this.pipeMidArray.push(pipe1.getPosition().x+pipe1.getContentSize().width/2);
        }
    },
    makePipe: function (dt) {
        this.nowDistance = this.nowDistance + CrazyBird.MOVESPEED * dt;
        if (this.nowDistance > this.createDistance) {
            this.nowDistance = 0;
            this.createPipe();
        }
        for (var i = 0; i < this.pipeArray.length; i++) {
            var pipeline = this.pipeArray[i];
            var position = pipeline.getPosition();
            var cSize = pipeline.getContentSize();
            pipeline.setPosition(cc.p(position.x - CrazyBird.MOVESPEED * dt, position.y));
            var birdPos = this.gameLayer.bird.getPosition();
            if (!pipeline.isScore() && birdPos.x >= position.x && birdPos.x <= position.x + cSize.width) {
                this.gameLayer.addScore();
                pipeline.setScored();
            }
            if (position.x + cSize.width < 0) {
                pipeline.setVisible(false);
            }
        }
        for (var i = 0; i < this.pipeArray.length; i++) {
            var pipeline = this.pipeArray[i];
            if (!pipeline.isVisible()) {
                this.pipeArray.splice(i, 1);
            }
        }
        this.checkCrash(dt);
    },
    checkCrash: function (dt) {
        for (var i = 0; i < this.pipeArray.length; i++) {
            var pipe = this.pipeArray[i];
            if (cc.rectOverlapsRect(this.gameLayer.bird.getCollideBox(), pipe.getBoundingBox())) {
                CrazyBird.GAMESTATUS.NOWSTATUS = CrazyBird.GAMESTATUS.WAITFORLOST;
                audioMng.getInstance().playEffect(res.s_sfx_hit_ogg);
                audioMng.getInstance().playEffect(res.s_sfx_die_ogg);
            }
        }
    }
});
PipeLineController.create = function (gameLayer) {
    return new PipeLineController(gameLayer);
}