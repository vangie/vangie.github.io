---
layout: post
title: "支持Markdown的Finder快速预览插件"
date: 2013-03-16 12:33
comments: true
categories: 
---
> 寻找一个可扩展的markdown parser的java或者javascript实现，wikipedia上有一个[列表](http://en.wikipedia.org/wiki/List_of_Markdown_implementations)非常全。比较之后决定弃用[pagedown](http://code.google.com/p/pagedown/)改用[markdown4j](http://code.google.com/p/markdown4j)，明显后者功能更加全面，而且同样可扩展。在这个长长的列表里意外的发现了[qlmarkdown]。

[qlmarkdown]是一个QuickLook的扩展（在Finder里选中文件敲空格键弹出的那个窗口就是Quicklook功能）。安装了这个扩展以后就可以快速的预览markdown文件了。

<!-- more -->

下载地址：https://github.com/toland/qlmarkdown/downloads

安装步骤很简单，拷贝QLMarkdown.qlgenerator到目录 `~/Library/QuickLook` 或者 `/Library/QuickLook`即可。

效果图

![Quicklook](/images/post/2013-03-16/quicklook.png)

[qlmarkdown]:(https://github.com/toland/qlmarkdown/)