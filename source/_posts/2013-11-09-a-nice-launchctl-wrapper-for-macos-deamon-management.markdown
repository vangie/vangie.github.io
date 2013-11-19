---
layout: post
title: "一个优雅的Mac OS服务管理程序launchctl的包装工具"
date: 2013-11-09 17:32
comments: true
categories: 
---
>launchctl是mac os平台的服务管理程序，相当于linux平台的service。但是launchctl真心难用，比如不支持重启服务，关闭服务需要指定配置文件plist的全路径。[lunchy](https://github.com/mperham/lunchy)是一个launchctl的包装程序，大大简化了agent的管理。

###安装
lunchy是一个ruby程序，可以通过gem直接安装

	gem install lunchy
	
###命令

* ls [pattern]
* start [pattern]
* stop [pattern]
* restart [pattern]
* status [pattern]
* install [file]
* show [pattern]
* edit [pattern]

lunchy的一个重要功能改进是支持通配，除了安装install agent需要指定完整的文件路径外，其他命令只需要输入特征词即可。	

比如启动redis服务

	launchctl load ~/Library/LaunchAgents/io.redis.redis-server.plist
	
使用lunchy非常简单

	lunchy start redis
### 参考阅读

1. [OS X 下使用 lunchy 替换 launchctl 管理 daemon apps](http://v2ex.com/t/88644)
