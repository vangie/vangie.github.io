---
layout: post
title: "为CentOS虚拟机添加第二块网卡"
date: 2012-12-11 18:43
comments: true
categories: 
---
>使用virt-install安装了一个CentOS虚拟机，安装过程未指定网络参数，默认使用内置虚拟NAT的方式上网，现在希望给虚拟机另外安装一块虚拟的网卡，然后给其分配一个外网IP地址（与宿主机处于同一网段）。

###安装CentOS

	$ sudo virt-install --connect qemu:///system --noautoconsole \
	-n centos -r 4096 --vcpus=4 --arch=x86_64 --os-type=linux \
	--os-variant=rhel6 --accelerate -v -l http://mirrors.163.com/centos/6.3/os/x86_64/ \
	--disk path=/var/lib/libvirt/images/centos.img,size=200 \
	--graphics vnc,password=foobar,listen=0.0.0.0,port=5901 
	
<!-- more -->
	
###为宿主机添加虚拟网桥

	$ vim /etc/network/interfaces
	
修改如下

	# This file describes the network interfaces available on your system
	# and how to activate them. For more information, see interfaces(5).
	
	# The loopback network interface
	auto lo
	iface lo inet loopback
	
	# The primary network interface
	iface em1 inet manual
	
	auto br0
	iface br0 inet static
		bridge_ports 	em1
		bridge_stp 	on
		bridge_maxwait	0
		bridge_fd 	0
		address 	192.168.18.130
		netmask 	255.255.255.0
		network 	192.168.18.0
		broadcast 	192.168.18.255
		gateway		192.168.18.1
		dns-nameservers	192.168.18.1

添加虚拟网桥配置br0,并且把主网卡em1（大多数情况下主网卡为eth0）配置由dhcp或者static改成manual。

然后重启网络服务

	$ sudo service networking restart
	
###为虚拟机添加一张额外的虚拟网卡

首先关闭VM

	$ virsh destory centos

然后编辑VM配置文件

	$ virsh edit centos
	
在</interface>之后加入如下xml片段

	<interface type='bridge'>
      <mac address='00:16:3e:1a:b3:4a'/>
      <source bridge='br0'/>
      <model type='virtio'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x0'/>
    </interface>

然后保存退出。

启动刚才修改过的VM虚拟节点

	$ virsh start centos
	
###为CentOS添加新网卡配置

参看`/sys/class/net`可以看到新添加的网卡eth1

	# ls /sys/class/net/
	eth0  eth1  lo
	
通过ifconfig获得该网卡的MAC地址

	# ifconfig eth1
	eth1	Link encap:Ethernet  HWaddr 00:16:3E:1A:B3:4A  
          	inet addr:192.168.18.210  Bcast:192.168.18.255  Mask:255.255.255.0
          	inet6 addr: fe80::216:3eff:fe1a:b34a/64 Scope:Link
          	UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          	RX packets:3343 errors:0 dropped:0 overruns:0 frame:0
          	TX packets:12 errors:0 dropped:0 overruns:0 carrier:0
          	collisions:0 txqueuelen:1000 
          	RX bytes:216373 (211.3 KiB)  TX bytes:1364 (1.3 KiB)

执行uuidgen生成一个随机的UUID

	# uuidgen
	e5281311-f265-4afa-a7e1-4d76718f7de0

然后完事具备只欠东方了，

	# cd /etc/sysconfig/network-scripts
	# cp ifcfg-eth0 ifcfg-eth1
	# vim ifcfg-eth1
	
结合上面的MAC地址和UUID，修改内容如下

	DEVICE="eth1"
	BOOTPROTO="dhcp"
	HWADDR="00:16:3E:1A:B3:4A"
	IPV6INIT="yes"
	IPV6_AUTOCONF="yes"
	NM_CONTROLLED="yes"
	ONBOOT="yes"
	TYPE="Ethernet"
	UUID="e5281311-f265-4afa-a7e1-4d76718f7de0"
	
	
然后VM网络服务即可

	# service network restart
	

###参考文献
1. [Interface Configuration Files](http://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-networkscripts-interfaces.html)
2. [Network management architecture](http://libvirt.org/archnetwork.html)
3. [Network XML format](http://libvirt.org/formatnetwork.html)
4. [libvirt networking](http://wiki.libvirt.org/page/Networking)
5. [Bridging Network Connections](http://wiki.debian.org/BridgeNetworkConnections)
6. [KVM setting guest network](http://www.linux-kvm.org/page/Networking)
7. [Adding Virtual Network Interfaces on CentOS 5.x](http://www.selbytech.com/2009/10/adding-virtual-network-interfaces-on-centos-5-x/)