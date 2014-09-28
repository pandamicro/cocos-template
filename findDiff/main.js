
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    var mode = cc.sys.isMobile ? cc.ResolutionPolicy.FIXED_WIDTH : cc.ResolutionPolicy.SHOW_ALL;
    cc.view.setDesignResolutionSize(480, 852, mode);
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadJson("template.json", function(err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            g_resources = g_resources.concat(TemplateUtils.getResourcesList());
            if (!cc.sys.isNative) {
                var shareInfo = TemplateUtils.getShare();
                if (shareInfo && shareInfo["wechat"] && shareInfo["wechat"]["imgUrl"]) {
                    var href = window.location.href, base = href,
                        lastpt = href.lastIndexOf("."),
                        last = href.lastIndexOf("/");
                    if (last != -1 && lastpt > last)
                        base = base.substr(0, last);
                    var path = shareInfo["wechat"]["imgUrl"];
                    if (path[0] != "/")
                        path = "/" + path;
                    window["wxData"]["imgUrl"] = base + path;
                }
            }
        }
        else {
            cc.error("Template parse failed");
        }
        share(0);
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            GameScene.instance = new GameScene();
            cc.view.setResizeCallback(GameScene.instance.relocate.bind(GameScene.instance));
            cc.director.runScene(GameScene.instance);
        });
    }, this);
};
cc.game.run();