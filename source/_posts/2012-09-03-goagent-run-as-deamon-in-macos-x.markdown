---
layout: post
title: "MacOS X将GoAgent配置为后台服务"
date: 2012-09-03 22:22
comments: true
categories: 
---
>[GoAgent]官方推荐使用[GoAgent Mac GUI]或者[GoAgentX]作为Mac下的客户端，[GoAgent Mac GUI]不支持随机启动，图标太难看。[GoAgentX]图标和功能都不错，但是内置的goagent版本不是最新的。所有自己折腾了一下使用Mac下的LaunchAgent机制将goagent配置成自启动的后台服务。

## 新建plist文件
在`~/Library/LaunchAgents/`目录里新建`com.googlecode.goagent.plist`文件。

<!-- more -->

文件内容如下

	<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
	<plist version="1.0">
		<dict>
			<key>RunAtLoad</key>  
        	<true/>
			<key>KeepAlive</key>
			<true/>
			<key>Label</key>
			<string>com.googlecode.goagent</string>
			<key>NetworkState</key>
			<true/>
			<key>ProgramArguments</key>
			<array>
				<string>/usr/bin/python</string>
				<string>/Users/vangie/Library/goagent-goagent-dcb39d4/local/proxy.py</string>
			</array>
			<key>StartCalendarInterval</key>
       		<dict>
       	    	<key>Hour</key>
            	<integer>5</integer>
            	<key>Minute</key>
            	<integer>10</integer>
        	</dict>
			<key>ServiceDescription</key>
			<string>goagent Local Service</string>
		</dict>
	</plist>
	
注意`/Users/vangie/Library/goagent-goagent-dcb39d4/local/proxy.py`根据[GoAgent]的存放位置做相应的修改。 

## 载入并运行该文件

	$ launchctl load ~/Library/LaunchAgents/com.googlecode.goagent.plist
	$ launchctl start com.googlecode.goagent

just enjoy it!

[GoAgent]: http://code.google.com/p/goagent/ "GoAgent"
[GoAgent Mac GUI]: https://goagent.googlecode.com/files/GoAgentMac.dmg "GoAgent Mac GUI"
[GoAgentX]: https://github.com/ohdarling/GoAgentX "GoAgentX"