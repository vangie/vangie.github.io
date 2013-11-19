---
layout: post
title: "MacOS X配置I2P匿名网络"
date: 2012-10-07 11:37
comments: true
categories: 
---
> I2P 是一个匿名网络项目，它提供了一个简单的网络层供对身份敏感的程序进行安全的匿名通讯。I2P 网络是动态的分布式网络，它在设计上并不信任网络中的任何一方，其中的所有数据都经过多层加密。

简单的说I2P和Tor一样都可以作为梯子。相比Tor，I2P不需要中央服务器，属于分布式的匿名网络，更难被封杀。下面介绍如何在MacOS X下将I2P配置成本地的HTTP Proxy服务。

<!-- more -->

### 下载安装

打开I2P的[下载页面](http://www.i2p2.de/download_zh.html),找到“Linux / OS X / BSD / Solaris 图形安装程序”下载i2pinstall_0.9.2.jar

然后在命令行里执行（需要java环境）

```bash
java -jar i2pinstall_0.9.2.jar
```

图形向导很简单，没有什么特别需要注意的，可以选择**中文**界面语言。

### 运行配置

双击I2P安装目录（默认位置：/Applications/i2p）里Start I2P Router.app,I2P服务就启动了，浏览器打开`http://127.0.0.1:7657/`可以配置I2P服务。

##### 补种

若此时网络状态为：**测试中**，则需要补种，默认的种子列表都被墙了。补种的方式有如下两个，请根据个人喜好任选一个。

1. 手动下载种子

	请翻墙打开官网的[种子列表](http://netdb.i2p2.de/)，把页面上列出的大约20个种子下载下来。然后把下载的种子放到本机的 /Applications/i2p/netDb 目录下（这个目录是 I2P 用来存放种子的）。再把 I2P 重新启动一下。
2. 通过代理补种

	I2P 可以连接到它的官网去补种。但是 I2P 的官网被封。所以你需要在 I2P 的[补种界面](http://127.0.0.1:7657/configreseed)添加代理，让 I2P 先暂时利用其它翻墙软件补充种子。
	
不管哪种方法都是欲要翻墙先得翻墙

##### UPnP
若此时网络状态为：**防火墙限制**，这需要修改本地路由器配置开启UPnP。

重启后，若网络状态为：**正常** 或者 **隐身**,则表示服务已经正常启动。i2p会在4444端口，开启http代理服务；4445端口，开启https代理服务。

### 后台服务

双击`/Applications/i2p/install_i2p_service_osx.command`,i2p被注册成后台服务。

### 参考文献
1. [如何翻墙：简单扫盲 I2P 的使用](http://program-think.blogspot.com/2012/06/gfw-i2p.html)