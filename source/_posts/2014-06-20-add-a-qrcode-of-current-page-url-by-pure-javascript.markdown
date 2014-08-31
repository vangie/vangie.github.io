---
layout: post
title: "纯Javascirpt实现页面二维码"
date: 2014-06-20 11:39:03 +0800
comments: true
categories:
---
>页面采用响应式布局可以在移动设备上有较好的展现效果，但移动设备输入长长的URL地址有些麻烦。URL**二维码**结合**微信扫一扫**可以较好的解决输入不便的问题。通常二维码是一张黑白相间的图片，网上可以找到很多二维码的生成工具和生成服务。所以二维码通常采用预生成或者临时请求第三方服务生成的方式引入到页面中，本文介绍一种通过js动态生成二维码的实现方法，并附带交互上的特效。动态生成可以方便的适应URL的变化。js动态生成可以去除对第三方服务的依赖，在隔绝内网下也可以使用。

![页面二维码效果图](/images/post/2014-06-20/qrcode.png)

<!-- more -->

Jade
{% codeblock lang:jade %}
a.p-qrcode-link(href='#')
  span.icon-qrcode
    .p-qrcode
{% endcodeblock %}

Stylus
{% codeblock lang:css %}
.p-qrcode-link
  position relative
  padding-top 11px !important
  padding-bottom 10px !important
  padding-right 2px !important
  font-size 2em
  .icon-qrcode:before
    margin-right -15px !important
.p-qrcode
  position absolute
  top 10px
  right -13px
  z-index 5
  display none
  cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='),url(../img/blank.cur),none !important;
{% endcodeblock %}

Coffeescript
{% codeblock lang:coffeescript %}
base_url = ->
  arr = window.location.href.split('/')
  "#{arr[0]}//#{arr[2]}"
#qrcode
  $('.p-qrcode').qrcode({
  rendeer : 'table'
  width   : 128
  height  : 128
  foreground: "#777777"
  text    : base_url()
})
#toggle
$('.p-qrcode-link').on('mouseenter', ->
  $('.p-qrcode').show()
).on('mouseleave', ->
  $('.p-qrcode').hide()
)
{% endcodeblock %}

### 参考阅读
1. [jquery.qrcode.js](https://github.com/jeromeetienne/jquery-qrcode)
2. [Hide cursor in Chrome (and IE)](http://stackoverflow.com/questions/2636068/hide-cursor-in-chrome-and-ie)