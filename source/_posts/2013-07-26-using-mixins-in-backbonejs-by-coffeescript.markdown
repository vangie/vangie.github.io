---
layout: post
title: "在backbonejs里使用coffeescript实现mixin"
date: 2013-07-26 09:08
comments: true
categories: 
---
> Mixin和Inheritance是两种主要的代码复用和封装的方式。Java流行的时候，大家都努力的把javascript写得像java，各大框架努力给javascript加上类继承的特性。当下是Ruby春暖花开的日子，coffeescript让开发者可以以更ruby的方式写js。javascript在不同的时期能适应潮流，足以见得原型链继承型语言的强大之处。


###用coffeescript实现Mixin
Coffescript原生并不支持Mixin，《CoffeeScript小书》第三章提到一种Mixin的实现方式

```coffeescript
moduleKeywords = ['extended', 'included']

class Module
  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      # Assign properties to the prototype
      @::[key] = value

    obj.included?.apply(@)
    this
```
<!-- more -->
上面代码定义了一个Module类型，其包含@extend和@incude两个成员方法，@include方法继承的属性可被实例访问，@extend方法继承的属性可被类访问。例如：

```coffeescript
classProperties = 
  find: (id) ->
  create: (attrs) ->

instanceProperties =
  save: -> 

class User extends Module
  @extend classProperties
  @include instanceProperties

# Usage:
user = User.find(1)

user = new User
user.save()
```
###胖箭头`=>`和Mixin
coffeescript里用`->`符号声明一个function，用`=>`符号声明一个绑定上下文this的function。   
下面是一个使用胖箭头声明的function的例子   
```coffeescript
Mixin =
  fun1 : (customer, cart) =>
    @customer = customer
    @cart = cart

  fun2 : (customer, cart) ->
    @customer = customer
    @cart = cart
```
翻译成javascript如下
```javascript
var Mixin,
  _this = this;

Mixin = {
  fun1: function(customer, cart) {
    _this.customer = customer;
    return _this.cart = cart;
  },
  fun2: function(customer, cart) {
    this.customer = customer;
    return this.cart = cart;
  }
};
```
上面例子中，将Mixin声明为普通对象，由于_this并指向当前Mixin所在的上下文this，当`=>`声明的方法fun1被include到其他类中，_this并不会指向新的对象，有悖于通常的面向对象语言中this的语义。   
`->`声明的方法虽然this没有被静态绑定，但是由于js中this指向执行时的上下文，所以在方法被外部调用时，不能执行声明方法的类对象。

再来看看把Mixin声明成class的情况

```coffeescript
class Mixin
  fun1 : (customer, cart) =>
    @customer = customer
    @cart = cart

  fun2 : (customer, cart) ->
    @customer = customer
    @cart = cart
```
翻译成javascript如下
```javascript
var Mixin,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mixin = (function() {
  function Mixin() {
    this.fun1 = __bind(this.fun1, this);
  }

  Mixin.prototype.fun1 = function(customer, cart) {
    this.customer = customer;
    return this.cart = cart;
  };

  Mixin.prototype.fun2 = function(customer, cart) {
    this.customer = customer;
    return this.cart = cart;
  };

  return Mixin;

})();
```
如果将Mixin声明为一个class，翻译成js以后，Mixin里声明的方法都被注册到Mixin.prototype上了。而且this的绑定被写在了Mixin的构造方法里，通过一个__bind包装函数进行晚绑定。如果不调用Mixin的构造方法，我们可以绑定派生类的this到方法上。

```coffeescript
class Mixin
  b: => @something = 2

class Foo extends Module
  @include Mixin::
  constructor: ->
    for fname in _.functions Mixin
      @[fname] = _.bind @[fname], @
    super
```

有两点需要注意   
1. @include Minxin.prototype
2. 构造方法中将从Mixin里继承的方法都重新绑定this

如果使用underscore的_.bindAll方法，绑定this可以简化成
```coffeescript
_.bindAll @, _funcitons(Mixin)...
```

###结合backbonejs使用Mixin
使用上面的方法，在coffeescript里使用mixin，已经完美的解决了`=>`this绑定的问题。

先解决Backbone对象不支持include的问题。
```javascript
(function() {
  Backbone.Model.include = 
  Backbone.Collection.include = 
  Backbone.View.include = 
  Backbone.Router.include = 
  function(obj) {
    var key, value, _ref;
    for (key in obj) {
      value = obj[key];
      if (key !== 'included') {
        if (!this.prototype[key]) {
          this.prototype[key] = value;
        }
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

}).call(this);
```
声明一个Mixin类
```coffeescript
class Mixin
  b: => @something = 2	
```
include该Mixin类
```coffeescript
class FooView extends Backbone.View
  @include Mixin
  constructor: ->
    b: => @something = 2
    super
```

###参考阅读
1. [Mixins/Modules behavior in coffeescript](https://gist.github.com/olivoil/1642328)    
2. [Using mixins in Coffeescript](http://stackoverflow.com/questions/12839183/using-mixins-in-coffeescript)