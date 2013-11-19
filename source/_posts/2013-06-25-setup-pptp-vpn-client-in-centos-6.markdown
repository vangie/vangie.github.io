---
layout: post
title: "CentOS 6下配置PPTP VPN客户端"
date: 2013-06-25 21:34
comments: true
categories: 
---
> 国内网络环境下载rubygems那叫一个痛苦，最近把https改成http也不好用了。百般无耐，考虑在服务器环境下装个PPTP Client连接国外的PPTPD服务。

### 安装pptp和pptp-setup
pptp就不用解释了，pptp-setup是一个设置脚本，通过该脚本可以使用方便地进行初始化设置，生成配置文件。

	# yum install pptp pptp-setup
	
### 创建配置

	# pptpsetup --create codelife --server vpn.codelife.me \
	--username codelife --password me --encrypt
	
<!-- more -->
	
若报如下错误

	FATAL: Module ppp_mppe not found.
	/usr/sbin/pptpsetup: couldn't find MPPE support in kernel.
	
则需要执行

	# modprobe ppp_mppe
	
向内核注册ppp_mppe模块

### 连接VPN

	# pppd call codelife
	
#### 验证连接情况
	
然后通过如下命令验证连接情况

	# ip a |grep ppp

#### 排错

如果上面命令没有任何返回，则说明连接失败了，可以参看**/var/log/message**文件了解错误的原因

	# tail -f /var/log/message | grep ppp
	
##### 服务端不支持MPPE	
	
若错误为

	MPPE required but peer negotiation failed

说明服务端不支持MPPE加密，pptpsetup时不需要使用--encrypt选项。可以手工修改**/etc/ppp/peers/codelife**文件

	# vim /etc/ppp/peers/codelife
	
去除或者注释掉require-mppe-128

##### 客户端不支持MPPE

若错误为

	LCP terminated by peer (MPPE required but peer refused)
	
说明服务端要求MPPE加密，但是客户端不支持，pptpsetup时漏掉了--encrypt选项。解决方法正好相反，往**/etc/ppp/peers/codelife**文件添加一行require-mppe-128

###配置路由表

连接成功后，通过route命令可参看路由表信息

	# route -n
	Kernel IP routing table
	Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
	192.168.0.1     0.0.0.0         255.255.255.255 UH    0      0        0 ppp0
	192.168.228.0   0.0.0.0         255.255.255.0   U     0      0        0 eth0
	0.0.0.0         192.168.228.153 0.0.0.0         UG    0      0        0 eth0

可见，只添加了一条访问192.168.0.1 IP的路由信息。

####访问特定网段
假设你想让登陆VPN服务器的客户端互相访问，那么，你需要在客户端上加入192.168.0.0网段，即：
	
	# route add -net 192.168.0.0 netmask 255.255.255.0 dev ppp0
	# route -n
	Kernel IP routing table
	Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
	192.168.0.1     *               255.255.255.255 UH    0      0        0 ppp0
	192.168.228.0   *               255.255.255.0   U     0      0        0 eth0
	192.168.0.0     *               255.255.255.0   U     0      0        0 ppp0
	default         192.168.228.153 0.0.0.0         UG    0      0        0 eth0

然后使用ping命令测试

	# ping 192.168.0.201 -c 3
	PING 192.168.0.201 (192.168.0.201) 56(84) bytes of data.
	64 bytes from 192.168.0.201: icmp_seq=1 ttl=127 time=90.1 ms
	64 bytes from 192.168.0.201: icmp_seq=2 ttl=127 time=57.2 ms
	64 bytes from 192.168.0.201: icmp_seq=3 ttl=127 time=61.9 ms
	
	--- 192.168.0.201 ping statistics ---
	3 packets transmitted, 3 received, 0% packet loss, time 1999ms
	rtt min/avg/max/mdev = 57.299/69.794/90.144/14.515 ms

这里，192.168.0.201是另一台客户端，同样，若希望访问网段也需要加入类似的路由信息。

####全部流量都通过VPN

如果您想连接VPN后，全部流量都通过VPN出去（翻墙），就像Windows 那样。那么按上面的步骤可能会遇到一些问题。因为，Linux的默认网关只能是一个，所以，这需要分两种情况。
#####a）没有默认网关
这时，你只需设置一个默认路由即可，例如：

	# route add -net 0.0.0.0 dev ppp0

#####b）已有默认网关
但更多情况下，默认网关都是存在的。例如，在这里的局域网内部已经设置了默认网关为192.168.228.153，例如：

	# tracert www.163.com
	traceroute to www.163.com (183.60.136.70), 30 hops max, 40 byte packets
	1  192.168.228.153 (192.168.228.153)  0.634 ms  0.879 ms  0.879 ms
	2  1.64.63.58.broad.gz.gd.dynamic.163data.com.cn (58.63.64.1)  16.410 ms  16.660 ms  17.150 ms

若像上面那样添加一条路由是不行的，需要先让访问VPN服务端的流量可通过，然后才能转发其他的数据包。

	# ip route replace 124.248.205.115 via 192.168.228.153 dev eth0 src 192.168.228.135
	# ip route replace default dev ppp0

更新后的路由表：

	# route -n
	Kernel IP routing table
	Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
	192.168.0.1     0.0.0.0         255.255.255.255 UH    0      0        0 ppp0
	124.248.205.115 192.168.228.153 255.255.255.255 UGH   0      0        0 eth0
	192.168.228.0   0.0.0.0         255.255.255.0   U     0      0        0 eth0
	0.0.0.0         0.0.0.0         0.0.0.0         U     0      0        0 ppp0

访问路径：

	# tracert www.163.com
	traceroute to www.163.com (183.60.136.70), 30 hops max, 40 byte packets
	1  192.168.0.1 (192.168.0.1)  33.461 ms  33.665 ms  33.872 ms
	2  switch1.hongkong.exchange.gigelayer.com (124.248.205.188)  35.284 ms  35.558 ms  35.799 ms
	3  in.core-rt-003.gi.gi0.3.sunnyvision.com (123.242.225.1)  36.502 ms  36.747 ms  40.479 ms

当然，关闭连接时，也是需要恢复默认网关的：

	# ip route del 124.248.205.115 via 192.168.228.153 dev eth0 src 192.168.228.135
	# ip route add default via 192.168.228.153
	
###关闭连接

**注意：启动连接很简单，但停止不能使用ifconfig pp0 down，否则只是禁用了ppp0网卡，后台连接还是存在的。**当然，可以杀进程(`killall pppd`)来断开连接。不过，ppp工具包提供了更好用的脚本。但需要您进行一些额外的工作：

	# cp /usr/share/doc/ppp-2.4.5/scripts/pon /usr/sbin/
	# cp /usr/share/doc/ppp-2.4.5/scripts/poff /usr/sbin/
	# chmod +x /usr/sbin/pon
	# chmod +x /usr/sbin/poff

然后使用下面的命令启动和关闭连接即可：

	# pon vpn
	# poff vpn

###参考资料
[1]. [CentOS 6: Install VPN PPTP Client – The Simple Way](http://blog.secaserver.com/2012/12/centos-6-install-vpn-pptp-client-simple/)   
[2]. [CentOS 5.3 配置pptp客户端(非图形界面)](http://bbs.chinaunix.net/thread-1597299-1-3.html)   
[3]. [Linux 下部署PPTP VPN -- 客户端](http://www.linuxfly.org/post/641/)   
[4]. [PPTP Client Diagnosis](http://www.linuxfly.org/post/641/)