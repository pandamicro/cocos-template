# repackager.py的使用方式：

在apk-repackager目录下执行：
python repackager.py ../Template_project-debug.apk ../wxcat ../wxcat.apk org.cocos2dx.Hahaha hahaha

参数列表：
1. 基础APK包，这个已经提供
2. 打包的目标工程根目录
3. 输出apk存储路径
4. 输出apk包名
5. 输出apk应用名
6. [可选]keystore文件路径
7. [可选]store pass密码
8. [可选]key pass密码
9. [可选]keystore别名