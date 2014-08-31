---
layout: post
title: "在JSP中使用EL计算Colloction的大小"
date: 2007-01-12 23:27:33 +0800
comments: true
categories: 
---
载入functions taglib
	<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

计算collection的size
	${fn:length(your_collction)}
 
length函数的描述如下
{% codeblock lang:xml fn.tld %}
 <function>
    <description>
      Returns the number of items in a collection, or the number of characters in a string.
    </description>
    <name>length</name>
    <function-class>org.apache.taglibs.standard.functions.Functions</function-class>
    <function-signature>int length(java.lang.Object)</function-signature>
    <example>
      You have ${fn:length(shoppingCart.products)} in your shopping cart.
    </example>
 </function>
{% endcodeblock %}