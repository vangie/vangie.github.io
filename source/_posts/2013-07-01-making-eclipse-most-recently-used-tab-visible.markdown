---
layout: post
title: "让Eclipse最近使用的标签页显示在标签栏"
date: 2013-07-01 14:00
comments: true
categories: 
---
> 当打开文件数量很多时，Eclipse编辑器的标签栏右边会出现一个菜单，把标签栏显示不下的标签页放到一个下拉菜单里，这是一个不错的设计，解决了标签页过多以后标签栏显示不下的问题。（Chrome 的标签页显示采用了另外一种方式，缩写标签页的宽度，以容纳更多的标签页，这种方式对于eclipse不可取，因为网页标签可以借助favicon来区分，而文件标签依赖文件名区分，文件名往往比图标长得多。） Indigo之前版本的eclipse显示标签页采用MRU（Most recently Used）算法来决定标签页的顺序，效果是最近使用过的标签页相对排在前面，显示在标签栏上，很久没有使用过的标签页显示在菜单里。从Eclipse Juno开始标签页的排序算法变了，找到最近打开的标签页变得不方便。

Eclipse Juno的界面样式引入了CSS样式表，SWT的界面元素也可以像网页元素一样，方便的通过CSS进行调整。SWT在CSS规范的基础上进行了一下扩展，引入了一些“swt-”为前缀的属性，用于精细化调整界面里控件元素的显示样式。

其中，`swt-mru-visible`就是一个可以开启MRU算法排序的样式。

<!-- more -->

###安装Eclipse主题CSS编辑器插件

打开E4安装站点并且安装E4 CSS Editor(Incubation)插件。

E4 update Site: http://download.eclipse.org/e4/updates/0.12

![安装E4 CSS Editor(Incubation)插件](/images/post/2013-07-01/install-plugin.png)

###修改主题

安装完插件重启后，打开首选项->General->Appearence选项页，Appearence选项页里有一个嵌入的CSS编辑器，就是刚才安装的CSS编辑器的效果。

![编辑CSS](/images/post/2013-07-01/edit-css.png)

保存即可。

###参考阅读
[1]. [Eclipse Juno tabs repositionning](http://stackoverflow.com/questions/12578197/eclipse-juno-tabs-repositionning)   
[2]. [Eclipse4/CSS](http://wiki.eclipse.org/Eclipse4/CSS)   
[3]. [Retain previous open file tab under visible tabs](http://stackoverflow.com/questions/11255389/retain-previous-open-file-tab-under-visible-tabs)