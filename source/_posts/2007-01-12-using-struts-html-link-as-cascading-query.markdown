---
layout: post
title: "使用Struts里html:link标签 的name,paramId,paramName和paramProperty四个属性实现多级查询间相互跳转"
date: 2007-01-12 23:54:39 +0800
comments: true
categories: 
---
> 看了一些使用html:link的文章，大多只是说了paramId结合paramName和paramProperty的使用。下面将会用到name，paramId，paramName和paramProperty一起使用的效果。

<!-- more -->

### 在`<a/>`的url后面加上一个键值对key=value   

首先是先解释简单的应用paramId,paramName和paramProperty
	<html:link action="/actionName" 
		paramId="paramValue" 
		paramName="beanName" 
		paramProperty="beanProperty">
		点击链接
	</html:link>
假设在scope范围中，有一个bean叫beanName，beanName的一个属性beanProperty的值为value，那么当你点击链接之后会有下面的链接效果：
	http://localhost:8080/actionName?paramValue=value
* paramId属性是让你告诉jsp编译引擎你要传送的参数名称。
* paramName属性是使用的bean名称
* paramProperty属性是所使用bean的属性名称，两者的结合就是让你告诉jsp编译引擎你要利用参数传送bean中属性的值.

### 在`<a/>`的url后面加上一组键值对key1=value1&key2=value2…

上面只可以传送一个参数，但在应用中往往不够的，name属性就是专门用来传递多个参数的。
name属性必须是map类型的变量。
假设如果你定义下面的一个map：
	Map mapName=new HashMap();
	mapName.put("paramValue1","value1");
	mapName.put("paramValue2","value2");
	request.setAttribute("mapName",mapName);
在jsp页面有下面的一个链接：
	<html:link action="/actionName"  name="mapName">
		点击链接
	</html:link>
点击链接后的效果：
	http://localhost:8080/actionName?paramValue1=value1&paramValue2=value2

### 二者结合
 当我在一次实践中，联想了一下，当解析tag时应该会解析全部所用到的属性，所以就做了下面的一个测试，
下面是一个四个属性一起使用的例子：
	<html:link action="/actionName" 
		name="mapName" 
		paramId="paramValue" 
		paramName="beanName" 
		paramProperty="beanProperty" >
		点击链接
	</html:link>
得到的效果是：
	http://localhost:8080/atcionName?paramValue1=value1&paramValue2=value2&paramValue=value
所有属性的值都解析出来了。
这样的效果可以用在你想一级一级的推论下去达到的链接效果。
也就是说，当你提交之后，你可以把paramValue的值put进name属性对应的Map中，再返回用在name属性上。
当你想返回上面一级的时候可以remove掉。
或者当你的参数存放的是数据库中多个表格的级联主健，
当你想向后查询上级表格时你就可以直接拿到主健进行查询，不用一级一级向数据库往回查询推出主健。