
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    var mode = cc.sys.isMobile && window.navigator.userAgent.indexOf("MicroMessenger")!=-1 ? cc.ResolutionPolicy.FIXED_WIDTH : cc.ResolutionPolicy.SHOW_ALL;
    cc.view.setDesignResolutionSize(321, 500, mode);
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadJson("template.json", function(err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            resources = resources.concat(TemplateUtils.getResourcesList());
        }
        else {
            cc.error("Template parse failed");
        }
        //load resources
        cc.LoaderScene.preload(resources, function () {
            gameScene = new GameScene();
            cc.director.runScene(gameScene);
        });
    }, this);
};
cc.game.run();