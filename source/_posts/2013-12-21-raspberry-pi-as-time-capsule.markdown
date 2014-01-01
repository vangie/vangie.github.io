---
layout: post
title: "将树莓派配置成时间胶囊"
date: 2013-12-21 21:00
comments: true
categories: 
---
>MacBookAir的SSD坏了两次以后，发现TimeMachine真的很有必要。外插个尿袋子真的不方便。AirPort Time Capsule 2T版本价格买到了$299，觉得有些不值。$25的树莓派+一块移动硬盘DIY一个Time Capsule即经济又有趣。

![Raspberry Pi as TimeCapsule](/images/post/2013-12-21/raspberry-pi-as-time-capsule.png)

<!-- more -->

###组件清单
![Component of TimeCapsule](/images/post/2013-12-21/component-of-time-capsule.png)

- 树莓派
	- TF卡 + 卡套
	- USB WiFi 网卡
	- 5V电源 + MicroUSB 电源线
- 移动硬盘
	- 2.5寸 500G SATA 硬盘 
	- USB3.0 硬盘电路板 
	- USB3.0 数据线


###安装HFS+文件系统工具

	sudo apt-get install hfsplus hfsutils hfsprogs
	
###准备HFS+设备	
列出所有块设备

	sudo blkid
	
返回如下

	/dev/mmcblk0p1: LABEL="RECOVERY" UUID="F69B-A989" TYPE="vfat"
	/dev/mmcblk0p3: LABEL="SETTINGS" UUID="7f8a9faf-84a1-4062-ab9c-b2e6115035ce" TYPE="ext4"
	/dev/mmcblk0p5: LABEL="BOOT" UUID="03D6-2985" TYPE="vfat"
	/dev/mmcblk0p6: LABEL="root" UUID="e2a46600-20ca-42f4-8ec8-aa52d258aad2" TYPE="ext4"
	/dev/sda1: UUID="943f46c5-2de2-3ef9-8494-46c3cf8bd915" LABEL="Time Capsule" TYPE="hfsplus"
	
包含TYPE=“hfsplus”的即是。

如果希望把一个新的分区格式化为HFS+，使用如下命令

	sudo mkfs.hfsplus -v "Time Capsule" /dev/sda1
	
**建议使用全新的hfs+分区**
把一块已经做过TimeMachine的hfs+分区，可能导致原有的备份数据丢失

###挂载

	sudo mkidr /media/TimeCapsule
	sudo mount -t hfsplus -o force /dev/sda1 /media/TimeCapsule
	sudo chown -R pi:pi /media/TimeCapsule
	
###安装配置netatalk服务

	sudo apt-get install netatalk
	sudo echo "/media/TimeCapsule \"Time Capsule\" options:tm" >> /etc/netatalk/AppleVolumes.default
	sudo service netatalk restart
	
接下来就可以从Mac的Time Machine里找到这块磁盘   
![选择Time Machine磁盘](/images/post/2013-12-21/avaliable-disk.png)
	
###配置Avahi
安装`avahi-daemon`和`libnss-mdns`

	sudo apt-get install avahi-daemon libnss-mdns
	
配置nsswitch.conf

在`hosts:`后添加“mdns”

	hosts:      files mdns4_minimal [NOTFOUND=return] dns mdns4 mdns
	
接下来让Avahi在局域网广播AFP共享

添加如下文件`/etc/avahi/services/afpd.service`内容如下：

	<?xml version="1.0" standalone='no'?><!--*-nxml-*-->
	<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
	<service-group>
    	<name replace-wildcards="yes">%h</name>
    	<service>
	        <type>_afpovertcp._tcp</type>
	        <port>548</port>
	    </service>
	    <service>
	        <type>_device-info._tcp</type>
 	       <port>0</port>
	        <txt-record>model=Xserve</txt-record>
	    </service>
	</service-group>

重启服务

	sudo /etc/init.d/avahi-daemon restart
	
在findler的左侧可以看到共享的文件系统

![共享](/images/post/2013-12-21/share.png)

###参考阅读
1. [Raspberry Pi als TimeCapsule](http://www.zisoft.de/elektronik/raspberrypi/timecapsule.html)
2. [Use rPi as a Time Capsule - another method](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=36&t=47029)
3. [Time Capsule for $25](http://garmoncheg.blogspot.jp/2012/11/time-capsule-for-25.html)
4. [Raspberry Pi, Raspbian, HFS+, AFP and Time Machine](http://andadapt.com/raspberry-pi-raspbian-hfs-afp-and-time-machine/)
5. [HowTo: Make Ubuntu a Perfect Mac File Server and Time Machine Volume](http://kremalicious.com/ubuntu-as-mac-file-server-and-time-machine-volume/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+kremalicious+(kremalicious))