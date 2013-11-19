---
layout: post
title: "NodeJs里将中文字符转换成拼音字母"
date: 2012-09-18 01:12
comments: true
categories: 
---
中文文件名在不同的平台下常常会出现乱码问题.除了理清编码关系,正确的编解码外,比较简单的办法就是把中文去掉或者不用中文.

最近在做一个文件上传相关的功能,windows下的中文文件传到linux服务器上变成一串乱码文件名.于是想把文件名里的中文字符转换成拼音字母,这样相比直接使用UUID之类的做法,保留了部分语意.

<!-- more -->

Javascript作为一个轻量级的脚本语言本身并不支持字符到拼音的转换,甚至不支持字符集的转换.[pinyin.js](https://github.com/hotoo/pinyin.js)是一个支持汉字转换成拼音的js库,[node-pinyin](https://github.com/vingel/node-pinyin)是基于该库在node平台的一个简单移植版本.使用起来比较简单.

安装

```
npm install pinyin
```

下面给出中文文件名的转换拼音方法源码

``` javascript
var pinyin = require('pinyin');

function normalize(originalName){
    var result = '';
    for(var i=0;i<originalName.length;i++){
        var charcode = originalName.charCodeAt(i);
        var char = originalName.charAt(i);
        if(charcode > 47 && charcode <58){
            result += char;
        }else if(charcode>64 && charcode<91){
            result += char.toLowerCase();
        }else if(charcode>96 && charcode<123){
            result += char;
        }else if(charcode> 0x4E00 && charcode < 0x9FA5){
            result += ("_" + pinyin(char,true,'').toLowerCase());
        }else if(charcode==46){
            result += '.';
        }else{
            result += '_';
        }
    }
    return result;
}
```
