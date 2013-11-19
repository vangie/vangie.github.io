---
layout: post
title: "如何清除DNS缓存"
date: 2012-11-20 16:23
comments: true
categories: 
---
>系统管理员或者web开发者，偶尔需要刷新一下DNS，由于DNS存在本地缓存，如果不主动清除，那需要一段漫长的等待

### Mac OS

OS X Lion (10.7) and OS X Mountain Lion (10.8)
	
	$ sudo killall -HUP mDNSResponder


Mac OS X 10.5, Mac OS X 10.6

	$ dscacheutil -flushcache

Mac OS X 10.4 Tiger

	$ lookupd -flushcache

### Windows 
Vista/Win7 以上系统  

查看DNS缓存

	> ipconfig /displaydns

清除DNS缓存

	> ipconfig /flushdns 
	
Winxp和之前的老系统

	> net stop dnscache
	> net start dnscache
	
### Linux

	$ sudo /etc/init.d/nscd restart
	
####参考文献
1. [How to Flush DNS Cache in Mac OS X](http://osxdaily.com/2008/03/21/how-to-flush-your-dns-cache-in-mac-os-x/)
2. [Vista/Win7以上系统查看和清除本地DNS缓存新方法](http://www.cnblogs.com/yryz/archive/2012/02/13/2299756.html)
3. [How to flush DNS cache in Linux / Windows / Mac](http://www.techiecorner.com/35/how-to-flush-dns-cache-in-linux-windows-mac/)