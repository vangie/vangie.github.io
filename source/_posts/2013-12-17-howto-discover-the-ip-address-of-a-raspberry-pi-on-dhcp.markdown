---
layout: post
title: "如何找到树莓派通过DHCP获得的IP地址"
date: 2013-12-17 03:08
comments: true
categories: 
---
>小巧的树莓派配一个硕大的显示器，很不协调。本文介绍如何获得树莓派通过DHCP动态分配的IP地址。

###几种有趣的方法

mathworks论坛提到了几种有意思的方法

1. 通过Matlab命令行
	
		h = raspberrypi(‘raspberrypi-ah')
		h.openShell(‘ssh')
2. 安装一个启动过程中能读出IP的软件，该软件也是MathWork出品的
3. 通过DDNS（Dynamic DNS）
4. 启动时发邮件通知

就个人而言，上面的方法觉得都不够好。

1. 需要安装Matlab，一个好几G的工具软件就是为了找个IP用，有些蛋疼
2. 要插个耳机或者音响什么的
3. 需要互联网环境
4. 需要互联网环境

下面我介绍一个简单实用的方法，通过arp协议获得IP

<!-- more -->

###通过arp-scan获得树莓派IP

arp协议是一个数据链路层协议，负责IP地址和Mac地址的转换。下面我们介绍一个arp-scan工具扫出局域网所有的IP地址

####安装arp-scan

Mac OS

	brew install arp-scan
	
Ubuntu

	sudo apt-get arp-scan
	
####扫描以太网IP地址

	arp-scan --interface en0 --localnet  

此处en0是网卡的设备名称，可以通过ifconfig命令获得，有多种网卡时注意不要写错

扫描结果如下

	nterface: en0, datalink type: EN10MB (Ethernet)
	Starting arp-scan 1.8 with 256 hosts (http://www.nta-monitor.com/tools/arp-scan/)
	192.168.199.1   d4:ee:07:04:0d:e6	(Unknown)
	192.168.199.239 e8:8d:28:06:db:2f	(Unknown)
	192.168.199.107 b8:27:eb:96:c4:2f  (Unknown)

	513 packets received by filter, 0 packets dropped by kernel
	Ending arp-scan 1.8: 256 hosts scanned in 1.242 seconds (206.12 hosts/sec). 2 responded

由于arp-scan的版本比较低，所以主机名为Unknown,不过没有关系，由于树莓派的Mac地址都是`b8:27:3b`开头的。所以`192.168.199.107`就是树莓派的IP地址

####One line Command

	arp-scan --interface en0 --localnet | grep grep b8:27:eb
	
###参考阅读
1. [HOWTO discover the ip address of a Raspberry Pi](http://blog.remibergsma.com/2013/05/03/howto-discover-the-ip-address-of-a-raspberry-pi-on-dhcp/)
2. [Get IP Address of Raspberry Pi Hardware](http://www.mathworks.cn/cn/help/simulink/ug/get-the-ip-address-of-the-raspberry_pi-hardware.html)
3. [FYI: via Raspi's IP address with 'arp-scan'](http://www.raspberrypi.org/phpBB3/viewtopic.php?t=55804)	



