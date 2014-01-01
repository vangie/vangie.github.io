---
layout: post
title: "Raspbian成功驱动TP-Link TL-WN725N V2版无线网卡"
date: 2013-12-14 00:03
comments: true
categories: 
---
>淘宝双12搞活动，225入了一台英国产2代B型512M RaspBerry Pi，英国产的相对便宜，但是不带外壳，另外加12块，搞了个带固定螺丝的亚克力外壳。话说这个外壳裁剪的相对不错，花了老半天才装好。 

![配件合集](/images/post/2013-12-14/4-items.jpg)

![组装成品](/images/post/2013-12-14/raspberry.jpg)

![TP-Link TL-WN725N V2](/images/post/2013-12-14/pi-with-tl-wn725n.jpg)

<!-- more -->

###如何选SD卡

先罗嗦一段SD卡的选取过程。其实想买开树莓的板子很长时间了，但是如何选SD卡一直犹豫不决。主要考虑两个因素：

* SD卡的兼容性，某些SD卡树莓派无法识别；
* SD卡的读写速度，市面上的Class 10卡从20M/s到UHS-I卡95M/s的价格相差很大。

一开始很想选 [闪迪（SanDisk）至尊超极速SDHC存储卡 8G-Class10-95MB/s](http://item.jd.com/530220.html) 查了[树莓的SD卡兼容列表](http://elinux.org/RPi_SD_cards)显示可以识别，但159元的价格让我犹豫了。

研究了一段时间，发现有网友称树莓派对UHS-I类型的SD支持不好，目前树莓的控制器读取SD卡速度也就20-30M/s。后来选了 [闪迪（SanDisk）至尊高速MicroSDHC（TF）存储卡 8G-Class10-30MB/s](http://item.jd.com/679771.html)， 39元搞定。


###安装rtl8188eu驱动模块

现在进入正题，安装这块无线网卡的驱动是个痛苦的精力，虽然树莓派的官方论坛已经有几篇关于驱动TL-WN725N的帖子：

* [Getting TL-WN725N working](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=66&t=55779&sid=946c22c3b95fea0e73539828e33018b1)
* [TL-WN725N V2, raspbian driver update](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=28&t=52932)
* [TP-Link TL-WN725N V2 works out of the box on Raspbian](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=91&t=29752)

但由于Raspbian的版本在不断的升级，生搬帖子上的步骤不起效果。

因为我的这个 [TP-LINK TL-WN725N 微型150M无线USB网卡](http://item.jd.com/618066.html) 是先于树莓派购买闲置的。如果买新的话，强烈建议买免驱的无线网卡，省得折腾。比如说这款 [EDUP EP-N8508GS黄金版 迷你USB无线网卡](http://item.jd.com/509932.html).这里有一份[树莓派支持的无线网卡清单](http://elinux.org/RPi_USB_Wi-Fi_Adapters)

下的步骤是综合了上面的帖子及其引用，不断试错总结出来的步骤。

####确定网卡的版本

TP-LINK TL-WN725N分[V1](http://wikidevi.com/wiki/TP-LINK_TL-WN725N_v1), [V2](http://wikidevi.com/wiki/TP-LINK_TL-WN725N_v2)版本。   
![](/images/post/2013-12-14/tl-wn725n.jpg)

将无线网卡插上树莓的USB接口，执行`lsusb`返回如下
>Bus 001 Device 004: ID 0bda:8179 Realtek Semiconductor Corp.

因为V1和V2的ID代号分别是0bda:8176、0bda:8179。

本文只针对V2版本，V1版本未经测试。

####升级内核

	sudo rpi-update
	
升级后执行`uname -a`的结果是
>Linux raspberrypi 3.10.24+ #610 PREEMPT Thu Dec 12 13:12:09 GMT 2013 armv6l GNU/Linux

####编辑驱动模块

	git clone --depth 1 git://github.com/raspberrypi/linux.git rpi-linux

	git clone --depth 1 git://github.com/raspberrypi/firmware.git rpi-firmware

	git clone git://github.com/lwfinger/rtl8188eu.git rtl8188eu
	
	cd rpi-linux

	make mrproper
	
	zcat /proc/config.gz > .config
	
	make modules_prepare
	
	cp ../rpi-firmware/extra/Module.symvers .
	
	cd ../rtl8188eu
	
	CONFIG_RTL8188EU=m make -C ../rpi-linux M=`pwd`
	
	sudo cp rtl8188eufw.bin /lib/firmware/rtlwifi
	
	sudo install -p -m 644 8188eu.ko /lib/modules/`uname -r`/kernel/drivers/net/wireless
	
	sudo insmod /lib/modules/`uname -r`/kernel/drivers/net/wireless/8188eu.ko
	
	sudo depmod -a
	
####验证网卡是否识别

若上面的命令执行过程没有报错，执行`iwconfig`的结果如下

	wlan0     IEEE 802.11bgn  ESSID:"22_1707"  Nickname:"<WIFI@REALTEK>"
	          Mode:Managed  Frequency:2.457 GHz  Access Point: D4:EE:07:04:0D:E6
	          Bit Rate:150 Mb/s   Sensitivity:0/0
	          Retry:off   RTS thr:off   Fragment thr:off
	          Power Management:off
 	         Link Quality=0/100  Signal level=15/100  Noise level=0/100
 	         Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0
 	         Tx excessive retries:0  Invalid misc:0   Missed beacon:0
	
	lo        no wireless extensions.
	
	eth0      no wireless extensions.

证明无线网卡已被识别，下面我们来配置网络参数。

####配置无线网络参数
	
打开/etc/wpa_supplicant/wpa_supplicant.conf文件，添加如下内容

	ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
	update_config=1

	network={
        ssid="NETWORK_NAME"
        psk="NETWORK_PASSWORD"
	}
	
上面的方法psk是明文，如果觉得敏感，可以使用下面的命令生成密文

	wpa_passphrase ssid pass_phrase
	
输出如下

	network={
	        ssid="myrouter"
	        #psk="thisisalongpassphrasenobodycanguess"
	        psk=fd50e5fb2b66493702338dd5175241d2e8dd7dd42fc292bbb7c56b01f9e9fdc0
	}
将输出结果添加到/etc/wpa_supplicant/wpa_supplicant.conf文件。
	
	
重启网络服务`sudo service networking reload`后

执行`ifconfig`，如果wlan0获得IP就可以使用了

	wlan0     Link encap:Ethernet  HWaddr 14:cf:92:b5:59:6d
	          inet addr:192.168.199.109  Bcast:192.168.199.255  Mask:255.255.255.0
	          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
	          RX packets:8805 errors:0 dropped:15 overruns:0 frame:0
	          TX packets:600 errors:0 dropped:0 overruns:0 carrier:0
	 	      collisions:0 txqueuelen:1000
	          RX bytes:2542242 (2.4 MiB)  TX bytes:82318 (80.3 KiB)

###参考阅读
1. [Compiling TP-LINK WN725N V2 driver in Raspbmc with 3.6.11 kernel](http://smhaziq.blogspot.co.at/2013/06/compiling-tp-link-wn725n-v2-driver-in.html)
2. [Linux driver for tplink-wn725n nano wireless adapter](https://github.com/liwei/rpi-rtl8188eu)
3. [Easy TP-Link TL-WN725 driver installation](http://blog.pi3g.com/2013/10/easy-tp-link-tl-wn725-driver-installation/)
4. [Fars Robotics Website](http://www.fars-robotics.net/)
5. [Wireless with wpasupplicant easier then you think](http://undiff.com/2008/08/wireless-with-wpa_supplicant-easier-then-you-think/)
