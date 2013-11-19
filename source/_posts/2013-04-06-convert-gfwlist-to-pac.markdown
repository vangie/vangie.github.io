---
layout: post
title: "gfwlist转换成PAC文件"
date: 2013-04-06 12:12
comments: true
categories: 
---
>iOS翻墙依赖于PAC文件，PAC文件里制定了一系列的规则用于智能判断某些流量是否需要走代理，这样就可以避免代理访问国内站点较慢的问题。

##如何获得PAC
1. SwitchSharp里导出
2. 从站点[AutoProxy2PAC](https://autoproxy2pac.appspot.com/)定制下载或者直接引用
3. 使用工具将gfwlist转换成PAC，如[JinnLynn/GenPAC]

##支持多重代理的PAC
上面3中方法获得代理文件都只支持配置一种代理方法。不使用于本人上篇博文[iOS6里GoAgent和SSH Forwarding共用](http://codelife.me/blog/2013/04/04/mixing-goagent-and-ssh-forwarding-on-iso-6/)里依赖的PAC文件。
形如：

	function FindProxyForURL(url, host) {
    	return "DIRECT; PROXY 192.168.1.1:3128; SOCKS5 lilinux.net:1080"; 
	}
##gfwlist2pac
在项目[JinnLynn/GenPAC]的基础上，本人编写了一个[gfwlist2pac]工具，支持如下功能：

* 代理规则基于[gfwlist](http://autoproxy-gfwlist.googlecode.com)
* 允许通过代理获得gfwlist
* 支持用户自定义规则
* 运行配置多重代理

<!--more-->

###修改配置
编辑`gfwlist2pac.cfg`文件

```
; 配置

[config]
; gfwlist地址
;gfwUrl = http://autoproxy-gfwlist.googlecode.com/svn/trunk/gfwlist.txt

; 访问gfwlist使用的代理
; 格式 PROXY|SOCKS|SOCKS5 [username:password@]hostname:port
; 'PROXY' 表示使用HTTP代理
; 'SOCKS' 表示使用SOCKS4代理
; 'SOCKS5' 表示使用SOCKS5代理
;gfwProxy = SOCKS5 127.0.0.1:7070

; 用于PAC规则的代理
; 格式 DIRECT|((PROXY|SOCKS|SOCKS5) hostname:port) [[; DIRECT|((PROXY|SOCKS|SOCKS5) hostname:port)] ...]
; 'DIRECT' 表示不使用代理
; 'PROXY' 表示使用HTTP代理
; 'SOCKS' 表示使用SOCKS4代理
; 'SOCKS5' 表示使用SOCKS5代理
; 多种连接方法使用';'隔开，系统会依次尝试，直到连通
; 注意：如果是在MAC下的SOCKS代理，必须设置成SOCKS5,在IOS下SOCKS4和SOCKS5代理都使用SOCKS
;pacProxy = DIRECT; SOCKS 127.0.0.1:7070; PROXY 127.0.0.1:8087

; 生成的PAC文件名 默认 autoproxy.pac
;pacFilename = autoproxy.pac

; 调试模式
debug = True
```

###自定义规则
编辑`gfwlist2pac.rules`文件

```
! 用户自定义的代理规则
! 
! 语法与gfwlist相同，即AdBlock Plus过滤规则
!
! 简单说明如下：
! 通配符支持，如 *.example.com/* 实际书写时可省略* 如.example.com/ 意即*.example.com/* 
! 正则表达式支持，以\开始和结束， 如 \[\w]+:\/\/example.com\
! 例外规则 @@，如 @@*.example.com/* 满足@@后规则的地址不使用代理
! 匹配地址开始和结尾 |，如 |http://example.com、example.com|分别表示以http://example.com开始和以example.com结束的地址
! || 标记，如 ||example.com 则http://example.com、https://example.com、ftp://example.com等地址均满足条件
! 注释 ! 如 ! Comment
!
! 更详细说明 请访问 http://adblockplus.org/en/filters
!
! 配置该文件时需谨慎，尽量避免与gfwlist产生冲突，
! 或将一些本不需要代理的网址添加到代理列表
! 可用test目录工具进行网址测试
! 

! Tip: 在最终生成的PAC文件中，用户定义规则先于gfwlist规则被处理
!      因此可以在这里添加一些常用网址规则，或能减少在访问这些网址进行查询的时间
!      如:
@@sina.com
@@163.com
twitter.com
youtube.com
```

###生成Pac文件
在命令行执行

```bash
python gfwlist2pac.py
```


[JinnLynn/GenPAC]:https://github.com/JinnLynn/GenPAC
[gfwlist2pac]:https://github.com/vangie/gfwlist2pac