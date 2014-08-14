/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc.LoaderScene = cc.Scene.extend({
    _interval : null,
    _length : 0,
    _count : 0,
    _label : null,
    _className:"LoaderScene",
    _drawLoading:null,

    ctor : function() {
        this._super();

        this._drawLoading = (function() {
            var canvas = cc._canvas, ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height, x = w / 2, y = h / 2, r = 8, d = 22, pos = [[44,22], [44,0], [22,0], [0,0], [0,22], [0,44], [22,44]], PI2 = Math.PI* 2, rx, ry;
            var dt_move = 11, dt_wait = 3, dt = dt_move + dt_wait, t = 0, total_t = dt * 7, ds = 22 / dt_move, curr_t = 0, direction = 0, mo = 2.5;
            return function () {
                if(t == total_t + 15) t = 0;
                curr = Math.floor(t / dt), curr_t = t % dt;
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, x, y);
                ctx.fillStyle = "#000"; ctx.fillRect(-x, -y, w, h);
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI*2); ctx.stroke();
                ctx.fillStyle = "#fff"; ctx.translate(-d, -d);
                for(var i = 0; i < 7; i++) {
                    if(curr_t == dt_move && i == curr) {direction == 0 && (pos[i][1] += mo); direction == 1 && (pos[i][0] -= mo); direction == 2 && (pos[i][1] -= mo); direction == 3 && (pos[i][0] += mo);}
                    if(curr_t == dt_move + 2 && i == curr) {direction == 0 && (pos[i][1] -= mo); direction == 1 && (pos[i][0] += mo); direction == 2 && (pos[i][1] += mo); direction == 3 && (pos[i][0] -= mo);}
                    rx = pos[i][0], ry = pos[i][1];
                    if(curr_t < dt_move && i == curr) {
                        if(rx == 44 && ry < 44) (pos[i][1] = ry += ds) && (direction = 0);
                        else if(ry == 44 && rx > 0) (pos[i][0] = rx -= ds) && (direction = 1);
                        else if(rx == 0 && ry > 0) (pos[i][1] = ry -= ds) && (direction = 2);
                        else if(ry == 0 && rx < 44) (pos[i][0] = rx += ds) && (direction = 3);
                    }
                    ctx.beginPath(); ctx.arc(rx, ry, r, 0, PI2); ctx.fill();
                }
                ctx.beginPath(); ctx.arc(22, 22, r, 0, PI2); ctx.fill();
                ctx.restore();
                t++;
            };
        })();
    },
    init : function(){
        this.scheduleUpdate();

        //loading percent
        var label = this._label = cc.LabelTTF.create("加载中... 0%", "Arial", 24);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, -50)));
        label.setColor(cc.color(180, 180, 180));
        this.addChild(this._label, 10);
        return true;
    },

    update: function() {
        this._drawLoading();
    },

    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },

    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "加载中... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     */
    initWithResources: function (resources, cb) {
        if(typeof resources == "string") resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        self._length = res.length;
        self._count = 0;
        cc.loader.load(res, function(result, count){ self._count = count; }, function(){
            if(self.cb)
                self.cb();
        });
        self.schedule(self._updatePercent);
    },

    _updatePercent: function () {
        var self = this;
        var count = self._count;
        var length = self._length;
        var percent = (count / length * 100) | 0;
        percent = Math.min(percent, 100);
        self._label.setString("加载中... " + percent + "%");
        if(count >= length) self.unschedule(self._updatePercent);
    }
});
cc.LoaderScene.preload = function(resources, cb){
    var _cc = cc;
    if(!_cc.loaderScene) {
        _cc.loaderScene = new cc.LoaderScene();
        _cc.loaderScene.init();
    }
    _cc.loaderScene.initWithResources(resources, cb);

    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};