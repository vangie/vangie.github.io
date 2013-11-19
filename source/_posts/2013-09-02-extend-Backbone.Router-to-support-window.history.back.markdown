---
layout: post
title: "扩展Backbone.Router以支持window.history.back"
date: 2013-09-02 21:37
comments: true
categories: 
---
> web应用程序重要的功能的URL通过需要达到可访问，可收藏和可分享的需求。Backbone.Router正是检测客户端url变化触发相应动作和事件的实现框架。对于没有实现HTML5 History API的浏览器，Router提供了优雅和透明的兼容实现，通过控制hash的变化。


### Route的例子

	var Workspace = Backbone.Router.extend({

  		routes: {
    		"help":                 "help",    // #help
    		"search/:query":        "search",  // #search/kiwis
    		"search/:query/p:page": "search"   // #search/kiwis/p7
  		},

  		help: function() {
    		...
  		},

  		search: function(query, page) {
    		...
  		}

	});
	
<!-- more -->
	
### Router的问题

Router很好的解决了进入一个url能触发相应的方法的问题，但是如果在离开某个url想触发相应的方法，Router显得无能为力。通常如果想通过window.history.back()退回上一页面是，触发相应的方法，就需要Router支持leave方法。

下面我们介绍如何通过扩展Backbone.Router已支持leave。

### 扩展Backbone.Router

	class BaseRouter extends Backbone.Router
      route: (route, name, callback)->

        fn = callback

        route = this._routeToRegExp(route) unless _.isRegExp route

        if _.isFunction name
          callback = name
          name = ''

        fn = callback = this[name] unless callback

        if typeof callback == 'object'
          before = callback.before
          fn = callback.route
          after = callback.after

        Backbone.history.route(route, (fragment)=>
          args = @_extractParameters(route, fragment)

          if leave
            if leave() is false
              return
            else
              leave = false

          return if before and before.apply(@, args) is false
          fn.apply(@, args) if fn
          return if after and after.apply(@, args) is false

          if typeof callback == 'object'
            leave = ((_this, args)->->callback.leave.apply(_this, args))(@, args)

          @trigger.apply(@, ["route:#{name}"].concat(args))
          @trigger('route', name, args)
          Backbone.history.trigger('route', @, name, args)
        )
        @


### 编写Route

	class extends Base.Router
      routes:
    	"bsdn_editor_:uid/writer":    "fullscreen"
      	#catch every url for leave
      	"*splat": ->

      fullscreen: {
      	route: (uid)->
          $("#bsdn_editor_#{uid}").parent().editor('showFullscreen')
      	leave: (uid)->
          $("#bsdn_editor_#{uid}").parent().editor('hideFullscreen')
   	  }


### 参考阅读
[1] [Backbone router before,after,leave](https://gist.github.com/corpix/1972890)