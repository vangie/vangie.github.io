---
layout: post
title: "通过IP地址获得windows机制主机名"
date: 2012-11-06 11:46
comments: true
categories: 
---
> 局域网内可以通过NetBIOS协议将IP地址转换为windows机器的主机名


###Windows

	nbtstat -a [ip]
	
###Linux

	 nmblookup -A [ip]
###Mac OS

	smbutil status [ip]
