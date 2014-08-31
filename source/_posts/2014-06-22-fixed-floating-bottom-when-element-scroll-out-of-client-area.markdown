---
layout: post
title: "当元素滚动出可视区域后固定漂浮在底部"
date: 2014-06-22 00:28:05 +0800
comments: true
categories: 
---
> 页面底部放置了几个功能按钮，当页面长度超过窗口高度时需要滚动到底部才能操作。点击按钮前多了一步滚动操作，多少有些不方便。如果元素位于可视区域之外时，可以固定漂浮于窗口底部就可以解决这种不便。

![不在可视区域内时固定漂浮于底部](/images/post/2014-06-22/fixed-floating.png)

<!-- more -->

{% codeblock lang:coffeescript %}
#声明全局top变量，记录元素里页面顶部高度值
top = 0

# 计算top值
calcTop = ->
  $ff_container = $('form:visible .panel-footer')

  top = $ff_container.offset().top 

  unless jQuery.browser.mobile
    top += $ff_container.outerHeight()

# 判断是否需要固定漂浮
floating = ->
  y = $win.scrollTop() + $win.height()
  $ff_container = $('form:visible .panel-footer')
  if y >= top
    $ff_container.removeClass('fixed')
  else
    $ff_container.addClass('fixed')

# 窗口滚动时计算是否需要漂浮
$win.scroll(floating)
# 调整窗口大小时计算是否需要漂浮
$win.resize(floating)
# 在手机屏幕滚动时计算是否需要漂浮
$('body').bind('touchmove', floating)

calcTop()
floating()
{% endcodeblock %}

### 参考阅读
1. [Fixed Floating Elements](http://jqueryfordesigners.com/fixed-floating-elements/)
2. [jQuery: Fix div when browser scrolls to it](http://stackoverflow.com/questions/8644248/jquery-fix-div-when-browser-scrolls-to-it)
3. [jQuery: Fix div when browser scrolls to it](http://stackoverflow.com/questions/18753367/jquery-live-scroll-event-on-mobile-work-around)

