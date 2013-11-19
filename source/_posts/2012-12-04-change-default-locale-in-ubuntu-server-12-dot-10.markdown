---
layout: post
title: "Ubuntu Server 12.10修改语言环境"
date: 2012-12-04 16:59
comments: true
categories: 
---
>安装的时候把ubuntu server的默认语言设置成了中文，由于默认没有安装中文字体，控制台一片乱码。所有要么安装字体`sudo apt-get install language-pack-zh`,要么把语言环境设置成英文。

网上大部分文章都提到修改`/etc/environment`文件，但是打开`/etc/environment`文件，默认是空的，说明这种方法虽然可以达到效果，但不是最完美的。更好的方式如下：

	$ sudo update-locale LANG=en_US.UTF-8
	$ sudo update-locale LANGUAGE=en_US.en
	
然后重启系统即可。

<!-- more -->

###参考文献
1. [How to change the default locale in ubuntu 10.10 server](http://askubuntu.com/questions/89976/how-to-change-the-default-locale-in-ubuntu-10-10-server)
2. [Ubuntu Server下配置UTF-8中文/英文环境](http://www.slyar.com/blog/ubuntu-server-utf8-zhcn.html)