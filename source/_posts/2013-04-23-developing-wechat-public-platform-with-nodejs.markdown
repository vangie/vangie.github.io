---
layout: post
title: "使用NodeJs开发微信公众平台账号"
date: 2013-04-23 16:25
comments: true
categories: 
---

> 微信越来越火，信息、语音短信、视频电话等非常实用OTT业务加上QQ好友和通讯录的导入一时间吸引了大量的用户。前段时间各大运营商开始吵着要收微信的费用。所谓“发现即晚期”，当运营商发现苗条不对的时候，已经来不及了。微信除了提供了好用的通讯替代功能，还是一个可扩展的平台，比如：微信公众平台，一种账号层面的扩展，可以理解为一种微信的公众账号区别于个人账号，通常可作为一种的资讯发布渠道，也可被实现成机器人程序与用户互动。本文介绍如何基于微信公众平台的Open API使用NodeJs开发一个HelloWord程序。

<!-- more -->
### 开启开发模式

前往http://mp.weixin.qq.com 注册一个公众平台账号，注册过程与通常无异。激活并登录账号，前往【高级功能】开启【开发模式】（开启之前要确保头像已上传）。

####接口配置信息
接口配置信息用于公众平台与应用程序之间相互验证。
假设配置信息如下

	URL:	http://mydomain.com/weixin
	Tokan:	balabala

在提交该信息之前需要先保证该URL已经可访问，

### 使用ExpressJs编写一个WebServer

####server.js
```javascript
//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , weixin = require('./lib/weixin')
    , xmlBodyParser = require('./lib/xmlBodyParser')
    , port = (process.env.PORT || 80);

//Setup Express
var server = express.createServer();

server.configure(function(){
    server.use(connect.bodyParser());
    server.use(xmlBodyParser);
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

server.listen(port, 'mydomain.com');

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

server.get('/weixin', weixin.doGet);
server.post('/weixin', weixin.doPost);

console.log('Listening on http://mydomain.com:' + port );
```
####lib/xmlBodyParser.js
这是一个处理xml请求的工具包，expressJs默认值不解析MIME类型为text/xml类型的请求。
```javascript
var xml2js = require('xml2js');

function mime(req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

module.exports = function xmlBodyParser(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();

    // check Content-Type
    if ('text/xml' != mime(req)) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){
        var parseString = xml2js.parseString;
        parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                next();
            }
        });
    });
};
```

####lib/weixin.js
处理来自微信公众平台的get和post请求。
```javascript
var almanac = require('./almanac'),
    crypto = require('crypto'),
    util = require('util'),
    xmlbuilder = require('xmlbuilder');

exports.doGet = function(req, res){

    if(!checkSource(req)){
        res.end('error');
        return;
    }

    res.end(req.query.echostr);
}

exports.doPost = function(req, res){

    if(!checkSource(req)){
        res.end('error');
        return;
    }

    var xml = buildXml(msg.FromUserName, msg.ToUserName, 'text', '0', function(xml) {
        return xml.ele('Content')
            .dat('hello world');
    });

    console.log(xml);

    res.contentType('text/xml');
    res.send(xml, 200);
}


function checkSource(req){
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        shasum = crypto.createHash('sha1'),
        arr = ['balabala', timestamp, nonce];

    shasum.update(arr.sort().join(''),'utf-8');
    return shasum.digest('hex') == signature;
}

function buildXml(to, from, msgType, funFlag, callback){
    var xml = xmlbuilder.create('xml')
        .ele('ToUserName')
        .dat(to)
        .up()
        .ele('FromUserName')
        .dat(from)
        .up()
        .ele('CreateTime')
        .txt(new Date().getMilliseconds())
        .up()
        .ele('MsgType')
        .dat(msgType)
        .up();
    xml = callback(xml);
    return xml.ele('FuncFlag',{},funFlag).end({pretty:true});
}
```
###参阅

1. [如何让 Node-express 支持 XML 形式的 POST 请求？](http://www.tfan.org/using-xml2js-for-express-body-parser/)
2. [Express-Node: Accepting POST with Content-Type: application/xml](https://gist.github.com/davidkrisch/2210498)
