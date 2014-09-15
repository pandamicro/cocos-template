cc.game.onStart = function () {
    var mode = cc.sys.isNative ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.SHOW_ALL;
    cc.view.setDesignResolutionSize(321, 500, mode);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.loader.loadJson("template.json", function (err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            g_resources = g_resources.concat(TemplateUtils.getResourcesList());
            var shareInfo = TemplateUtils.getShare();
            if (shareInfo && shareInfo["wechat"] && shareInfo["wechat"]["imgUrl"]) {
                var href = window.location.href, base = href;
                var last = href.lastIndexOf("/");
                if (last != -1)
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
            cc.director.runScene(new gameScene());
        }, this);
    }, this);
};
cc.game.run();