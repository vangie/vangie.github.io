---
layout: post
title: "qemu-kvm将SLIc 2.1刷入BIOS并成功激活Windows Server 2008 R2"
date: 2012-12-07 13:20
comments: true
categories: 
---
>在一台DELL R310的宿主机上安装了Ubuntu Server 12.10默认集成KVM虚拟机，用户态虚拟机软件qemu-kvm使用seabios的作为bios实现(位于 `/usr/share/qemu-kvm/bios.bin`,来自于qemu-common 1.2.0+noroms-0ubuntu2)，该bios.bin仅包含部分来自宿主机的SLIC信息，但不完整，无法通过Window OEM验证。

本文将介绍安装KVM虚拟机，借助virt-install安装Windows客户机，去除bios.bin里内置的SLIC，然后使用-acpitable参数载入正确的SLIc 2.1信息，导入OEM证书和OEM key激活Windows。

由于Ubuntu Server没有安装图形环境，DELL R310服务器也是不带显示器的，所有windows的安装过程是通过本来的Macbook Air的VNC客户端操作的。

<!-- more -->

### 安装KVM虚拟机

首先检查你的处理器是否支持硬件虚拟化；如果支持，下面这个命令

	$ sudo egrep '(vmx|svm)' --color=always /proc/cpuinfo

会看到如下类似信息
>flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc aperfmperf pni dtes64 monitor ds_cpl __vmx__ smx est tm2 ssse3 cx16 xtpr pdcm sse4_1 sse4_2 popcnt lahf_lm ida dtherm tpr_shadow vnmi flexpriority ept vpid

若什么都没有显示，那么你的处理器不支持硬件虚拟化，就此打住，不要往下折腾了。

检查bios虚拟化开关是否开启

	$ sudo kvm-ok
	
正确的返回如下
>INFO: /dev/kvm exists  
KVM acceleration can be used

安装KVM,(若在Ubuntu Server安装过程中已经安装了KVM忽略此步骤)

	$ sudo apt-get install ubuntu-virt-server  kvm-ipxe
	
之后，将当前用户添加到libvirtd群组

	$ sudo adduser `id -un` libvirtd
	$ sudo adduser `id -un` kvm
	
你需要要重新登录一下，才能让新群组生效。
  
验证kvm是否成功安装

	cloud03@cloud03:~$ virsh -c qemu:///system list
	 Id    Name                           State
	----------------------------------------------------
	
	cloud03@cloud03:~$ 
 
 

### 安装Windows Server 2008 R2
#### 准备

1. [Windows Server 2008 R2 安装镜像ISO](ed2k://|file|cn_windows_server_2008_r2_standard_enterprise_datacenter_and_web_with_sp1_vl_build_x64_dvd_617396.iso|3368962048|7C210CAC37A05F459758BCC1F4478F9E|/)
2. [Windows VirtIO Drivers](http://www.linux-kvm.org/page/WindowsGuestDrivers/Download_Drivers),若不加载该驱动windows installer会无法找到虚拟磁盘（没有验证过，网上是怎么说的） 点击下载：[virtio-win-0.1-30.iso](http://alt.fedoraproject.org/pub/alt/virtio-win/latest/images/bin/virtio-win-0.1-30.iso)
3. 安装virt-install `$ sudo apt-get install virtinst`

###开始安装

	$ virt-install --connect qemu:///system --arch=x86_64 -n win2k8 -r 4096 --vcpus=2 \
	-c /home/cloud03/cn_windows_server_2008_r2_standard_enterprise_datacenter_and_web_with_sp1_vl_build_x64_dvd_617396.iso \
	--noautoconsole --os-type windows --os-variant win2k8 \
	--disk path=/home/cloud03/virtio-win-0.1-30.iso,device=cdrom,perms=ro \
	--disk path=/var/lib/libvirt/images/win2k8.img,size=50 \
	--graphics vnc,password=foobar,listen=0.0.0.0 
	
部分参数说明

* -n win2k8 虚拟机的名称为win2k8
* -r 4096 分配4G内存
* -vcpus=2 两个cpu
* -c /home/cloud03/cn_windows…617396.iso 指向ISO安装镜像位置
* --disk path=/home/cloud03/virtio-win-0.1-30.iso,device=cdrom,perms=ro 加载virtio驱动
* --disk path=/var/lib/libvirt/images/win2k8.img,size=50 创建虚拟磁盘，并分配50G的空间
* --graphics vnc,password=foobar,listen=0.0.0.0 开启VNC，password选项是为了兼容mac内置Screen Sharing VNC终端无法连接不加密的VNC Server，listen选项是为了让VNC终端在所有IP地址上都开启监听，默认在127.0.0.1上监听，仅适用于本机VNC终端访问。

使用VNC客户端打开远程桌面，Mac下非常简单，在Terminal.app里输入`open vnc://192.168.18.130`回车即可。windows和linux桌面系统请自行安装vnc客户端。

另外不少网友推荐Mac下用[Chicken of the VNC.app](http://sourceforge.net/projects/cotvnc/)，试用过后不如内置Screen Sharing好，特别是系统重启断线重连的时候内置的客户端表现很稳定，Chicken of the VNC会假死，需要退出程序重开。

### 编译bios.bin

[seaslic](https://github.com/ghuntley/seaslic) 项目对seabios项目打了一个patch用于解决预安装正版windows的宿主机，改装linux运行kvm后，让虚拟机bios也有和宿主机一样的SLIc。简单的说就是把宿主机bios里的SLIc信息导入到虚拟机的bios.bin文件中去。让虚拟机也有正确的OEM标识。

经过测试seaslic项目导入的SLIc信息不完整，（至少在DELL R310下是不完整的），无法通过windows校验。

qemu-kvm有一个-acpitable选项，可以通过file=… 装载一个外部的SLIC文件（[SLIC 2.1 BINS 1-31-2011.7z](http://rghost.net/25221821)） 这里几乎有所有OEM机器的SLIC文件和证书）。

但是如果直接使用-acpitable选项加载外部SLIC进BIOS无论是使用内置的bios.bin(`/usr/share/qemu-kvm/bios.bin`),还是seaslic项目打过Patch的bios.bin都会导致ACPI table里有两条SLIc记录，一条正确的一条不完整的，导致windows无法激活。

一个可行的方案：在sealic项目的基础上，稍作修改编译一个完全不包含SLIc的bios.bin,然后在结合-acpitable选项载入外部SLIC文件。经实践，可以激活。

具体步骤如下：

下载sealic项目源码

	$ cd ~
	$ git clone git://github.com/ghuntley/seaslic
	
执行./patch.sh,该脚本会运用patch然后编译出bios.bin,调用该脚本只需要其运用patch的功能，编译出来的bios.bin先别管。

	$ cd seaslic
	$ ./patch.sh

编辑acpi.c文件

	$ vim  seabios.submodule/src/acpi.c

注释掉638-647行,

	/*#ifdef CONFIG_OEM_SLIC
    { void *buf = malloc_high(sizeof(SLIC));
      if (!buf)
        warn_noalloc();
      else {
        memcpy(buf, SLIC, sizeof(SLIC));
        ACPI_INIT_TABLE(buf);
      }
    }
	#endif*/
	
然后编译

	$ cd seabios.submodule
	$ make
	
替换系统内置bios.bin

	$ sudo cp out/bios.bin /usr/share/qemu-kvm/bios.bin
	
### 修改虚拟机配置

使用virsh edit命令可以修改虚拟机的配置。

	$ virsh edit win2k8
	
将第一行

	<domain type='kvm'>

改成
	 
	<domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>

然后，在靠近文件的末尾处，`</devices>`便签之后，加入如下内容

	<qemu:commandline>
		<qemu:arg value='-acpitable'/>
		<qemu:arg value='file=/usr/share/qemu/SLIC-DELL-PE_SC3-2.1.BIN'/>
	</qemu:commandline>

保存退出。其中，SLIC-DELL-PE_SC3-2.1.BIN文件可以从[SLIC 2.1 BINS 1-31-2011.7z](http://rghost.net/25221821)找到。

重启虚拟机，然后在虚拟机下载windows工具[SLIC Toolkit](http://forums.mydigitallife.info/threads/6925-SLIC-ToolKit-x86-x64-(Includes-PKey-amp-Cert-Backup).若“__SLIC诊断__”栏显示SLIC状态为__验证通过__则表明已生效。

### 在Windows里安装OEM证书和序列号

现在是完事具备只欠东风了，从[SLIC 2.1 BINS 1-31-2011.7z](http://rghost.net/25221821)压缩包中可以找到DEL的OEM证书。

在windows控制台中使用如下命令导入

	> slmgr -ilc DELL-DELL-2.0.XRM-MS
	
然后在这里[Server 2008/Server 2008 R2 OEM SLP Keys](http://forums.mydigitallife.info/threads/2827-Server-2008-Server-2008-R2-OEM-SLP-Keys)找到对应的Key。使用下面的命令导入

	> slmgr -ipk D7TCH-6P8JP-KRG4P-VJKYY-P9GFF
	
> Server 2008 R2 Standard DELL OEM KEY   
> D7TCH-6P8JP-KRG4P-VJKYY-P9GFF  
> Server 2008 R2 Enterprise DELL OEM KEY  
> BKCJJ-J6G9Y-4P7YF-8D4J7-7TCWD
	
重新打开[SLIC Toolkit](http://forums.mydigitallife.info/threads/6925-SLIC-ToolKit-x86-x64-(Includes-PKey-amp-Cert-Backup)工具，若“__序列号与证书验证及备份__”栏显示__证书正确__，那表示已经大功告成。


### 参考文献
1. [在Ubuntu 12.04 LTS服务器上借助KVM实现虚拟化](http://virtual.51cto.com/art/201206/341911.htm)
2. [Installing Win Server 2008 R2 as a KVM Guest with VirtIO](https://www.nnbfn.net/2011/01/installing-win-server-2008-r2-as-a-kvm-guest-with-virtio/)
3. [Crafting an SLIC BIOS for Linux KVM Guests](http://forums.mydigitallife.info/threads/33723-Crafting-an-SLIC-BIOS-for-Linux-KVM-Guests)

