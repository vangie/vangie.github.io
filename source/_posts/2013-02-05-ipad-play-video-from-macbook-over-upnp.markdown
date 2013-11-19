---
layout: post
title: "iPad通过uPnp协议播放MacBook里的视频文件"
date: 2013-02-05 00:58
comments: true
categories: 
---
> mac air里下载的电影通过开启upnp服务，然后iPad安装一个支持upnp服务的播放器可以直接播放电影，免去拷贝的过程。

#Mac OS端安装Mediatomb
mediatomb是一个跨平台免费的upnp服务器，以web ui的方式管理，仅仅是一个命令行工具。

	brew install mediatomb

安装完成以后执行命令`mediatomb`,如果遇到端口被占用的错误，需要重启一下机器。我重启两次就好了。

#iOS端安装aceplayer

[aceplayer](https://itunes.apple.com/us/app/aceplayer-powerful-media-player/id540326056?mt=8)是一个近乎全能的播放器，支持upnp，可以直接播放或者下载upnp服务器里的视频文件。但是播放时色彩还原效果相对差一点。