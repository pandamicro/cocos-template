#!/usr/bin/env python2.7
# coding=utf-8

import os
import sys
import re
import shutil
import errno
import commands

keep_in_assets = ["script"]
skip_in_src = ["cocos2d-html5.js", "CMakeLists.txt", "frameworks", "index.html", "runtime", "tools", ".cocos-project.json", ".DS_Store", ".idea"]
default_storepass = "android"
default_keypass = "android"
default_keystore = "androiddebugkey"

def repackageApk(apkFile, assetsPath, outApkPath, packageName, appName, keystorePath = "debug.keystore", storepass = default_storepass, keypass = default_keypass, keystore = default_keystore):
    """
    Modify a apk's resouce.

    It deal with some things,as follows:
        1.Decode apk.
        2.Remove old resource.
        3.Add new resouce.
        4.Change package name and app name
        5.Repackage apk.
        6.Add signer.

    Returns:
        Sucessful is return True, otherwise return False
    """
    apktoolPath = os.path.abspath("./apktool")
    jarsignerPath = os.path.abspath("./jarsigner")
    if keystorePath == "":
        keystorePath = os.path.abspath("debug.keystore")
    else:
        keystorePath = os.path.abspath(keystorePath)

    if storepass == "":
        storepass = default_storepass
    if keypass == "":
        keypass = default_keypass
    if keystore == "":
        keystore = default_keystore

    splited = os.path.splitext(os.path.basename(apkFile))
    packagePath = os.path.abspath("./") + "/" + splited[0]
    dstAssetsPath = packagePath + "/assets/"

    outApk = os.path.abspath(outApkPath)

    bModify = True

    # Decode package
    decodecmd = "%s d %s" % (apktoolPath, apkFile)
    decodecmd = decodecmd.replace('\\', '/')
    decodecmd = re.sub(r'/+', '/', decodecmd)
    bReturn = os.system(decodecmd)
    #print output
    if bReturn != 0:
        print u"Decode apk error:%s" % (apkFile)
        bModify = False

    # Remove old resource
    for root, dirs, files in os.walk(dstAssetsPath):
        for dirname in dirs:
            # skip
            if dirname in keep_in_assets:
                continue
            if dirname.find(".") == 0:
                continue
            dirToRemove = os.path.join(root, dirname)
            shutil.rmtree(dirToRemove)
        for filename in files:
            # skip
            if filename in keep_in_assets or os.path.basename(root) in keep_in_assets:
                continue
            if filename.find(".") == 0:
                continue
            fileToRemove = os.path.join(root, filename)
            os.remove(fileToRemove);

    # Add new resources
    for ford in os.listdir(assetsPath):
        # skip
        if ford in skip_in_src:
            continue

        srcFord = os.path.join(assetsPath, ford)
        dstFord = os.path.join(dstAssetsPath, ford)
        # Copy all files in a folder
        if os.path.isdir(srcFord):
            shutil.copytree(srcFord, dstFord)
        # Copy a file
        else:
            shutil.copyfile(srcFord, dstFord)

    # Modify package name and app name
    manifest = packagePath + "/AndroidManifest.xml"
    f = open(manifest, 'r+')
    content = f.read()
    f.seek(0)
    f.truncate()
    content = re.sub(r'package\=\"[\w\.\_\-\d]+\"', r'package="'+packageName+'"', content)
    f.write(content)
    f.close()

    strings = packagePath + "/res/values/strings.xml"
    f = open(strings, 'r+')
    content = f.read()
    f.seek(0)
    f.truncate()
    content = re.sub(r'name\=\"app_name\"\>[\w\.\_\-\d]+\<', r'name="app_name">'+appName+'<', content)
    f.write(content)
    f.close()

    # Repackage apk
    buildcmd = "%s b %s %s" % (apktoolPath, packagePath, outApk)
    buildcmd = buildcmd.replace('\\', '/')
    buildcmd = re.sub(r'/+', '/', buildcmd)
    bReturn = os.system(buildcmd)
    #print output
    if bReturn != 0:
        print u"Build apk error:%s" % (outApk)
        bModify = False

    # Add signer
    if bModify:
        #jarsigner命令格式：-verbose输出详细信息 -storepass 密钥密码
        #-keystore 密钥库位置 要签名的文件 文件别名
        #jarsigner -verbose -keystore punchbox.keystore -storepass w3297825w
        #-keypass w3297825w apk android123.keystore -sigalg MD5withRSA -digestalg SHA1
        outApk = outApk.replace('\\', '/')
        jarsingnCmd = ("jarsigner -verbose -keystore %s -storepass %s \
            -keypass %s %s  %s -sigalg MD5withRSA -digestalg SHA1" %(keystorePath, 
            storepass, keypass, outApk, keystore)
        )

        bReturn = os.system(jarsingnCmd)
        #output = os.popen(jarsingnCmd).read()
        #print output
        if bReturn != 0:
            print u"jarsigner error:%s" % (apkAbsPath)
            bModify = False

    return bModify

repackageApk(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])

