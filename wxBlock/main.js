if(cc.sys.isNative){
    require("template-utils.js");
}
cc.game.onStart = function () {
    var mode = cc.sys.isNative ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.SHOW_ALL;
    cc.view.setDesignResolutionSize(321, 500, mode);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.loader.loadJson("template.json", function (err, jsonObj) {
        if (!err) {
            TemplateUtils.init(jsonObj);
            g_resources = g_resources.concat(TemplateUtils.getResourcesList());
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