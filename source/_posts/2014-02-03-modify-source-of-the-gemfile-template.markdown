---
layout: post
title: "将Gemfile模板文件的source改成淘宝源"
date: 2014-02-03 21:54:20 +0800
comments: true
categories: 
---
> 由于国内网络原因（你懂的），导致rubygems.org存放在Amazon S3上面的资源文件间歇性连接失败。所有你会遇到`gem install rack`或`bundle install`的时候半天没有响应。将默认源改成国内的淘宝源(http://ruby.taobao.org)可以解决该问题。

对于Rails项目通常需要将Gemfile的第一行改为

		source 'http://ruby.taobao.org/'

但是通过`rails new my_project`创建项目时，由于Gemfile生成以后立即执行`bundle install`，此时source尚未修改，所以项目创建的过程仍然很慢。

解决rails new 卡住的问题，有如下两种方法

<!-- more -->

###使用`--skip-bundle`参数

	rails new app1 --skip-bundle

通过设置`--skip-bundle`参数，`rails new` 命令创建完成项目骨架以后，不会执行`bundle install`。于是可以修改Gemfile行首的source，然后再执行`bundle install`。

###修改Gemfile模板

使用如下命令，修改Gemfile模板文件，一劳永逸

####For Mac
	/usr/bin/sed -i .bak 's!https://rubygems.org!http://ruby.taobao.org!' `rvm info homes | grep gem: | awk '{print $2}' | tr -d '"'`/gems/railties-`gem list | grep railties | awk '{print $2}'| tr -d '()'`/lib/rails/generators/rails/app/templates/Gemfile

####For Linux

	sed -i 's!https://rubygems.org!http://ruby.taobao.org!' `rvm info homes | grep gem: | awk '{print $2}' | tr -d '"'`/gems/railties-`gem list | grep railties | awk '{print $2}'| tr -d '()'`/lib/rails/generators/rails/app/templates/Gemfile

###参考阅读

1. [RubyGems 镜像 - 淘宝网](http://ruby.taobao.org/)
2. [修改Rails默认生成的Gemfile的source](http://snails.github.io/2012/06/04/Modify-the-Gemfile-Template/)
3. [run bundle install 卡住很久](http://ruby-china.org/topics/914)