var res = {
    s_mainBg : "res/bg.png",
    s_ground : "res/ground.png",
    s_flappy_packer_png : "res/flappy_packer.png",
    s_flappy_packer_plist : "res/flappy_packer.plist",
    s_flappy_frame_plist : "res/flappy_frame.plist",
    s_sfx_die_ogg : "res/sounds/sfx_die.ogg",
    s_sfx_hit_ogg : "res/sounds/sfx_hit.ogg",
    s_sfx_point_ogg : "res/sounds/sfx_point.ogg",
    s_sfx_swooshin_ogg : "res/sounds/sfx_swooshing.ogg",
    s_sfx_winge_ogg : "res/sounds/sfx_wing.ogg"
}
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}