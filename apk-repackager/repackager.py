#!/usr/bin/env python2.7
# coding=utf-8

import os
import sys
import re
import shutil
import errno
import commands

keep_in_assets = ["assets/script"]
skip_in_src = ["CMakeLists.txt", "frameworks", "index.html", "runtime", "tools", ".cocos-project.json", ".DS_Store", ".idea"]
storepass = "android"
keypass = "android"
keystore = "androiddebugkey"

def removeFolder(src, dst):
    try:
        shutil.copytree(src, dst)
    except OSError as exc: # python >2.5
        if exc.errno == errno.ENOTDIR:
            shutil.copy(src, dst)
        else: raise

def repackageApk(apkFile, assetsPath, keyStore):
    """Modify a apk's resouce.

    It deal with some things,as follows:
        1.Remove old signer.
        2.Remove old resource.
        3.add new resouce.
        4.add signer

    Returns:
        Sucessful is return True, otherwise return False
    """
    aaptPath = os.path.abspath("./aapt")
    jarsignerPath = os.path.abspath("./jarsigner")
    keystorePath = os.path.abspath("debug.keystore")

    outApk = os.path.dirname(apkFile) + "/out_" + os.path.basename(apkFile)
    shutil.copyfile(apkFile, outApk)
    apkAbsPath = os.path.abspath(outApk)

    bModify = True
    #Remove signer
    listcmd =  "%s list %s" % (aaptPath, apkAbsPath)
    listcmd = listcmd.encode("gb2312")
    output = os.popen(listcmd).read()
    filelist = output.split('\n')
    for filename in filelist:
        if filename.find("META-INF") == 0:
            rmcmd = "%s remove %s %s" % (aaptPath, apkAbsPath, filename)
            rmcmd = rmcmd.replace('\\', '/')
            rmcmd = re.sub(r'/+', '/', rmcmd)
            bReturn = os.system(rmcmd)

    # Delete apk old assets
    for filename in filelist:
        if filename.find("assets") != 0:
            continue
        skip = False
        for subpath in keep_in_assets:
            if filename.find(subpath) == 0:
                skip = True
                break
        if skip:
            continue

        print u"Remove %s" % (filename)
        rmcmd = u"%s remove %s %s" % (aaptPath, apkAbsPath, filename)
        rmcmd = rmcmd.replace('\\', '/')
        rmcmd = re.sub(r'/+', '/', rmcmd)
        rmcmd = rmcmd.encode("gb2312")
        bReturn = os.system(rmcmd)

    # Create destination assets folder
    os.chdir(assetsPath)
    dst = "runtime/android/assets"
    if os.path.exists(dst):
        shutil.rmtree(dst)
    os.makedirs(dst)
    # Copy new assets to assets folder
    for ford in os.listdir("./"):
        # skip
        if ford in skip_in_src:
            continue

        dstFile = os.path.join(dst, ford)
        # Copy all files in a folder
        if os.path.isdir(ford):
            shutil.copytree(ford, dstFile)
        # Copy a file
        else:
            shutil.copyfile(ford, dstFile)

    # Add new assets to apk
    os.chdir("runtime/android/")
    for root, dirs, files in os.walk("assets/"):
        for name in files:
            if name.find(".") == 0:
                continue
            srcFileName = os.path.join(root, name)
            addcmd = u"%s add %s %s" % (aaptPath, apkAbsPath, srcFileName)
            addcmd = addcmd.replace('\\', '/')
            addcmd = re.sub(r'/+', '/', addcmd)
            addcmd = addcmd.encode("gb2312")
            bReturn = os.system(addcmd)
            print "add %s" % (srcFileName)
            if bReturn != 0:
                print u"add error-->%s" % (srcFileName)
                bModify = False
                break

    os.chdir("../../")
    shutil.rmtree(dst)

    #Add signer.
    if bModify:
        #jarsigner命令格式：-verbose输出详细信息 -storepass 密钥密码
        #-keystore 密钥库位置 要签名的文件 文件别名
        #jarsigner -verbose -keystore punchbox.keystore -storepass w3297825w
        #-keypass w3297825w apk android123.keystore -sigalg MD5withRSA -digestalg SHA1
        apkAbsPath = apkAbsPath.replace('\\', '/')
        jarsingnCmd = ("jarsigner -verbose -keystore %s -storepass %s \
            -keypass %s %s  %s -sigalg MD5withRSA -digestalg SHA1" %(keystorePath, 
            storepass, keypass, apkAbsPath, keystore)
        )

        bReturn = os.system(jarsingnCmd)
        #output = os.popen(jarsingnCmd).read()
        #print output
        if bReturn != 0:
            print u"jarsigner error:%s" % (apkAbsPath)
            bModify = False

    return bModify

repackageApk(sys.argv[1], sys.argv[2], "")

