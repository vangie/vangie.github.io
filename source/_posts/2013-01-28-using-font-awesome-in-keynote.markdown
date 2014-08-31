---
layout: post
title: "在Keynote里输入Font Awesome字符"
date: 2013-01-28 23:23
comments: true
categories: 
---
>[Font Awesome]提供了200多个矢量图标的字体文件。矢量字体可以支持无线的放缩，而且体积更好，如果能放到keynote里作为幻灯片的图标素材非常不错。想法是好的，但是由于这些字体对应了一些保留的unicode编码，使用通常的输入法无法输入。

###安装Font Awesome字体

下载 [FontAwesome-Font-Awesome.zip](https://github.com/FortAwesome/Font-Awesome/zipball/master)，解压缩后，找到font/FontAwesome.otf文件，双击安装即可。

###找到icon对应的Unicode编码
找到css/font-awesome.css文件，使用编辑器打开。可以找到许多形如

```css
.icon-key:before                  { content: "\f084"; }
```

其中`f084`就是icon-key图标对应的unicode编码。	
###开启Mac OS的unicode16进制输入法
打开“系统偏好设置\语言与文本\输入源”,在左侧"请选择要使用的输入源"列表中勾上”Unicode 十六进制输入“。然后将系统输入法切换为”Unicode输入法“。按住Option(Alt)健输入4位unicode字符即可输入.若当前字体不存在对应的unicode编码的字形会出现框框，所有输入前需要在keynote里把当前字体改为FontAwesome。


[Font Awesome]: http://fortawesome.github.com/Font-Awesome/