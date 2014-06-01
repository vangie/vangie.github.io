---
layout: post
title: "将Git提交版本号作为Rails应用版本号"
date: 2014-05-17 14:02:04 +0800
comments: true
categories: 
---
>应用的版本管理和代码的版本管理通常是分开的，作为两套独立的版本系统来维护。对于小型应用来说有些浪费精力。最早在[GitLab](https://www.gitlab.com/)这款开源软件上看到其使用Git的提交版本号作为版本号，本文将借鉴这种做法。

### 获得Git版本号	
1. 开发环境，当前的工作目录里包含了`.git`目录，直接执行下面的命令`git describe --always`。该命令通常返回形如`1f36a3b`的SHA-1短序列，但是如果该提交版本有对应的Tag的话，将返回该Tag名称。真实应用发布场景显得非常有用，毕竟随机序列不如自定义的有意义的名称便于记忆、沟通和传播。
2. 对于[Capistrano](http://capistranorb.com/)工具发布的生产环境，应用根目录不包含`.git`目录，所以如果通过`git`命令直接获得代码版本号，好在Capistrano发布时会自动生成`REVISION`文件，其内容为代码版本号。

综合两种情况的代码如下

	if File.exist? 'REVISION' then `cat REVISION`.chomp else `git describe --always` end
<!-- more -->
### 版本号作为静态变量
上面我们讨论了在rails应用里通过代码获得版本号，但是版本号在应用系统相当于静态变量，在启动时候初始化，通过更有意义的名称（app_version）来引用会方便一些。

下面我们介绍如何结合[settingslogic](https://github.com/binarylogic/settingslogic)，将版本号变成应用级的全局变量（通过`Settings.app_version`引用）。

在`Gemfile`里添加下面一行
	
	gem 'settingslogic'

然后执行`bundle install`.

向`config/application.yml`文件添加如下内容：
	
	#config/application.yml
	defaults: &defaults
		app_version: <%= `git describe --always`%>
	
	development:
		<<: *defaults

	test:
		<<: *defaults
	
	production:
		<<: *defaults

修改`config/application.rb`文件
在`module AppName`（AppName 随应用名称而变）行之后添加
	class Settings < Settingslogic
		source File.expand_path("../application.yml", __FILE__)
		namespace Rails.env
	end

### HTTP响应包含版本号
用Rails实现一个纯API应用，仅接受和响应JSON格式数据，将版本号添加到响应头部是一种不错的方法。

编辑`config/application.rb`在`class Application < Rails::Application`里面加入

	config.action_dispatch.default_headers.merge!({ 
		'X-App-Version' => Settings.app_version 
	})
			
### 参考阅读
1. [Show the version number of your Rails app using Git](http://blog.danielpietzsch.com/post/1209091430/show-the-version-number-of-your-rails-app-using-git)
2. [Setting headers in Rails 4](http://chriszetter.com/blog/2013/10/04/setting-headers-in-rails-4/)
