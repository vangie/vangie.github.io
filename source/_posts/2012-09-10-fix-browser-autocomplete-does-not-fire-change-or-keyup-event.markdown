---
layout: post
title: "浏览器自动补全不触发Input控件的onChange和onKeyup事件"
date: 2012-09-10 13:57
comments: true
categories: 
---
表单的输入校验通常会使用`onBlur`事件，这个事件有个问题，若填完最后一个输入框时，直接点击“提交”按钮，那最后一个输入框的`onBlur`事件不会触发，导致校验不会执行。这种场景下，语意最贴切的就是`onChange`事件了，但是`onChange`事件在`onBlur`事件之后触发，所有只能用`onKeyup`或者`onKeyPress`方法来感知输入框的变化。但是如果在输入时浏览器提供自动补全的功能，那`onKeyup`和`onKeyPress`事件不会被触发。

<!-- more -->

下面是通过轮询输入框来模拟change事件的方法，来解决文本框内容变化不被感知的问题。

	(function($) {
    	$.fn.listenForChange = function(options) {
        	settings = $.extend({
            	interval: 200 // 毫秒
        	}, options);

        	var jquery_object = this;
        	var current_focus = null;

        	jquery_object.filter(":input").add(":input", jquery_object).focus( function() {
            	current_focus = this;
        	}).blur( function() {
            	current_focus = null;
        	});

        	setInterval(function() {
            	// allow
            	jquery_object.filter(":input").add(":input", jquery_object).each(function() {
                	// set data cache on element to input value if not yet set
                	if ($(this).data('change_listener') == undefined) {
                    	$(this).data('change_listener', $(this).val());
                    	return;
                	}
                	// return if the value matches the cache
                	if ($(this).data('change_listener') == $(this).val()) {
                    	return;
                	}
                	// ignore if element is in focus (since change event will fire on blur)
                	if (this == current_focus) {
                    	return;
                	}
                	// if we make it here, manually fire the change event and set the new value
                	$(this).trigger('change');
                	$(this).data('change_listener', $(this).val());
            	});
        	}, settings.interval);
        	return this;
    	};
	})(jQuery);
	
然后只需要

	$("form").listenForChange();

####参考文献
1. [Capturing AutoFill as a Change Event](http://furrybrains.com/2009/01/02/capturing-autofill-as-a-change-event/)