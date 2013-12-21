---
layout: post
title: "Kindle PaperWhite作为树莓派的命令终端"
date: 2013-12-17 03:14
comments: true
categories: 
---
>网上有大牛把Kindle作为树莓派的显示屏，外带一个Mac蓝牙键盘，实用移动电源供给。一个台低功耗的可移动主机，酷极了。手上真好有一台Kindle PaperWhite，于是开始折腾。

![KindleBerry](/images/post/2013-12-17/kindle-berry.png)

###准备工作

1. Raspberry Pi 一台
2. Kindle PaperWhite 一台（已[越狱](http://www.mobileread.com/forums/showthread.php?t=198446)）		
3. USB转microUSB数据线2根，一根给Raspberry Pi供电，一根作为Kindle和Raspberry Pi的连接线

<!-- more -->

###安装USBNetwork

[USBNetwork](http://www.mobileread.com/forums/showthread.php?t=186645)工具可以通过usb数据线连接kindle和另一台电脑，实现ssh登录。

安装步骤如下

1. 下载[Kindle-usbnet-0.1.5N.zip](http://www.mobileread.com/forums/attachment.php?attachmentid=116323&d=1386361702)，解压以后仔细阅读`README_FIRST.txt`文件
2. 将update_usbnet_0.15.N_install_touch_pw.bin拷贝到Kindle根目录
3. Kindle里工具栏菜单[设置]-> 工具栏菜单[更新您的Kindle]，安装完成后会重启   

	![安装Kindle应用](/images/post/2013-12-17/kindle_install_sw.png)
4. 安装完成以后Kindle更目录会多出一个`usbnet`目录和`extensions\usbnet`目录
5. 编辑`usbnet\etc\config`文件，修改如下
		
		USE_WIFI="true"
		USE_OPENSSH="true"
		
**开关USBNetwork模式**

>在Kindle的搜索框内，输入`;usbnetwork`或者`;un`。再输入一个可以切换。

**查看网络状态**

>在Kindle的搜索框内，输入`;711`。可以查到当前无线网卡的IP地址

####Mac通过USB线登录Kindle

1. 用USB线连接Mac和Kindle
2. 默认Kindle会被挂载成存储设备，先弹出该设备
3. 然后开启Kindle的USBNetwork模式
4. Mac[系统偏好设置]->[网络] 新建一个RNDIS/Ethernet Gadget链接配置如下

		ip:		192.168.15.201
		mask:	255.255.255.0
		router:	192.168.15.244
	* 如果无法创建RNDIS连接，可能需要安装[HoRNDIS](http://joshuawise.com/horndis)   
	* router的地址要Kindle的`/usbnet/etc/config`文件里`KINDLE_IP`项一致
5. 终端SSH连接

		ssh root@192.168.15.244

####通过WiFi登录Kindle
1. 在Kindle的搜索框内，输入`;711`查找Kindle无线网卡IP
2. 通过终端SSH连接即可

到此Kindle的Network算配置完毕，下来我们来配置Kindle的Kterm

###安装KUAL和Kterm

####KUAL
[KUAL](http://www.mobileread.com/forums/showthread.php?t=203326)是Kindle Unified Application Launcher的缩写，其作用是为越狱的Kindle启动第三方应用。简单的说通过一本特殊的书籍来统一实现启动触发器。

1. 下载[prerequisites-all-supported-devices](prerequisites-all-supported-devices.zip)
2. 解压后将update_kindlet-dev-20130710-k5-ALL_install.bin文件拷贝到Kindle根目录，Kindle安装.bin文件的方法都是一样的，Kindle里点击[更新您的Kindle],然后会显示安装进度，自动重启后完成。
3. 下载[KUAL.V.2.2.zip](http://www.mobileread.com/forums/attachment.php?attachmentid=109526&d=1376691043)
4. 解压后将KindleLauncher-2.0.azw2文件拷贝到Kindle的`/documents`目录
5. 断开连接后Kindle里多了一本《Kindle Launcher》的书，点开有一排可以启动的应用列表。   
	![Kindle Launcher](/images/post/2013-12-17/kindle_launcher.png)![Kindle Launcher打开以后的效果](/images/post/2013-12-17/kindle_launcher_opened.png)


####Extend
`Extend`是一组扩展的预编译好的linux命令行工具，让Kindle可以运行一些常用的linux命令，如：openssh，nano，screen，irssi，php，bash，rsync等。

1. 下载[optware_img_60m.zip](http://ge.tt/9Qoa9YD/v/0?c)和[kindle_extend-1.1.zip](http://ge.tt/9Qoa9YD/v/2?c)
2. 解压kindle_extend-1.1.zip到kindle_extend-1.1目录
3. 解压optware_img_60m.zip将`optware.img`文件替换`kindle_extend-1.1/extend/optware.img`文件
4. 将`kindle_extend-1.1`目录下的`extend`和`extensions`子目录拷贝到Kindle更目录
5. 然后通过SSH登录Kindle执行如下命令

		mntroot rw
		mkdir /mnt/us/circles
		cp /mnt/us/extend/mountd /mnt/us/circles
		ln -s /mnt/us/circles/mountd /etc/rc5.d/S101mountd
		mntroot ro
		./mnt/us/install.sh
		./mnt/us/mount.sh

####Kterm
[Kterm](http://www.fabiszewski.net/kindle-terminal/)是一个内置虚拟键盘的GTK+的Kindle终端模拟器

![Kterm效果图](/images/post/2013-12-17/kterm.gif)

1. 下载[Kerm 0.7](http://www.fabiszewski.net/kindle-terminal/kterm-0.7.zip)
2. 解压后将[此文件](https://dl.dropbox.com/s/tagzqiz06fbdltz/kterm-landscape-enabled.zip?token_hash=AAH5k68xlwcYqi065-n5Bu5XaoiEXB12zCDjj50udrRg_w&dl=1)替换`kterm/bin/kterm`文件。具体看[这里](https://github.com/bfabiszewski/kterm/issues/2#issuecomment-14204814)
3. 然后将`kterm`文件夹拷贝到Kindle的`extensions`目录下
4. 断开Kindle与电脑的链接，通过KUAL打开Kterm，随便Ping台机器试试。

###配置Raspberry Pi的USB网络连接

安装了USBNetwork，Kindle已经可以通过数据线和Mac电脑连网，接下来配置Raspberry Pi的USB网络链接，使Kindle插入Raspberry Pi以后可以自动建立网络连接。

	sudo vim /etc/network/interfaces
	
添加如下内容

	#USB tethering
	allow-hotplug usb0
	iface usb0 inet static
    	address 192.168.15.1
    	netmask 255.255.255.0
    	broadcast 192.168.15.255
    	up iptables -I INPUT 1 -s 192.168.15.1 -j ACCEPT
    	up eject /dev/sda1
    	

* `allow-hotplug usb0`表示插入USB后自动加载网络配置
* `up eject /dev/sda1`表示弹出Kindle自动挂载的磁盘分区

重启网络

	sudo service networking reload
	
###见证奇迹的时刻

1. 使用数据线连接Kindle和Raspberry Pi
2. 开启USBNetwork模式，Kindle的搜索框内，输入`;un`然后回车
3. 打开Kterm键入

	ssh pi@192.168.15.1
	
若提示输入密码或者保存密钥指纹，说明大功告成。

**Kindle作为跳板机**

Kindle和Raspberry Pi顺利创建连接之后，Mac OS可以通过Kindle的Wifi连接SSH登录进Kindle，然后再次SSH登录进入Raspberry Pi。

###参考阅读
1. [KindleBerry Pi](http://www.ponnuki.net/2012/09/kindleberry-pi/)
2. [Kindleberry "Paperwhite" Pi](https://gist.github.com/rvagg/5095506)
3. [Kindle Touch Hacking](http://wiki.mobileread.com/wiki/Kindle_Touch_Hacking#GUI_launcher)
4. [Kindleberry Wireless: A Portable Outdoor Hackstation](http://maxogden.com/kindleberry-wireless.html)