---
layout: post
title: "Tweetbot for Mac使用GoAgent代理"
date: 2012-09-04 22:45
comments: true
categories: 
---
>[Tweetbot for Mac]是MacOS X上推的不二选择，但是该软件的所有版本都没有提供Proxy设置。网上少有几篇关于[Tweetbot]如何使用[GoAgent]代理上网的教程是针对iOS平台的。

玩Ubuntu的时候有个工具软件可以作为启动器启动另一个软件，然后让被启动的软件使用该工具软件设定好的代理上网。这个工具可以解决需要使用代理上网但软件自身未提供代理配置功能的问题。

<!-- more -->

为什么不使用全局代理呢？

1. 浪费[GoAgent]有限的浏览，下个迅雷就玩完了。
2. 国内的站点到绕道国外一圈在回来，不是折腾么。

可惜在Mac没能找到那么一款神奇的工具，庆幸的是找到了[ProxyCap]和[Proxifier]两款软件，这两款软件的功能类似，都是通过配置规则来指定某些应用程序使用指定的代理访问网络。不管哪种方式，到达的效果是一样的,当两款都是收费软件，提供了30天的使用。经过测试[ProxyCap]无法在Mountian Lion下工作，而且提供的是pkg的安装包，安装完需要重启。[Proxifier]可用，下面介绍如何配置。官网提供了30天使用的安装版本下载，dmg的安装过程就直接跳过了。

### 配置Proxy
打开`Proxies->Add`,针对本机[GoAgent]的配置添加一个代理

* 类型: `HTTPS`
* 地址: `127.0.0.1`
* 端口: `8087`

![Proxy Setting](/images/post/2012-09-04/Proxies.jpg)

### 配置规则
打开`Rules->Add`,添加一个规则，指定[Tweetbot]使用改成配置的代理上网

* 名称: Tweetbot
* 应用程序：选择Tweetbot（默认是Any，右下角有一个`+`可以选择应用程序的位置）
* 目标主机(Target Hosts): `Any`
* 目标端口(Target Port): `Any`
* 行为(Action): `Proxy HTTPS 127.0.0.1:8087`

![Rule Setting](/images/post/2012-09-04/Rules.jpg)


### 修改DNS设置
打开 `DNS`,勾上`Resolve hostnames through proxy`。
这一步很重要，漏掉了会因为DNS污染导致连接不上。

![DNS Setting](/images/post/2012-09-04/DNS.jpg)

接下打开[Tweetbot]就可以尽情的Tweet了。在[Proxifier]的`Connections`Tab页能看到链接信息。

![Connections information](/images/post/2012-09-04/Connections.jpg)

[Tweetbot for Mac]: http://tapbots.com/blog/news/tweetbot-for-mac-beta-sort-of "Tweetbot for Mac"
[Tweetbot]:http://tapbots.com/software/tweetbot/ "Tweetbot for iOS"
[GoAgent]:http://code.google.com/p/goagent/ "a gae proxy forked from gappproxy/wallproxy" 
[ProxyCap]: http://www.proxycap.com/ "Proxifier and SSH Tunneler for Windows/Mac OS X"
[Proxifier]: http://www.proxifier.com/ "Bypass firewall and proxy, tunnel connections through an HTTPS and SOCKS proxy"

