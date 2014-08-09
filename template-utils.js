TemplateUtils = (function() {

    var _inited = false,
        _templateId = null,
        _templateVars = null,
        _scenes = null,
        _share = null,
        _sceneStartFuncs = [],
        _sceneExitFuncs = [],
        _currentScene = "",
        _sceneStack = [];

    var _propertyWhiteList = [
        "x", "y",
        "width", "height",
        "boundingWidth", "boundingHeight",
        "anchorX", "anchorY",
        "scale", "scaleX", "scaleY",
        "rotation", "visible", "opacity", "color",
        "textAlign", "verticalAlign", "fontSize", "fontName", "fillStyle"
    ];

    var _parseValue = function (key, value) {
        var result;
        switch(key) {
        case "color":
        case "fillStyle":
            result = cc.color(value);
            break;
        case "textAlign":
        case "verticalAlign":
            result = cc[value];
            break;
        default :
            result = value;
            break;
        }
        return result;
    };

    return {
        init: function(jsonObj) {
            _templateId = jsonObj.templateId;
            _templateVars = jsonObj.templateVars;
            _scenes = jsonObj.scenes;
            _share = jsonObj.share;
            _inited = true;
        },

        getTemplateVars: function() {
            return _templateVars;
        },

        getSceneVars: function(scene) {
            return _scenes[scene];
        },

        registerScene: function(scene, startFunc, exitFunc) {
            if (typeof startFunc == "function") {
                _sceneStartFuncs[scene] = startFunc;
            }
            if (typeof exitFunc == "function") {
                _sceneExitFuncs[scene] = exitFunc;
            }
        },

        runScene: function(scene) {
            if (_sceneStartFuncs[scene]) {
                _sceneExitFuncs[_currentScene] && _sceneExitFuncs[_currentScene]();

                _currentScene = scene;
                _sceneStack.length = 0;
                _sceneStack.push(_currentScene);

                _sceneStartFuncs[scene]();
            }
        },

        pushScene: function(scene) {
            if (_sceneStartFuncs[scene] && _currentScene != scene) {
                _currentScene = scene;
                _sceneStack.push(_currentScene);
                _sceneStartFuncs[scene]();
            }
        },

        popScene: function() {
            if (_sceneExitFuncs[_currentScene]) {
                _sceneExitFuncs[_currentScene]();
                var lastid = _sceneStack.length - 1;
                if (lastid >= 0 && _sceneStack[lastid] == _currentScene) {
                    _sceneStack.pop();
                    if (lastid > 0)
                        _currentScene = _sceneStack[lastid-1];
                    else _currentScene = "";
                }
            }
        },

        pauseGame: function() {
            cc.director.pause();
        },

        resumeGame: function() {
            cc.director.resume();
        },

        getVariable: function(name, config) {
            if (!_inited) return null;
            var def = _templateVars[name];
            var result = null, node;
            var attrs = {}, key, value, sceneDef;

            switch (def.type) {
            case "IMAGE":
                result = node = new cc.Sprite(def.texUrl);
            break;
            case "ANIMATION":
                var animation, frames = [], frame, tex, rect = cc.rect(0, 0, 0, 0), interval = def.interval || 0.2;
                if (def.texs && def.texs.length > 0) {
                    for (var i = 0, l = def.texs.length; i < l; ++i) {
                        tex = cc.TextureCache.addImage(def.texs[i]);
                        rect.width = tex.width;
                        rect.height = tex.height;
                        frame = new cc.SpriteFrame(tex, rect);
                        frames.push(frame);
                    }
                }
                else if (def.texUrl) {
                    var row = def.row, col = def.col, unitW, unitH;
                    tex = cc.TextureCache.addImage(def.texUrl);
                    rect.width = unitW = Math.floor(tex.width/col);
                    rect.height = unitH = Math.floor(tex.height/row);
                    for (var r = 0; r < row; ++r){
                        for (var c = 0; c < col; ++c) {
                            rect.x = c * unitW;
                            rect.y = r * unitH;
                            frame = new cc.SpriteFrame(tex, rect);
                        }
                    }
                }
                node = new cc.Sprite(frame);
                animation = new cc.Animation(frames, interval);
                result = {"node": node, "animation": animation};
            break;
                case "LABEL":
                var args = [def.string];
                for (var i = 0, l = def.variables ? def.variables.length : 0; i < l; ++i) {
                    key = def.variables[i];
                    if (config && config[key])
                        args.push(config[key]);
                    else args.push(null);
                }
                var string = cc.formatStr.apply(null, args);
                result = node = new cc.LabelTTF(string, def.fontName || "Arial", def.fontSize || "12");
            break;
            case "SOUND":
                isNode = false;
            break;
            }

            if (node) {
                if (_currentScene && _scenes[_currentScene]) {
                    sceneDef = _scenes[_currentScene][name];
                }

                for (var i = 0, l = _propertyWhiteList.length; i < l; ++i) {
                    key = _propertyWhiteList[i];
                    // Scene def have a higher priority
                    if (sceneDef && undefined !== sceneDef[key])
                        value = sceneDef[key];
                    else if (undefined !== def[key])
                        value = def[key];
                    else continue;

                    attrs[key] = _parseValue(key, value);
                }

                node.attr(attrs);
            }

            return result;
        },

        showVariable: function() {

        }
    };
})();