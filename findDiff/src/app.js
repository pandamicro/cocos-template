// Constants
var REPEAT_EACH_LEVEL = 5,
    START_COUNT = 3,
    MAX_LEVEL = 7,
    SIZE = 400,
    MARGIN = 40,
    GAP = 5,
    LAYER_TAG = 1,
    TIMER = 45;

var Level = cc.LayerColor.extend({
    sprite1:null,
    count: 0,
    ctor:function (level) {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color("#dddddd"), SIZE, SIZE);

        var count = this.count = level + START_COUNT;

        var tar_row = Math.floor(Math.random() * count),
            tar_col = Math.floor(Math.random() * count),
            size = (SIZE - (count+1) * GAP) / count,
            tex1, tex2, r, c, x, y, sprite, s1x, s1y, s2x, s2y;

        tex1 = TemplateUtils.getVariable("sprite1");
        this.sprite1 = new cc.Sprite(tex1);
        tex2 = TemplateUtils.getVariable("sprite2");
        s1x = size / tex1.width;
        s1y = size / tex1.height;
        s2x = size / tex2.width;
        s2y = size / tex2.height;

        for (r = 0; r < count; ++r) {
            for (c = 0; c < count; ++c) {
                x = GAP + c * (size + GAP) + size/2;
                y = GAP + r * (size + GAP) + size/2;
                // Sprite1
                if (r == tar_row && c == tar_col) {
                    sprite = this.sprite1;
                    sprite.scaleX = s1x;
                    sprite.scaleY = s1y;
                }
                else {
                    sprite = new cc.Sprite(tex2);
                    sprite.scaleX = s2x;
                    sprite.scaleY = s2y;
                }

                sprite.x = x;
                sprite.y = y;
                this.addChild(sprite);
            }
        }

        if(!cc.sys.isNative) this.bake();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                //var touch = touches[0];
                var pos = touch.getLocation(),
                    target = event.getCurrentTarget();
                var rect = cc.rect(GAP + tar_col * (size + GAP) + target.x,
                            GAP + tar_row * (size + GAP) + target.y,
                            size, size);

                if (cc.rectContainsPoint(rect, pos)) {
                    GameScene.instance.nextLevel();
                    return true;
                }
                return false;
            }
        }, this);
    }
});

var Background = cc.LayerColor.extend({
    ctor: function() {
        this._super(cc.color("#F06060"));

        var label = new cc.LabelTTF("过关：", "宋体", 20);
        label.x = 20;
        label.anchorX = 0;
        label.y = cc.director.getWinSize().height - 60;
        label.color = cc.color(0, 0, 0);
        this.addChild(label);

        //if(!cc.sys.isNative) this.bake();
    }
});

var ResultUI = cc.Layer.extend({
    notify: null,
    replay: null,
    label: null,
    notifyRect: null,
    replayRect: null,
    ctor: function(passed) {
        this._super();
        this.replay = new cc.Sprite(res.replay);
        this.notify = new cc.Sprite(res.notify);
        var size = cc.director.getWinSize();
        this.notify.x = size.width/2 - 170 + 80;
        this.replay.x = size.width/2 + 15 + 80;
        this.notify.y = this.replay.y = size.height/2 - 130;
        this.addChild(this.notify);
        this.addChild(this.replay);

        var level = Math.floor(passed/3);
        this.label = TemplateUtils.getVariable("result_label", {"level": level});
        this.label.x = size.width/2;
        this.label.y = size.height/2;
        this.addChild(this.label);

        share(1, level);

        this.notifyRect = this.notify.getBoundingBox();
        this.replayRect = this.replay.getBoundingBox();
        //if(!cc.sys.isNative) this.bake();
    },

    onEnter: function() {
        this._super();
        var size = cc.director.getWinSize();
        this.notify.x = size.width/2 - 170 + 80;
        this.replay.x = size.width/2 + 15 + 80;
        this.notify.y = this.replay.y = size.height/2 - 130;
        this.label.x = size.width/2;
        this.label.y = size.height/2;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();

                if (cc.rectContainsPoint(target.replayRect, pos)) {
                    GameScene.instance.restart();
                    return true;
                }
                else if (cc.rectContainsPoint(target.notifyRect, pos)) {
                    GameScene.instance.share();
                    return true;
                }
                return false;
            }
        }, this);
    }
});

var ShareUI = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite(res.arrow);
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 15;
        arrow.y = cc.winSize.height - 5;
        this.addChild(arrow);

        var label = new cc.LabelTTF("请点击右上角的菜单按钮\n再点\"分享到朋友圈\"\n让好友们挑战你的分数！", "宋体", 20, cc.size(cc.winSize.width*0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height - 100;
        label.anchorY = 1;
        this.addChild(label);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                GameScene.instance.gameOver();
                return true;
            }
        }, this);
    },

    onExit: function () {
        cc.eventManager.removeListeners(this);
        this._super();
    }
});

var GameScene = cc.Scene.extend({
    repeat : 0,
    current_level : 0,
    background : null,
    start_time: 0,
    current_time: TIMER,
    timer_label: null,
    gaming : false,
    score: null,
    passed : -1,
    ctor: function() {
        this._super();
        this.background = new Background();
        this.addChild(this.background);

        var size = cc.director.getWinSize();
        this.timer_label = new cc.LabelTTF(this.current_time, "宋体", 20);
        this.timer_label.x = size.width/2;
        this.timer_label.y = size.height - 60;
        this.timer_label.color = cc.color(0, 0, 0);
        this.addChild(this.timer_label);

        this.score = new cc.LabelTTF("0", "宋体", 20);
        this.score.x = 80;
        this.score.anchorX = 0;
        this.score.y = size.height - 60;
        this.score.color = cc.color(0, 0, 0);
        this.addChild(this.score);

        this.start_time = Date.now();
        this.scheduleUpdate();
    },
    onEnter:function () {
        this._super();

        this.restart();
    },
    update: function() {
        if (!this.gaming)
            return;

        var duration = (Date.now() - this.start_time)/1000;
        if (TIMER - duration < this.current_time) {
            this.current_time = Math.floor(TIMER - duration);
            if (this.current_time < 0) {
                this.current_time = 0;
                this.gameOver();
            }
            this.timer_label.setString(this.current_time);

        }
    },
    restart: function() {
        share(0);
        this.current_level = 0;
        this.current_time = TIMER;
        this.repeat = 0;
        this.passed = -1;
        this.start_time = Date.now();
        this.nextLevel();
    },
    nextLevel : function() {
        this.repeat++;
        if (this.repeat == REPEAT_EACH_LEVEL) {
            this.repeat = 0;
            if (this.current_level < MAX_LEVEL) {
                this.current_level++;
            }
        }
        this.passed++;
        this.score.string = this.passed;

        var layer = new Level(this.current_level);
        layer.x = cc.visibleRect.width/2 - SIZE/2;
        layer.y = cc.visibleRect.height/2 - SIZE/2;
        this.removeChildByTag(LAYER_TAG);
        this.addChild(layer, 1, LAYER_TAG);
        this.gaming = true;
    },
    gameOver: function() {
        this.removeChildByTag(LAYER_TAG);
        this.addChild(new ResultUI(this.passed), 1, LAYER_TAG);
        this.gaming = false;
    },
    share: function() {
        this.removeChildByTag(LAYER_TAG);
        this.addChild(new ShareUI(), 1, LAYER_TAG);
        this.gaming = false;
    }
});
GameScene.instance = null;

function share(m, level){
    if (cc.sys.isNative) return;

    if(m == 0){
        document["title"] = window["wxData"]["desc"] = TemplateUtils.getVariable("default_title");
    }
    if(m == 1){
        document["title"] = window["wxData"]["desc"] = TemplateUtils.getVariable("result_title", {"level": level});
    }
}
