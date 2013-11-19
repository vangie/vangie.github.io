---
layout: post
title: "jetty临时目录被tmpwatch定时任务删除"
date: 2012-09-07 16:44
comments: true
categories: 
---
linux下部署的jetty，隔大哥一周时间就会访问出错，或者出现web应用的目录列表。很长一段时间都被这个问题困扰着，由于是个演示系统，持续运行的要求不高，无奈配置了一个cron，定时重启。

最近发现原来linux下有一个叫做`tmpwatch`的命令，而且默认配置成了`cron.daily`。每日执行一次。

<!-- more -->

	[root@bsdn02 ~]# cat /etc/cron.daily/tmpwatch 
	#! /bin/sh
	flags=-umc
	/usr/sbin/tmpwatch "$flags" -x /tmp/.X11-unix -x /tmp/.XIM-unix \
		-x /tmp/.font-unix -x /tmp/.ICE-unix -x /tmp/.Test-unix \
		-X '/tmp/hsperfdata_*' 10d /tmp
	/usr/sbin/tmpwatch "$flags" 30d /var/tmp
	for d in /var/{cache/man,catman}/{cat?,X11R6/cat?,local/cat?}; do
    	if [ -d "$d" ]; then
			/usr/sbin/tmpwatch "$flags" -f 30d "$d"
    	fi
	done

此定时任务根据文件的修改/创建时间,清理`/tmp`下的10天前创建或修改的文件。

jetty启动一个Web应用时，需要先按照`jetty_host_port_virtualHost_contextPath_hash`的格式创建一个子目录。该临时目录注册给ServletContext里的`javax.servlet.context.tempdir`属性。临时目前确定的规则如下

1. 通过`WebAppContext.setTempDirectory`设置的临时文件目录
2. 上下文中已经定义的`javax.servlet.context.tempdir`所对应的目录
3. `${jetty.home}/work`目录
4. `WEB-INF/work`目录
5. `${java.io.tmpdir}`目录

默认情况下，jetty取得的临时目录是`${java.io.tmpdir}`目录,linux系统里，该目录通常指向`/tmp`目录。jetty会在临时目录里创建一个`webapp`子目录，用户存放war包里解压出来的内容。若`tmpwatch`真好删除了，`webapp`目录里的文件，特别是index.html或者index.jsp，就会导致上述的问题。

这里面需要注意的是，除了第一种（并且仅当该目录为Jetty创建的前提下）和最后一种使用场景下Jetty会在Web应用程序退出以后自动删除临时目录以外，其余场景Jetty都会保留临时文件目录。这就解释了为什么每隔一段时间重启服务能避开这个问题。但是更好的解决方法是，通过设置虚拟机的启动参数`-Djava.io.tmpdir`，把临时文件指向不受`tmpwatch`影响的目录位置。






#### 参考文献
1. [在Jetty中定位临时文件目录](http://lostinmalmo.com/others/2009/04/20/jetty_tmp_dir.html)
2. [遇到一个Jetty tmp的陷阱](http://www.colorfuldays.org/program/%E9%81%87%E5%88%B0%E4%B8%80%E4%B8%AAjetty-tmp%E7%9A%84%E9%99%B7%E9%98%B1/)
3. [Jetty部署中tmpdir导致服务不可用的问题](http://www.longtask.com/blog/?p=734)