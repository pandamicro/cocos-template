cc.game.onStart = function () {
    cc.view.adjustViewPort(true);
    if (cc.sys.isMobile)
        cc.view.setDesignResolutionSize(720,1280,cc.ResolutionPolicy.FIXED_WIDTH);
    else cc.view.setDesignResolutionSize(720,1280,cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.loader.loadJson("template.json", function (err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            g_resources = g_resources.concat(TemplateUtils.getResourcesList());
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
        else {
            cc.error("Template parse failed");
        }
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new GameScene());
        }, this);
    }, this);
};
cc.game.run();