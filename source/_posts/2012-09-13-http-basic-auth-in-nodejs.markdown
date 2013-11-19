---
layout: post
title: "NodeJs里实现HTTP基本认证"
date: 2012-09-13 00:58
comments: true
categories: 
---
## 何为HTTP基本认证(HTTP Basic Auth)
在HTTP中，基本认证是一种用来允许Web浏览器，或其他客户端程序在请求时提供以用户名和口令形式的凭证。
通常我们通过浏览器去访问一个SVN代码库，浏览器会弹出一个窗口，要求输入用户名和密码。一般SVN的的Web服务端采用Apache服务器，因为Apache实现了WebDAV协议，支持HTTP协议管理SVN库。Apache里HTTP基本认证的功能是通过[mod_auth_basic]模块实现的。

<!-- more -->

``` xml
<Location /secure>
	AuthType basic
	AuthName "private area"
	AuthBasicProvider dbm
	AuthDBMType SDBM
	AuthDBMUserFile /www/etc/dbmpasswd
	Require valid-user
</Location>
```
	
## HTTP基本认证的实现机制

1. 客户端请求一个需要身份认证的页面，但是没有提供用户名和口令。
2. 服务端响应一个401应答码，并提供一个认证域。在响应消息的同步加入`WWW-Authenticate: Basic realm="Secure Area"`
3. 接到应答后，客户端显示该认证域（通常是所访问的计算机或系统的描述）给用户并提示输入用户名和口令。此时用户可以确定取消。
4. 用户输入了用户名和口令后，客户端在原先的请求上添加了认证消息头（值是`base64encode(username+":"+password)`），然后重新发送。
5. 服务器接受了认证并返回了页面。如果用户名非法或口令不对，服务器可能返回401应答码，客户端可以再次提示用户输入口令，服务器也可以返回403，提示访问的内容被禁止，用户需要刷新页面再次打开用户名和口令输入窗口。

__客户端请求__（没有认证信息）:

	GET /private/index.html HTTP/1.0
	Host: localhost

__服务端应答__:

	HTTP/1.0 401 Authorization Required
	Server: HTTPd/1.0
	Date: Sat, 27 Nov 2004 10:18:15 GMT
	WWW-Authenticate: Basic realm="Secure Area"
	Content-Type: text/html
	Content-Length: 311
 
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd">
	<HTML>
	<HEAD>
    	<TITLE>Error</TITLE>
    	<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
	</HEAD>
	<BODY><H1>401 Unauthorized.</H1></BODY>
	</HTML>

__客户端的请求__（用户名“"Aladdin”，口令, password “open sesame”）:

	GET /private/index.html HTTP/1.0
	Host: localhost
	Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
	
## 如何在NodeJs里实现HTTP基本认证

``` javascript
var http = require('http');

var server = http.createServer(function(req, res) {
    var auth = req.headers['authorization'];          
    console.log("Authorization Header is: ", auth);
	if(!auth) {     
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.end();
	} else if(auth) {
		var tmp = auth.split(' '); 
		var buf = new Buffer(tmp[1], 'base64');                 
		var plain_auth = buf.toString();
		console.log("Decoded Authorization ", plain_auth);
		var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];
		if((username == 'hack') && (password == 'thegibson')) {  
			res.statusCode = 200;  // OK
        	res.end('<html><body>登录成功!</body></html>');
       	 } else {
            res.statusCode = 401; 
			res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
			res.end();
        }
    }
}).listen(5000, function() { console.log("Server Listening on http://localhost:5000/"); });
```
	
## HTTP基本认证的缺点

所有流行的网页浏览器都支持基本认证,而且非常容易实现，但它有两个非常明显的缺点。

* 以明文传输的密钥和口令很容易被拦截
* 不关闭浏览器的情况下无法登出

### 参考文献

1. [维基百科-HTTP基本认证](http://zh.wikipedia.org/wiki/HTTP%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%81)
2. [Example of HTTP Basic Auth in NodeJS](https://gist.github.com/1686663)


[mod_auth_basic]:http://httpd.apache.org/docs/2.2/mod/mod_auth_basic.html "Apache Module mod_auth_basic"