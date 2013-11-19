---
layout: post
title: "在Mac OS里配置Apache+PHP+Mysql环境"
date: 2013-11-08 21:54
comments: true
categories: 
---
>Apache+PHP+Mysql是PHP开发的标配，Windows系统可以安装[EasyPHP](www.easyphp.org)集成包。Mac系统也有相应的集成包[MAMP](http://www.mamp.info/en/index.html)。但是考虑到Mac OS已经自带了Apache和PHP环境，重复安装Apache和PHP有些冗余，所有本文介绍如何使用homebrew安装Mysql并且集成原有的Apache和PHP环境。

### 启动Apache

打开Terminal，然后运行

	sudo apachectl start
	
查看Mac OS X的Apache版本

	sudo apachectl -v
	
Mac OS X 10.9的返回结果是

>Server version: Apache/2.2.24 (Unix)   
Server built:   Aug 24 2013 21:10:43

如此在浏览器中输入`http://localhost`，就可以看到一个内容为“It works!”的页面，其位于`/Library（资源库）/WebServer/Documents/`下，这就是Apache的默认根目录。

另外，用户可以通过`http://[本地IP]/~[用户名]`来访问`/Users/[用户名]/Sites/`目录

### 开启PHP支持

1. 在终端中运行`sudo vi /etc/apache2/httpd.conf`，打开Apache的配置文件。
2. 找到`#LoadModule php5_module libexec/apache2/libphp5.so`，把前面的#号去掉，保存（在命令行输入:w）并退出vi（在命令行输入:q）。
3. 运行`sudo cp /etc/php.ini.default /etc/php.ini`，这样就可以运行`sudo vi /etc/php.ini`来编辑php.ini配置各种功能了。比如：

	;通过下面两项来调整PHP提交文件的最大值，如phpMyAdmin中导入数据的最大值
	upload_max_filesize = 2M
	post_max_size = 8M
	;通过display_errors来控制是否显示PHP程序的报错信息，这在调试PHP程序时非常有用
	display_errors = Off
4. 运行“sudo apachectl restart”，重启Apache，这样PHP就可以用了。

### 安装Xdebug

1. 在终端执行`php -i | pbcopy`，php的输出信息会被拷贝的剪切板。
2. 打开[xdebug安装在线向导](http://xdebug.org/wizard.php),在文本框内Command+V，将剪切板内的内容拷贝到文本框，然后点击“Analyse my phpinfo() output”按钮。
3. 根据生成的步骤安装即可。

### 安装Mysql

这一步最简单了，前提是已安装了[HomeBrew](http://brew.sh)。
在命令行执行

	brew install mysql
	
安装完成以后,启动mysql服务

	mysql.server start



###参考阅读
1. [在Mac OS X中配置Apache ＋ PHP ＋ MySQL](http://dancewithnet.com/2010/05/09/run-apache-php-mysql-in-mac-os-x/)