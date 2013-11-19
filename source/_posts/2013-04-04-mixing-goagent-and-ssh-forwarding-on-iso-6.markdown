---
layout: post
title: "iOS6里GoAgent和SSH Forwarding共用"
date: 2013-04-04 22:15
comments: true
categories: 
---
>入了一台iPhone5联通合约机，可惜iOS 6.1.3无法越狱了，庆幸内置系统版本6.1.2，Alfred调出evasi0n.app,果断越狱了。本文介绍在iOS6里整合Goagent和SSH forwarding两种方式翻越长城。

<!-- more -->

##在安装GoAgent for iOS
根据[GoAgent官方iOS客户端安装教程]
###前提条件

* 越狱
* 已经部署GoAgent服务端
* 将Cydia切换为`开发者`模式：Cydia->管理->设置->开发者

###步骤

1. Cydia里添加源 http://repo.goagent.org/cydia
2. 在Cydia里安装goagent-ios和goagent-widget,iFile
3. 设置Proxy.ini里的appid
	* 打开GoAgent for iOS.app，点击Edit File,如果有弹出菜单，先取消，找到`proxy.ini`文件，点击右边的箭头，在弹出的新页面里找到`打开方式…`，选`文本编辑器`,点击左边的`编辑`，然后将appid= goagent改成你server的appid
4. 安装CA.crt
	* 在浏览器里打开 https://goagent.googlecode.com/files/CA.crt 然后安装
5. 开启通知中心GoAgent控件
	* 设置 -> 通知 -> goagent-widget
6. 设置PAC
	* 设置 -> Wi-Fi -> CurrentWiFi -> HTTP Proxy -> Auto -> http://127.0.0.1:8086/8086.pac
	* 或者在GoAgent for iOS设置页里点击“Change System Proxy”
7. 打开Facebook测试一下

##配置SSH Forwarding
这部有许多shell操作，Cydia里mobile terminal提供了一个可用的Shell。但是使用起来很不方便，通过SSH远程登录到iPhone借助电脑的全键盘更加便利。
###SSH登录到iPhone
1. Cydia里安装OpenSSH
2. 设置 -> Wi-Fi -> CurrentWiFi 参看IP地址(假设：192.168.2.107)
3. Mac OS里打开Bash输入`ssh root@192.168.2.107`，密码：alpine

###免密码SSH登录远程服务器
详细步骤和说明参看[MacOS X终端里SSH会话管理](http://codelife.me/blog/2012/09/01/ssh-session-profile-management-in-terminal-of-macos-x/)

1. 切换到mobie账户
	* `su - mobile`
2. 创建密钥对
	* `ssh-keygen -t rsa`
3. 拷贝公钥到远程服务器
	* 若authorized_keys已存在
	
		cat ~/.ssh/id_rsa.pub | ssh username@example.com "cat - >> ~/.ssh/authorized_keys"`
	* 若authorized_keys不存在
		scp ~/.ssh/id_rsa.pub username@example.com:~/.ssh/authorized_keys  
4. 别名登录
	* 在`~/.ssh/config`里添加如下配置
	
		Host example	
			HostName example.com
			User username
			Port 22

5. 测试
	* `ssh example`能登录到远程主机即表示成功

###断线重连
1. 编辑iOS下`/etc/ssh/ssh_config`
	* 添加一行`ServerAliveInterval 10`
2. Cydia安装automatic ssh
	* 使用`autossh -M 0 -D 9090 -Nfq example`开启SOCKS5代理服务，该命令会立即返回并且后台执行。
	
###创建一个兼容GoAgent和SSH Forwarding的PAC文件
pac可以指定多个代理

	function FindProxyForURL(url, host) {
  		return "DIRECT; PROXY 192.168.1.1:3128; SOCKS5 lilinux.net:1080"; 
	}
上面语句的意思是：

1. 对所有URL，都直接连接；
2. 如果不能直接连接，那么就使用192.168.1.1:3128这个http代理连接；
3. 如果还是不能连接，则使用lilinux.net:1080这个socks5代理连接。	
于是我们可以构造出`SOCKS 127.0.0.1:9090; PROXY 127.0.0.1:8087`让SSH Forwarding和GoAgent同时工作。(注意这里不能使用`SOCKS5`,iOS无法识别，只能用`SOCKS`)

于是需要将GoAgent for iOS里的proxy.pac文件修改一下。

1. 将proxy.pac拷贝到本地

	scp root@192.168.2.107:/Applications/goagent-ios.app/goagent-local/proxy.pac autoproxy.pac
2. 编辑autoproxy.pac
	1. 在行首加入`var D='DIRECT',P='SOCKS 127.0.0.1:9090; PROXY 127.0.0.1:8087'`
	2. 将所有的`"DIRECT"`和`'DIRECT'`替换成`D`
	3. 将所有的`"PROXY 127.0.0.1:8087"`和`'PROXY 127.0.0.1:8087'`替换成`P`
3. 将修改过的autoproxy.pac拷贝到`/var/root`目录

	scp autoproxy.pac root@192.168.2.107:/var/root
	
4. 重新设定WiFi的Pac
	* 设置 -> Wi-Fi -> CurrentWiFi -> HTTP Proxy -> Auto -> file:///var/root/autoproxy.pac
	
5. 	让GPRS/EDGE/3G流量支持Pac
	使用iFile编辑`/private/var/preferences/systemconfiguration/preferences.plist`
	
		Interface = {
			DeviceName = "ip1";
			Hardware = "com.apple.CommCenter";
			Type = "com.apple.CommCenter";
			UserDefinedName = "com.apple.CommCenter (ip1)";
		};
		Proxies = {
			ProxyAutoConfigEnable = 1;
			ProxyAutoConfigURLString = "file:///var/root/pac";
		};
		UserDefinedName = "com.apple.CommCenter (ip1)";
		
	加入Proxies块，（注意：从前版本preferences.plist是xml格式，新的文件采用了JSON格式）重启后生效。
	
##启动
1. 启动GoAgent有两种方法
	1. 在通知菜单启动 最方便
	2. 通过GoAgent for iOS.app启动
2. 启动SSH Forwarding，启动命令为`autossh -M 0 -D 9090 -Nfq example`其中example为host的别名
	* Mac OS远程登录启动（这个？没有电脑不就没戏了）	
	* mobile terminal启动
		1. Cydia里安装mobile terminal
		2. 在mobile terminal里设定shortcut Menu可以快捷输入


##参考文献
1. [GoAgent官方iOS客户端安装教程]
2. [iPhne/iPad 通过SSH终极翻墙解决方案](http://catty-house.blogspot.jp/2012/10/ios-wifiedge3gssh.html)
3. [越狱iPhone下 VPS+Shadowsocks+PAC翻墙](http://catty-house.blogspot.jp/2012/11/iphonevpspythonpac.html)
4. [SSH登陆iPhone后台](http://www.cpplive.com/html/1301.html)
5. [PAC自动代理文件格式，教你如何写PAC文件](http://www.truevue.org/javascript/pac-format)

[GoAgent官方iOS客户端安装教程]: https://code.google.com/p/goagent/wiki/GoAgent_IOS "GoAgent官方iOS客户端安装教程"