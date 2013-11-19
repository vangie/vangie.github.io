---
layout: post
title: "如何为MacOS X终端设置代理"
date: 2012-09-02 04:06
comments: true
categories: 
---
>本文介绍如何在MacOS X终端里使用代理访问网络,虽然只在Mountain Lion下测试，但同样适用于装有Bash的系统。

实在无法忍受[linode]日本机房的高延迟，动手配置了一个[goagent]服务。但是HTTP代理和VPN不同，没法全局代理（_至少不能简单配置_），在Terminal里下载最新版本的Ruby，奇慢无比，下面介绍如何让Terminal里执行的程序使用[goagent]代理。

<!-- more -->

### Socks代理

使用tsocks可以为任意程序提供socks代理
####安装tsocks
	$ brew tap adamv/alt
	$ brew install tsocks
####配置tsocks
打开配置文件/usr/local/etc/tsocks.conf

修改如下

	local = 192.168.0.0/255.255.255.0
	server = 127.0.0.1
	server_type = 5
	server_port = 8080

### HTTP代理

	$ export http_proxy='http://YOUR_USERNAME:YOUR_PASSWORD@PROXY_IP:PROXY_PORT/'
	
### HTTPS代理

	$ export https_proxy='http://YOUR_USERNAME:YOUR_PASSWORD@PROXY_IP:PROXY_PORT/'
	
	
### 取消HTTP/HTTPS代理

	$ unset http_proxy
	$ unset https_proxy

	
### 例子

让Terminal里的http访问走[goagent]的默认端口8087

	$ export http_proxy='http://localhost:8087'
	$ export https_proxy='http://localhost:8087'
	$ tsocks /Applications/Textual.app/Contents/MacOS/Textual
	
### 使用Privoxy将socks代理转换为HTTP代理
使用`ssh -D`可以获得一个socks5代理，privoxy可以将socks转换为http代理

安装privoxy

	brew install privoxy
	
修改配置文件`vim /usr/local/etc/privoxy/config`

	listen-address  0.0.0.0:8118
	forward-socks5 / localhost:1080 .
	
	
#### 参考文章

1. [HOW TO SET A PROXY FOR THE TERMINAL [QUICK LINUX TIP]](http://www.webupd8.org/2010/10/how-to-set-proxy-for-terminal-quick.html)
2. [tsocks](https://whatbox.ca/wiki/tsocks)
3. [用 Privoxy 在 Mac OS X/Linux/Ubuntu 上将 Socks5 转换为 HTTP 代理](https://voidcode.com/post/2679.html)
4. [http proxy over ssh, not socks](http://superuser.com/questions/280129/http-proxy-over-ssh-not-socks)

[linode]: http://www.linode.com/ "linode"
[goagent]: http://code.google.com/p/goagent/ "goagent"