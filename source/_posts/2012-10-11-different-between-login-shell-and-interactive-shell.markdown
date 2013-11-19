---
layout: post
title: "登录Shell和交互Shell的区别"
date: 2012-10-11 14:47
comments: true
categories: 
---
>遇到两个shell的概念：`交互式登录shell`和`交互式非登录shell`。要理解上面两个术语，先要理清两个概念`登录shell`和`交互shell`

<!-- more -->
###登录shell（Login shell）
从tty下登录（login）进去的shell称为`登录shell`,在已经登录的shell执行bash或者su命令启动的shell称为`非登录shell`（non-login shell）注意：通过命令`su -l [username]`可以进入`登录shell`，另外在图形界面（如Gnome）打开的命令行窗口（terminal）属于`非登录shell`。

#####配置文件
登录shell和非登录shell启动的时候会装载不同的配置文件。

登录shell

* `/etc/profile`
* `~/.bash_profile`
* `~/.profile`

非登录shell

* `/etc/bashrc`或者`/etc/bash.bashrc`
* `~/.bash_rc`

###交互shell（Interactive Shell）
交互就是`REPL`（Read-Eval-Print-Loop）。通俗的说，就是你输入点什么，它执行，然后你查看输出结果，周而复始。我们通常使用的shell都是`交互shell`。而`非交互shell`常见的场景是执行bash脚本的时候`bash script.sh`。shell以一种静默的方式逐行连续执行脚本。

`登录shell`和`交互shell`是两个不同纬度的概念，所以组合就有所谓的`交互式登录shell`和`交互式非登录shell`。

##### 如何退出交互shell
对于`非登录shell`执行`exit`命令，对于`登录shell`执行`logout`命令.

###参考文献
1. [交互式shell和非交互式shell、登录shell和非登录shell的区别](http://www.51testing.com/?uid-225738-action-viewspace-itemid-216858)
