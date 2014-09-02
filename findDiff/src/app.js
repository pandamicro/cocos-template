// Constants
var REPEAT_EACH_LEVEL = 5,
    START_COUNT = 3,
    MAX_LEVEL = 7,
    SIZE = 400,
    MARGIN = 40,
    GAP = 5,
    LAYER_TAG = 1,
    TIMER = 60;

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

        this.bake();

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
    score: null,
    ctor: function() {
        this._super(cc.color("#F06060"));

        var label = new cc.LabelTTF("过关：", "宋体", 20);
        this.score = new cc.LabelTTF("0", "宋体", 20);
        label.x = 20;
        this.score.x = 80;
        label.anchorX = this.score.anchorX = 0;
        label.y = this.score.y = cc.visibleRect.height - 60;
        label.color = this.score.color = cc.color(0, 0, 0);
        this.addChild(label);
        this.addChild(this.score);

        this.bake();
    }
});

var GameScene = cc.Scene.extend({
    repeat : 0,
    current_level : 0,
    background : null,
    start_time: 0,
    current_time: TIMER,
    timer_label: null,
    ctor: function() {
        this._super();
        this.background = new Background();
        this.addChild(this.background);

        this.timer_label = new cc.LabelTTF(this.current_time, "宋体", 20);
        this.timer_label.x = cc.visibleRect.width/2;
        this.timer_label.y = cc.visibleRect.height - 60;
        this.timer_label.color = cc.color(0, 0, 0);
        this.addChild(this.timer_label);

        this.start_time = Date.now();
        this.scheduleUpdate();
    },
    onEnter:function () {
        this._super();

        this.nextLevel();
    },
    update: function() {
        var duration = (Date.now() - this.start_time)/1000;
        if (TIMER - duration < this.current_time) {
            this.current_time = Math.floor(TIMER - duration);
            this.timer_label.setString(this.current_time);
        }
    },
    nextLevel : function() {
        this.repeat++;
        if (this.repeat == REPEAT_EACH_LEVEL) {
            this.repeat = 0;
            if (this.current_level < MAX_LEVEL) {
                this.current_level++;
            }
        }

        var layer = new Level(this.current_level);
        layer.x = cc.visibleRect.width/2 - SIZE/2;
        layer.y = cc.visibleRect.height/2 - SIZE/2;
        this.removeChildByTag(LAYER_TAG);
        this.addChild(layer, 1, LAYER_TAG);
    }
});
GameScene.instance = null;
