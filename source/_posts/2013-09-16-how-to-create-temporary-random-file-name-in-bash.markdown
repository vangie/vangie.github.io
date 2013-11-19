---
layout: post
title: "Bash如何创建随机文件名"
date: 2013-09-16 23:50
comments: true
categories: 
---
>本文介绍3种不同的方法创建随机缓存文件名。在编写需要创建唯一的缓存文件的脚本时非常有用。

###1.使用$RANDOM shell变量

在控制台执行如下命令

	echo $RANDOM

每次都获得一个随机数，借用这个变量可用来生成一个随机的文件名

	#!/bin/bash
	echo "List of temporary files : "
	for i  in 1 2 3 4 5
	do
   		FILE="/tmp/$(basename $0).$RANDOM.txt"
   		echo $FILE # show file name
   		> $FILE # create files
	done 

###2.使用$$变量
这是一个经典的方法，$$变量返回当前进程的进程号，对于整个系统来说这是一个唯一数字。

	#!/bin/bash
	TFILE="/tmp/$(basename $0).$$.tmp"
	ls > $TFILE
	echo "See diretory listing in $TFILE"

###3.使用mktemp和tempfile命令
通过mktemp和tempfile命令是最佳的方式

	$ mktemp
	
输出

	/tmp/tmp.IAnO5O
	
或者

	$ tempfile
	
输出

	/tmp/IAnO5O
	
当然还能生成随机文件夹

	$ mktemp -d
	$ tempfile -d



###参考阅读
1. [Shell scripting (BASH) : How to create temporary random file name](http://www.cyberciti.biz/tips/shell-scripting-bash-how-to-create-temporary-random-file-name.html)