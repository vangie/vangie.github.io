---
layout: post
title: "在OS X Mavericks上安装gdb"
date: 2014-07-14 00:19:21 +0800
comments: true
categories: 
---
>最近帮外甥女写一段C程序作业。代码量不多，所有采用Sublime Text + gcc的方式。遇到了奇怪的`segmentation fault`,没有显示具体错误行号，所有需要借助gdb(The GNU Project Debugger 是*nix环境下著名的调试程序)返回更多有效信息和断点调试。

###安装

    brew install gdb

###开启调试编译选项
希望gdb调试时输出行号与堆栈等详细信息需要`gcc`编译的时候使用`-g`选项

    gcc -o course_test -g -rdynamic course_test.c

注意 homebrew安装的gnu版本的`gcc`在macox上不支持`-rdynamic`选项，此处使用的是xcode提供的`gcc`。

<!-- more -->

###调试
    bash$ gdb course_test
    gdb>run
    ....
    The GDB command:
    „-exec-run“ returned the error:
    „,msg=„Unable to find Mach task port for process-id 62593:
    (os/kern) failure (0x5). (please check gdb is codesigned - see taskgated(8))““

不出意外将会遇到上述错误。这是由于macos的安全策略，homebrew安装的gdb没有签名导致。

###签名gdb

1. 打开 “钥匙串访问”，位于`/Applications/Utilities/Keychain Access.app`
2. 打开菜单 /钥匙串访问/证书助理/创建证书...
3. 在"创建您的证书"窗口设置如下
    * 名称: gdbc
    * 身份类型: 自签名根证书
    * 证书类型: 代码签名
    * 勾选"让我覆盖这些默认值"   
4. 点击"继续"，将"有效期（天数）"设置为: 3650
5. 点击若干次"继续"，指导出现"指定用于该证书的位置""
    * 钥匙串: 系统
6. 点击"创建"，会弹出用户名密码输入框，输入密码，点击"修改钥匙串"
7. 在“系统”钥匙串找到刚才创建的"gdbc"证书，右键"显示简介"，在“信任”分类下找到“代码签名”，指定为“总是信任”。
8. 退出“钥匙串访问”

要让刚刚添加的证书生效需要重启`taskgated`服务或者重启系统

    sudo killall taskgated

证书准备好了，接下来给gdb签名

    codesign -fs gdbc /usr/local/bin/gdb

###lldb
即使给签名gdb以后，在执行gdb调试仍然无法显示行号（行号显示为 ??），新版本的macox已经和gdb不兼容了，lldb是gdb的替代者。使用lldb调试可以显示错误发生位置的行号。

###参考阅读

1. [Install GDB on OS X Mavericks from source](http://blog.panks.me/posts/2013/11/install-gdb-on-os-x-mavericks-from-source/)
2. [GDB on OS X Mavericks and Xcode 5](http://wiki.lazarus.freepascal.org/GDB_on_OS_X_Mavericks_and_Xcode_5)
3. [How to get a “codesigned” gdb on OSX?](http://stackoverflow.com/questions/13913818/how-to-get-a-codesigned-gdb-on-osx)