---
layout: post
title: "Jackson多态类型数据绑定"
date: 2012-11-03 14:28
comments: true
categories: 
---
> Jackson数据绑定可以很方便的将java的对象类型和json数据格式之间进行转换。对于有多个子类型的多态集成结构的对象，Jackson在序列化的时候加入一些类型信息，可以在反序列化的时候准确的还原某个类型的子类。

想要把JSON数据准确的反序列化为正确的子类型，简单的方法就是在数据中存储数据的类型。但是Jackson序列化时默认不会将对象的类型信息保存到Json数据中。有两种方式开始使Jackson序列化类型信息

<!-- more -->

### 方式一：全局Default Typing机制

```java
objectMapper.enableDefaultTyping(); // default to using DefaultTyping.OBJECT_AND_NON_CONCRETE
objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
```
DefaultTyping有四个选项

* __JAVA_LANG_OBJECT__: 当对象属性类型为Object时生效
* __OBJECT_AND_NON_CONCRETE__: 当对象属性类型为Object或者非具体类型（抽象类和接口）时生效
* __NON_CONCRETE_AND+_ARRAYS__: 同上, 另外所有的数组元素的类型都是非具体类型或者对象类型
* __NON_FINAL__: 对所有非final类型或者非final类型元素的数组

开启DefaultTyping，并且让所有的非final类型对象持久化时都存储类型信息显然能准确的反序列多态类型的数据。

### 方式二： 为Class添加@JsonTypeInfo
先来看看`objectMapper.enableDefaultTyping()`的源码。


    /**
     * Convenience method that is equivalent to calling
     *<pre>
     *  enableObjectTyping(DefaultTyping.OBJECT_AND_NON_CONCRETE);
     *</pre>
     */
    public ObjectMapper enableDefaultTyping() {
        return enableDefaultTyping(DefaultTyping.OBJECT_AND_NON_CONCRETE);
    }
    
    /**
     * Convenience method that is equivalent to calling
     *<pre>
     *  enableObjectTyping(dti, JsonTypeInfo.As.WRAPPER_ARRAY);
     *</pre>
     */
    public ObjectMapper enableDefaultTyping(DefaultTyping dti) {
        return enableDefaultTyping(dti, JsonTypeInfo.As.WRAPPER_ARRAY);
    }



该方法内部调用涉及到了`JsonTypeInfo.As.WRAPPER_ARRAY`。下面我们来看看如何使用@JsonTypeInfo这个注释来更精细的定制序列化的JSON文件格式。

	@JsonTypeInfo(use=JsonTypeInfo.Id.CLASS, include=JsonTypeInfo.As.PROPERTY, property="@class")
	class Animal { } 
在超类Animal上加上一段@JsonTypeInfo，所有Animal的子类反序列化都可以准确的对于子类型。
我们来解释一下这段注释的意思：

* `use=JsonTypeInfo.Id.CLASS`:使用类的完全限定名作为唯一识别
* `include=JsonTypeInfo.As.PROPERTY`:将这个唯一识别的字段保存为属性值
* `property="@class"`该属性值的名称为@class
* `@JsonTypeResolver`和`@JsonTypeIdResolver`取默认值时可以省略
* 加上了该注释的类型和子类型都会生效

use的几个可选值

* CLASS 完全限定名
* MINIMAL_CLASS 类名，若基类和子类在同一包类，会省略包名
* NAME 逻辑名，需要单独定义名称与类的对应关系
* CUSTOM 由@JsonTypeIdResolver对应

include的几个选值

* PROPERTY 将属性包含在对象成员属性里
* WRAPPER_OBJECT 属性作为键，序列化的对象作为值
* WRAPPER_ARRAY 第一个元素是类型ID，第二原始是序列化的对象

```
  // Type name as a property, same as above
  {
    "@type" : "Employee",
     ...
  }

  // Wrapping class name as pseudo-property (similar to JAXB)
  {
    "com.fasterxml.beans.EmployeeImpl" : {
       ... // actual instance data without any metadata properties
    }
  }

  // Wrapping class name as first element of wrapper array:
  [
    "com.fasterxml.beans.EmployeeImpl",
    {
       ... // actual instance data without any metadata properties
    }
  ]
```

### 参考文献
1. [JacksonPolymorphicDeserialization](http://wiki.fasterxml.com/JacksonPolymorphicDeserialization)