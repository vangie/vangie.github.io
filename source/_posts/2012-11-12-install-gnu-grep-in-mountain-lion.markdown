---
layout: post
title: "Mountain Lion系统安装GNU Grep"
date: 2012-11-12 11:32
comments: true
categories: 
---
> [由于License的问题](http://news.ycombinator.com/item?id=4588304)，OS X将GNU Grep替换成了FreeBSD Grep，这两个版本的grep大部分都兼容，FreeBSD Grep唯独少了-P（--per-regex）选项，缺少了对Perl正则表达式的支持。

可以通过使用homebrew自己安装GNU Grep以兼容包含-P参数的bash脚本。

	$ brew tap homebrew/dupes/
	$ brew install homebrew/dupes/grep

记得在PATH里确保/usr/local/bin在/usr/bin前面，并重启终端。

<!-- more -->

####参考文献

1. [Grep in Mac OS X's terminal — only displaying one color](http://superuser.com/questions/419467/grep-in-mac-os-xs-terminal-only-displaying-one-color)
2. [Perl Regex Removed From Grep in Mountain Lion](http://www.dirtdon.com/?p=1452)