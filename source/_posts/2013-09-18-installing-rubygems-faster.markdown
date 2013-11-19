---
layout: post
title: "解决国内rubygems速度慢的问题"
date: 2013-09-18 14:50
comments: true
categories: 
---
> 国内访问rubygems那个慢呀，尤其是走https协议。

###借用bash的http代理

一般来说通过翻墙代理访问的速度要更快一点。ruby遵守unix环境变量约定，支持http_proxy和https_proxy。

在执行`bundle install`之前先执行

	$ export http_proxy=http://127.0.0.1:xxxxx/
	$ export https_proxy=http://127.0.0.1:xxxxx/
	
当然前提是，系统有一个本地可用的http或者https代理。关于bash里使用http代理的细节参见[《如何为MacOS X终端设置代理》](http://codelife.me/blog/2012/09/02/how-to-set-proxy-for-terminal/)

###改用国内的镜像

	$ gem sources –r http://rubygems.org/
	$ gem sources -a http://ruby.taobao.org/
	$ gem sources -l
	*** CURRENT SOURCES ***

	http://ruby.taobao.org

	# 请确保只有 ruby.taobao.org
	


### 参考阅读
1. [国内访问rubygems.org好慢啊，大家有没有提速的方法？](http://ruby-china.org/topics/288)
2. [解决rubygems速度慢的Tips](http://tec.liux.in/28)