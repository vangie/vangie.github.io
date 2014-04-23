---
layout: post
title: "MacOS X里升级GoAgent后台服务"
date: 2013-03-28 10:04
comments: true
categories: 
---
> 本篇是[MacOS X将GoAgent配置为后台服务](http://codelife.me/blog/2012/09/03/goagent-run-as-deamon-in-macos-x/)的姊妹篇，主要分享一下将GoAgent配置成随机启动的LaunchAgent后如何升级，并提供一个方便的管理脚本。

##升级

###下载安装

假设GoAgent的安装目录为`~/Library/`

下载最新的GoAgent，当前版本为v2.1.14。解压后得到`goagent-goagent-beadcf8`目录,将其移动到`~/Library/`目录

	mv goagent-goagent-beadcf8 ~/Library/
	
并在同目录下创建一个文件链接，

	cd ~/Library/;rm goagent
	ln -sf goagent-goagent-beadcf8 goagent
	
<!-- more -->

###上传服务端
	
进入`~/Library/goagent/server`目录执行

	uploaddir=python python uploader.zip

然后按照命令行的提示输入APPID，还有gmail账号和密码上传服务端。

###配置客户端

打开`~/Library/goagent/local/proxy.ini`文件,修改[gae]段的appid，如果有password别忘了填。

###修改LaunchAgent脚本 
	
修改`~/Library/LaunchAgents/com.googlecode.goagent.plist`文件

将

	/Users/vangie/Library/goagent-goagent-******/local/proxy.py

改为

	/Users/vangie/Library/goagent/local/proxy.py
	
这个文件只需要该一次，今后升级只需要`ln -sf`创建一个链接就可以了。

##重启LaunchAgent

	launchctl unload -w ~/Library/LaunchAgents/com.googlecode.goagent.plist
	launchctl load -w ~/Library/LaunchAgents/com.googlecode.goagent.plist
	
launchctl没有reload或者restart参数，重启挺麻烦的，而且命令不好记。

使用下面的脚本就方便多了，把脚本保存为`goagentctl`，保存到`$PATH`目录，我放在`~/bin`下面

    #!/bin/sh
    #
    # author: Vangie Du
    # url: http://codelife.me/blog/2013/03/28/upgrade-goagent-daemon-in-macos-x
    # version: 1.0
    #
    #
    ARGV="$@"
    #
    # |||||||||||||||||||| START CONFIGURATION SECTION  ||||||||||||||||||||
    # --------------------                              --------------------
    #
    # pick up any necessary environment variables
    if test -f /usr/sbin/envvars; then
      . /usr/sbin/envvars
    fi
    # --------------------                              --------------------
    # ||||||||||||||||||||   END CONFIGURATION SECTION  ||||||||||||||||||||

    LAUNCHCTL="/bin/launchctl"
    LAUNCHD_JOB="/Users/vangie/Library/LaunchAgents/com.googlecode.goagent.plist"
    LAUNCHD_JOB_NAME="com.googlecode.goagent"


    run_launchctl() {
        $LAUNCHCTL $@
    }


    ERROR=0

    case $ARGV in
    start)
        run_launchctl load -w $LAUNCHD_JOB
        ERROR=$?
        ;;
    stop)
        run_launchctl unload -w $LAUNCHD_JOB
        ERROR=$?
        ;;
    restart)
        run_launchctl unload -w $LAUNCHD_JOB 2> /dev/null
        run_launchctl load -w $LAUNCHD_JOB
        ERROR=$?
        ;;
    status)
        run_launchctl list | grep  $LAUNCHD_JOB_NAME > /dev/null
        if [ $? -eq 1 ]
        then
            echo goagent daemon is stopped.
        else
            echo goagent daemon is running...
        fi
        ;;
    *)
        echo 'goagentctl (start|stop|restart|status)'
        ;;
    esac

    exit $ERROR
 
 然后执行
 
 	goagentctl restart