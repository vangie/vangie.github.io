---
layout: post
title: "Google屏蔽Linode的IPv6导致SSH隧道不可用"
date: 2013-11-16 01:48
comments: true
categories: 
---
>最近几个月通过linode的SSH隧道访问Google都会报出类似“We‘re sorry”或者“unusual traffic”的错误，有时需要输入验证码，但大多数时候直接不可用。一段时间使用GoAgent比较多，可惜GoAgent有时不太稳定。

Google了一番，才知道是因为Google屏蔽了Linode服务器的IPv6协议导致SSH隧道出问题的。
下面我们就来关闭Ubuntu的IPv6

###关闭Ubuntu的IPv6
* 编辑 `/etc/sysctl.conf`,添加如下内容

	net.ipv6.conf.all.disable_ipv6=1  
	net.ipv6.conf.default.disable_ipv6=1  
	net.ipv6.conf.lo.disable_ipv6=1
	
如上修改虽然是永久性的需要重启网卡才能生效`/etc/init.d/networking restart`

* 实时生效

	echo '1' > /proc/sys/net/ipv6/conf/lo/disable_ipv6  
	echo '1' > /proc/sys/net/ipv6/conf/lo/disable_ipv6  
	echo '1' > /proc/sys/net/ipv6/conf/all/disable_ipv6  
	echo '1' > /proc/sys/net/ipv6/conf/default/disable_ipv6  

再试试通过SSH隧道搜索Google，是不是已经好了，^_^。


###参考阅读
1. [Intermittent "We're sorry" error accessing Google via IPv6](https://forum.linode.com/viewtopic.php?f=20&t=10436)
2. [Ubuntu - Disabling IPv6 support](http://en.kioskea.net/faq/759-ubuntu-disabling-ipv6-support)