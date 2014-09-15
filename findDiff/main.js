
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    var mode = cc.sys.isMobile ? cc.ResolutionPolicy.FIXED_WIDTH : cc.ResolutionPolicy.SHOW_ALL;
    cc.view.setDesignResolutionSize(480, 852, mode);
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadJson("template.json", function(err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            g_resources = g_resources.concat(TemplateUtils.getResourcesList());
        }
        else {
            cc.error("Template parse failed");
        }
        share(0);
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            GameScene.instance = new GameScene();
            cc.director.runScene(GameScene.instance);
        });
    }, this);
};
cc.game.run();