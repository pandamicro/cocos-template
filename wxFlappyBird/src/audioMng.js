/**
 * Created by ysl on 14-1-22.
 */
var audioMng = cc.Class.extend({
    ctor:function(){
        this.audio = cc.audioEngine;
    },
    playMusic:function(str,loop){
        if(!CrazyBird.AUIDIO.PLAYMUSIC) return;
        this.audio.playMusic(str,loop);
    },
    stopMusic:function(){
        if(!CrazyBird.AUIDIO.PLAYMUSIC && !this.audio.isMusicPlaying()) return;
        this.audio.stopMusic();
    },
    pauseMusic:function(){
        if(!CrazyBird.AUIDIO.PLAYMUSIC && !this.audio.isMusicPlaying()) return;
        this.audio.pauseMusic();
    },
    playEffect:function(str,loop){
        if(!CrazyBird.AUIDIO.PLAYMUSIC) return;
        return this.audio.playEffect(str,loop);
    },
    pauseEffect:function(str){
        if(!CrazyBird.AUIDIO.PLAYMUSIC) return;
        this.audio.pauseEffect(str);
    },
    stopEffect:function(soundid){
        if(!CrazyBird.AUIDIO.PLAYMUSIC) return;
        this.audio.stopEffect(soundid);
    }

});
audioMng._instance = null;
audioMng.getInstance = function(){
    if(!audioMng._instance){
        audioMng._instance = new audioMng();
    }
    return audioMng._instance;
}