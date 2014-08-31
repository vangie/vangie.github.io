---
layout: post
title: "Windows XP SP2远程桌面多用户访问"
date: 2007-01-12 23:41:26 +0800
comments: true
categories: 
---
> winxp sp2 的早期版本5.1.2600.2055 (xpsp_sp2_beta1.031215-1745)可以配置成远程界面多用户访问。本文介绍通过替换系统文件termsrv.dll的方式让正式版本的winxp sp2支持多用户远程登录。

下面的脚步是用来进行文件替换，注册表修改等相关配置的，
将分隔线中的代码拷贝到记事本中，重命名为clickme.cmd，
然后放到与termsrv.dll同一目录双击运行即可。
记得要重启电脑哦。

	rem 修改注册表值
	@echo off
	setlocal
	set regkey="HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Licensing Core"
	reg add %regkey% /v EnableConcurrentSessions /T REG_DWORD /D 1 /f
	endlocal
	rem 替换termsvr.dll文件
	mkdir .\temp
	copy .\termsrv.dll .\temp\termsrv.dll
	replace .\temp\termsrv.dll %windir%\system32\dllcache
	del /Q .\temp\termsrv.dll
	copy .\termsrv.dll .\temp\termsrv.dll
	TASKKILL /F /FI "MODULES eq termsrv.dll"
	shutdown -a
	replace .\temp\termsrv.dll %windir%\system32  
	del /Q .\temp\termsrv.dll
	rmdir /Q .\temp
	rem 启动相关系统服务
	call %windir%\system32\svchost.exe -k DComLaunch
	call %windir%\system32\svchost.exe -k netsvcs

相关文件下载

[termsrv.dll](http://windtear.net/images/termsrv.dll)

### 参考文章
1. [打开 XP Pro SP2 远程桌面的多用户支持 Enable Concurrent Sessions](http://windtear.net/archives/2006/04/13/000960.html)
