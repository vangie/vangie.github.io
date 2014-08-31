---
layout: post
title: "实时web的4种实现方式"
date: 2014-08-16 20:34:05 +0800
comments: true
categories: 
---
>随着互联网的飞速发展，我们在网页里完成越来越多的事情。Web应用程序开始逐渐替代传统的桌面程序，然而HTTP协议设计之初没有考虑到面向应用开发的需求，HTTP协议服务端只能被动的响应客户端（浏览器）的请求，若服务端需要实时的给客户端推送消息，HTTP协议就需要借助与轮询和长连接等变通的技术。这些技术虽然勉强能够实现，但是都有些弊端。直到websocket协议推出，才真正的意义上解决了实时数据传输问题。但是由于旧版本浏览器不兼容websocket协议，为了更好的向下兼容，社区遍有了socket.io框架，该框架能智能识别浏览器端对websocket的支持情况，对于不支持的旧版本浏览器采用长轮询的方式通讯。本文将讨论4中常见的实时Web通讯技术。
<!-- more -->
### 轮询（Polling）

![轮询](/images/post/2014-08-16/polling.png)

浏览器端连续发送请求以寻求新信息，服务端收到请求立即响应，无论请求的新信息是否已经就绪。此方式适用场景要求轮询的时间间隔相对宽松。例如，邮件客户端通常10分钟连接一次服务器检测是否有新邮件。

轮询简单而且易于实现。然而如果对实时的要求提高，提升轮询的频率，这种方式就会变得低效。

### 长轮询 （Long Polling）

![长轮询](/images/post/2014-08-16/long_polling.png)

浏览器端连续发送请求，但是服务端并不立即响应，而是等待请求的资源准备好了才发送响应给客户端。从客户端的角度来看，和普通的轮询没有区别。从服务端的角度看这非常类似于长请求。

那响应端口能保持多久不关闭呢？通常浏览器被设置成5分钟超时，若网络中间存在代理超时间隔可能更短。因此即使没有新消息需要发送，长轮询请求也需要周期性的完成，以触发浏览器重新发送一个新请求。这篇 [IETF 文档][KIBP]建议超时设置成30~120秒，但是真实值如何设置依赖于你对服务器和客户端之间的网络设备的控制程度。

长轮询能显著的降低请求数并保持响应的低延时，尤其是新消息以不规则的频率产生时。然而信息产生过于频繁，长轮询将接近于普通轮询。

### 流推送 （Streaming）

![流推送](/images/post/2014-08-16/streaming.png)

浏览器端连续发送请求，当服务端有新消息时响应请求。然后不同于长轮询，服务端保持响应端口不关闭，持续发送当更多的消息到达时。这种方式不需要轮询，但是它也背离了HTTP请求响应模式的语义。例如客户端和服务端需要协调如何解释响应流，客户端可以知道两个连续消息的分割边界。而且，网络中间设备对响应的缓存会让这种方式失效。这就是为何长轮询使用的更普遍。

### WebSocket

![WebSocket](/images/post/2014-08-16/websocket.png)

浏览器发送一个HTTP 升级首部请求，服务端确认升级，HTTP协议升级为WebSocket协议。此后浏览器和服务器可以在TCP Socket之上双向的发送数据帧。

WebSocket协议被设计用来替换轮询机制，它非常适合服务端和客户端需要高频率的双向交换数据的场景。初始的基于HTTP协议的握手确保WebSocket请求可以穿透防火墙。然后，最大的挑战是仍然后很多遗留的浏览器不支持该协议。

### 参考阅读
1. [Spring MVC 3.2 Preview: Techniques for Real-time Updates](http://spring.io/blog/2012/05/08/spring-mvc-3-2-preview-techniques-for-real-time-updates/)
2. [Real time web实时信息流推送](http://www.slideshare.net/yongboy/real-time-web-14045690)
3. [Known Issues and Best Practices for the Use of Long Polling and Streaming in Bidirectional HTTP][KIBP]
4. [HTTP/1.1 Upgrade header](http://en.wikipedia.org/wiki/HTTP/1.1_Upgrade_header)
5. [WebSocket](http://en.wikipedia.org/wiki/WebSocket)
6. [About HTML5 WebSockets](https://www.websocket.org/aboutwebsocket.html)
7. [Socket.IO 1.0 Protocol](https://github.com/automattic/socket.io-protocol)

[KIBP]: http://tools.ietf.org/html/rfc6202  "Known Issues and Best Practices for the Use of Long Polling and Streaming in Bidirectional HTTP"
