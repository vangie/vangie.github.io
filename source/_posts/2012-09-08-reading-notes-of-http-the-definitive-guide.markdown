---
layout: post
title: "《HTTP权威指南》读书笔记"
date: 2012-09-08 12:45
comments: true
categories: 
toc: true
---
>一直在做web开发，对HTTP协议还算熟悉，但是这本手册类的砖头书还是很吸引我，看了两章觉得还不错，对于巩固基础很有帮助，最近感觉记性不如从前，烂笔头越来越重要了。

#第一章 HTTP概述

## MIME

媒体类型`MIME`（Multipurpose Internet Mail Extension）最初设计是为了解决不同的电子邮件系统之间搬移报文时存在的问题。

<!-- more -->

MIME类型是一种文本标记，表示一种主要的对象类型和一个特定的子类型，中间由一条斜杠来分割

* HTML格式 text/html
* ASCII文本 text/plain
* JPEG图片 image/jpeg
* GIF图片 image/gif

## URI

URI(Uniform Resource Identifier)统一资源标识符，他有两种形式URL和URN

* URL（Uniform Resource Locator）同一资源定位符
* URN（Uniform Resource Name）同一资源名 
	* 由唯一的资源名来定位文件，解决URL因服务器变更等原因导致资源无法找到的问题，但是由于URL已被广泛的接受，目前URN技术没推广计划。
	* 语法 `urn:<NID>:<NSS>`<br/>
		`<NID>`表示命名空间标识符<br/>
		`<NSS>`表示命名空间里的特定字符
	
## 协议

HTTP协议是基于TCP协议的文本类型的报文，报文非为请求（Request）和相应（Response），报文的结构由3部分组成

* 起始行（start line）
* 首部字段（header）
* 主体（body）
		
Telnet实质上就是一个基于TCP协议的工具，所有可以使用Telnet工具模拟HTTP报文与web服务器通讯。

## HTTP协议的版本

* HTTP/0.9 已经废弃
* HTTP/1.0 
* HTTP/1.0+ 各家厂商自己扩展的协议
* HTTP/1.1 当前使用版本
* HTTP/2.0(HTTP-NG) 尚未推广

## web的结构组件

### 代理
位于客户端和服务器之间的HTTP中间实体。客户端向代理发出请求，代理代替客户端向服务端发出请求。
### 缓存
HTTP的仓库，使常用的页面的副本可以保存在离客户端更近的地方。
### 网关
连接其他应用程序的特殊web服务器，将HTTP协议转换为其他协议，如FTP协议
### 隧道
对HTTP通信报文进行盲目转发的特殊代理，常见用途，通过HTTP连接承载SSL流量
### Agent 代理
发起自动HTTP请求的半智能web客户端，浏览器或者网络蜘蛛。

## 相关资源链接

1. [RFC2616 超文本传输协议-HTTP/1.1](http://www.ietf.org/rfc/rfc2616.txt)
2. [RFC1945 超文本传输协议-HTTP/1.0](http://www.ietf.org/rfc/rfc1945.txt)
3. [RFC2396 统一资源标识符：通用语法](http://www.ietf.org/rfc/rfc2396.txt)
4. [RFC2141 URN语法规范](http://www.ietf.org/rfc/rfc2141.txt) 
5. [RFC2046 MIME第二部分：媒体类型](http://www.ietf.org/rfc/rfc2046.txt)
6. [因特网Web复制和缓存分类法](http://www.wrec.org/Drafts/draft-ietf-wrec-taxonomy-06.txt)
7. [Why HTTP](http://www.w3.org/Protocols/WhyHTTP.html)
8. [万维网简史](http://www.w3.org/History.html)
9. [高考俯瞰Web结构](http://www.w3.org/DesignIssues/Architecture.html)

# 第二章 URL与资源

## URL的语法

	<schema>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag>
	
几乎没有URL包含上面的全部，最常见的部分是：`schema`，`host`，`path`

* \<params>:参数

  参数和参数，参数和路径之间使用`;`分割，每一级路径都可以带参数

		ftp://prep.ai.mit.edu/pub/gnu;type=d
		http://www.joes-hardware.com/hammers;sale=false/index.html;graphics=true
	
## URL字符集
URL可以接受的字符是US-ASCII字符集的子集，超过该字符集的字符需要使用`%`+两位16进制数进行转义。

## 需要转义的字符

字符           |保留/受限
:-------------|:-------
%             |转移字符
/             |路径分隔符
.             |路径当前目录
..            |路径上一级目录
\#            |分段定界符号
?             |查询定界符号
;             |参数定界符号
:             |方案，用户/口令,主机/端口定界符号
$ , +         |保留
@ & =         |用户/主机,查询条件,键值对定界符号
{}\|\\^~[]'   |由于各种传输Agent代理不安全处理，受限
<>"           |不安全，会破坏html文档
0x00-0x1F,0x7F|不可见
\>0x7F        |超出US-ASCII字符集范围

##PURL
	
PURL(persistent uniform resource locators)[永久统一资源定位符](http://purl.oclc.org)，是一种使用URL实现URN功能的方案。

# 第三章 HTTP报文
这张全面的介绍了http报文。

## 报文的结构

### 报文语法

__请求报文__

	<method> <request-URL> <version>
	<headers>
	
	<entity-body>
	
__响应报文__
	
	<version> <status> <reason-phrase>
	<headers>
	
	<entity-body>
	
### 起始行

__方法__

HTTP规范定义的方法：`GET`、`HEAD`、`POST`、`PUT`、`TRACE`、`OPTIONS`、`DELETE`。其中除了POST方法外，其它方法都是幂等的。

除了规范定义的7中方法，其他服务器可以实现一些自己的请求方法，这类自己实现的方法称为`扩展方法`。

__状态码分类__

整体范围      |已定义范围   |分类
:-----------|:-----------|:-------
100~199      |100-101    |信息提示
200~299      |200-206    |成功
300~399      |300-305    |重定向
400~499      |400-415    |客户端错误
500~599      |500-505    |服务端错误

__原因短语__

原因短语是响应起始行中的最后部分。他是文本形式，`HTTP/1.0 200 OK`，`OK`就是原因短语。原因短语没有控制作用，原因短语与状态码不匹配不会引发任何异常。

### 首部

首部紧接着起始行，为请求和响应添加一些附加信息，可分为

* 通用首部
* 请求首部
* 响应首部
* 实体首部
* 扩展首部



(未完待续…)

	
