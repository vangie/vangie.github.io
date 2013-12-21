---
layout: post
title: "pcDuino上手记"
date: 2013-12-19 15:05
comments: true
categories: 
---
> 感谢刘博士送的这块pcDuino板。入Raspberry Pi前，优先考虑过pcDuino。在OSChina源创会上海站被刘博士打动过。买Raspberry Pi是为了DIY一个Mac的Time Capsule。随便Google了一下，找到了Raspberry实现Time Capsule的相关资料，而pcDuino的相关资料没有找到，于是作罢。

由于Raspberry Pi的先入为主，上手pcDuino碰到写问题，下面一一列出

<!-- more -->

###选什么TF卡
关于如何选购Raspberry Pi的SD卡，我好生下了功夫，最后还是有不好收获的。没有话冤枉钱买极速的。

**兼容列表**   
pcDuino支持哪些TF卡，网上找不到兼容列表。可能是都支持吧，不需要。

**读写速度**   
最大支持到少读写速度也找不到资料。

后来得知板载的2G闪存里内置了ubuntu系统，于是TF卡的问题就先悬着吧，等搞清楚再做决定。


###启动pcDuino
插上网线，pcDuino的网线口比Raspberry Pi的要小巧，但是有些过紧，拔出网线时候要小心，别弄断了。
插上电源线，指示灯亮了。

没有显示器，IP地址默认应该是DHCP的，先要找到IP地址。

**找到IP地址**

	arp-scan --localnet
	
如果发现主机名ubuntu，那就是了。要是没有就找Unknow的逐个ssh测试，能连接上的就是。

###初始化系统
ssh登录系统以后先执行系统初始化

	sudo board-config.sh
	
###安装Vim
一直不习惯原生的vi，对方向键支持不好。

	sudo apt-get install vim
	
安装不成功，返回如下

	Reading package lists... Done
	Building dependency tree
	Reading state information... Done
	
	....省去若干行
	
	Failed to fetch http://ports.ubuntu.com/ubuntu-ports/pool/main/p/python2.7/libpython2.7_2.7.3-0ubuntu3.2_armhf.deb  404  Not Found
	E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?
	
一大堆404，提示先`apt-get update`,好吧


	sudo apt-get update
	
返回如下
	
	....省去若干行
	
	Get:20 http://ports.ubuntu.com precise-updates/universe Translation-en [132 kB]
	Fetched 2681 kB in 21s (123 kB/s)
	Reading package lists... Done
	W: Conflicting distribution: http://www.wiimu.com pcduino Release (expected pcduino but got )
	
编辑器打开`/etc/apt/sources.list`,注释掉最后两行

	#deb http://www.wiimu.com:8020/pcduino/ pcuino main
	#deb-src http://www.wimu.com:8020/pcduion/ pcduino main
	
然后在`sudo apt-get update`就正常了。

###VNC远程桌面

####设置vnc密码

	sudo x11vnc -storepasswd
	sudo x11vnc -storepasswd in /etc/x11vnc.pass
	sudo cp .vnc/passwd /etc/x11vnc.pass
	
####启动桌面

	sudo start lightdm
	
####连接

在mac终端敲入

	open vnc://<ip_of_pcduino>
	
####已知问题

`sudo stop lightdm`再次`sudo start lightdm`启动后，客户端无法连接上VNC服务器。


###参考阅读
1. [pcDuino 刷系统-卡刷](http://www.cnblogs.com/iscode/p/3200503.html)
2. [pcDuino无显示器刷机与使用](http://www.cnblogs.com/iscode/p/3200558.html)






