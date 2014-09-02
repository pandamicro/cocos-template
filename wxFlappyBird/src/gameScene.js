/**
 * Created by Administrator on 14-2-15.
 */
var gameLayer = cc.Layer.extend({
    score:0,
    init:function(){
        this._super();
        this.size =cc.winSize;
        this.preFrames();
        var bgSprite = cc.Sprite.create(TemplateUtils.getVariable("background"));
        this.addChild(bgSprite);
        bgSprite.setPosition(cc.p(0,0));
        bgSprite.setAnchorPoint(cc.p(0,0));
        //bird
        this.bird = Bird.create(this);
        this.addChild(this.bird,CrazyBird.BIRD);
        this.bird.setPosition(cc.p(this.size.width/6,this.size.height/2));
        // pipeline
        this.PipeLineController = PipeLineController.create(this);
        //ground
        this.GroundController = GroundController.create(this);
        //score
        this.scoreLabel = cc.LabelTTF.create("0", "Arial", 72);//计时;
        this.scoreLabel.setPosition(cc.p(this.size.width/2,this.size.height-200));
        this.addChild(this.scoreLabel,CrazyBird.SCORE);
        //tabSprite
        this.tableSprite = cc.Sprite.create("#click.png");
        this.addChild(this.tableSprite,CrazyBird.MENU);
        this.tableSprite.setPosition(cc.p(this.size.width/2,this.size.height/2));
        this.addTouch();
    },
    addTouch:function(){
        var self = this;
        this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return self.onTouchBegan(touch,event);
            },
            onTouchMoved: function (touch, event) {
                self.onTouchMoved(touch,event);
            },
            onTouchEnded: function (touch, event) {
                self.onTouchEnded(touch,event);
            },
            onTouchCancelled: function (touch, event) {
            }
        });
        cc.eventManager.addListener(this.listener, self);

    },
    startGame:function(){
        CrazyBird.GAMESTATUS.NOWSTATUS = CrazyBird.GAMESTATUS.NORMAL;
        this.tableSprite.setVisible(false);
        this.schedule(this.update);
        this.bird.startGravity();
        share(0);
    },
    lostGame:function(){
        //gameSprite
        CrazyBird.GAMESTATUS.NOWSTATUS = CrazyBird.GAMESTATUS.LOST;
        this.lostSprite = cc.Sprite.create("#gameover.png");
        this.lostSprite.setPosition(cc.p(this.size.width/2,this.size.height/2));
        this.addChild(this.lostSprite,CrazyBird.MENU);
        this.unschedule(this.update);
        share(1,this.score);

    },
    reStartGame:function(){
        CrazyBird.GAMESTATUS.NOWSTATUS = CrazyBird.GAMESTATUS.PAUSE;
        var scene = new GameScene();
        cc.director.runScene(scene);
    },
    addScore:function(){
        this.score += 0.5;
        var score = Math.floor(this.score);
        if(score=this.score){
            audioMng.getInstance().playEffect(res.s_sfx_point_ogg);
        }
        this.scoreLabel.setString(score);
    },
    preFrames:function(){
        cc.spriteFrameCache.addSpriteFrames(res.s_flappy_packer_plist);
    },
    onTouchBegan:function(touch,event){
        if(CrazyBird.GAMESTATUS.NOWSTATUS == CrazyBird.GAMESTATUS.PAUSE){
            this.startGame();
            this.bird.fly();
        }else  if(CrazyBird.GAMESTATUS.NOWSTATUS == CrazyBird.GAMESTATUS.NORMAL){
            this.bird.fly();
        }else if(CrazyBird.GAMESTATUS.NOWSTATUS == CrazyBird.GAMESTATUS.LOST){
            this.reStartGame();
        }
        return true;
    },
    onTouchMoved:function(touch,event){

    },
    onTouchEnded:function(touch,event){

    },
    update:function(dt){
        if( CrazyBird.GAMESTATUS.NOWSTATUS ==CrazyBird.GAMESTATUS.NORMAL){
            this.GroundController.makeGround(dt);
            this.PipeLineController.makePipe(dt);
        }
        this.bird.update(dt);
    }
});
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new gameLayer();
        this.addChild(layer);
        layer.init();
    }
});
function share(m, num) {
    if (!cc.sys.isNative) {
        if (m == 0) {
            document["title"] = window["wxData"]["desc"] = TemplateUtils.getVariable("shareBefore");
        }
        if (m == 1) {
            document["title"] = window["wxData"]["desc"] = TemplateUtils.getVariable("shareAfter", {"number": num});
        }
    }
}