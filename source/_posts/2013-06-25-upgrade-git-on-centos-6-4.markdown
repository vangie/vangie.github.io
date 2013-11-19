---
layout: post
title: "CentOS 6.4升级Git"
date: 2013-06-25 23:42
comments: true
categories: 
---
> GitHub和许多Git服务依赖的Git版本不低于1.7.10，而CentOS 6.4通过epel安装的git版本为1.7.1。rpmforge源里的二进制包比epel更新，本文介绍如果通过epel源升级git到1.7.11版本。

###安装rpmforge源

	# rpm -i http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
	
安装证书

	# rpm --import http://apt.sw.be/RPM-GPG-KEY.dag.txt
	
更新rpmforge-extra源

	# yum --enablerepo=rpmforge-extras update
	
<!-- more -->
	
### 安装Git
插槽可用的git模块

	# yum --enablerepo=rpmforge-extras provides git
	
安装git-1.7.11

	# yum --enablerepo=rpmforge-extras install git-1.7.11.3-1.el6.rfx.x86_64 

原来的1.7.1版本的git会被覆盖

	# git --version

### 参看资料
[1]. [Update Git On CentOS 6.3](http://www.charlestonsw.com/update-git-on-centos-6-3/)   
[2]. [Install and Enable RPMForge Repository in RHEL/CentOS 6, 5, 4](http://www.tecmint.com/install-and-enable-rpmforge-repository-in-rhel-centos-6-5-4/)