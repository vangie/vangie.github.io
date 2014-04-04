---
layout: post
title: "Java泛型让声明方法返回子类型"
date: 2014-03-05 11:11:45 +0800
comments: true
categories: 
---
> 泛型典型的使用场景是集合。考虑到大多数情况下集合是同质的（同一类型），通过声明参数类型，可免去类型转换的麻烦。本文将讨论本人阅读Spring Security源码时遇到的一个关于***泛型递归模式***的问题。

###声明方法返回子类型

在Spring Security的源码里有一个`ProviderManagerBuilder`接口，声明如下

	public interface ProviderManagerBuilder<B extends ProviderManagerBuilder<B>> extends SecurityBuilder<AuthenticationManager> {
	    B authenticationProvider(AuthenticationProvider authenticationProvider);
	}
	
其实现类`AuthenticationManagerBuilder`

	public class AuthenticationManagerBuilder extends AbstractConfiguredSecurityBuilder<AuthenticationManager, AuthenticationManagerBuilder> implements ProviderManagerBuilder<AuthenticationManagerBuilder> {
	
	    //...
	    
		public AuthenticationManagerBuilder authenticationProvider(
            AuthenticationProvider authenticationProvider) {
        	this.authenticationProviders.add(authenticationProvider);
        	return this;
    	}
    	
	    //...
	
	}
	
上面有很多干扰项，我们来简化一下

<!-- more -->

接口`A`定义如下

	public interface A<T extends A<T>> {
	
		T add();

	}
>说明：`A`接口只有一个`add`方法，返回泛型`T`。`T`的声明有些饶`<T extends A<T>>`。
	
`A`接口的实现类`B`

	public class B implements A<B> {
		
		@Override
		public B add() {
			return null;
		}

	}
注意，此处类`B`里的add方法返回类型`B`。也就是说，接口`A`里声明的方法时并不知道子类型`B`的存在，通过继承和泛型，可以放返回值动态的适配子类型，这一切都要归功于`<T extends A<T>>`

###泛型递归模式（Recurring Generic Pattern）
`public interface A<T extends A<T>>`对于参数类型`T`是递归定义的。有如GNU的定义“GNU's Not Unix!”。

典型的例子是`java.lang.Enum`

	public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable {
    	//...
    }

> java所有的枚举类型都隐式的继承`java.lang.Enum`，不允许通过现实的继承声明枚举类型，甚至集成`java.lang.Enum`也是编译器所不允许的。

假设有一个枚举类`StatusCode`,其等价的声明如下

	public class StatusCode extends Enum<StatusCode>
	
现在我们来验证一下泛型约束，

1.	因为`Enum<StatusCode>`,所以`E=StatusCode`
2.	根据`<E extend Enum<E>>` 和 `E=StatusCode` 可得，`<StatusCode extend Enum<StatusCode>>`，
3.	由于`public class StatusCode extends Enum<StatusCode>`第二步的结论显然成立。

####为什么Enum的声明这么绕？直接Enum<E>不行么？

因为`Enum<E>`实现了`Comparable<E>`接口，该接口有一个`compareTo`方法

	public int compareTo(E o) {}
	
<E extend Enum<E>>强制约束了进行`compareTo`的调用对象类型和参数类型都严格一致，不会出现子类和超类或者兄弟类之间的比较。

###泛型递归模式与继承
泛型递归模式`interface A<T extend A<T>>`用于约束参数类型T，要求其为类型`A`的子类。考虑到继承和实现`B implements A<B>`,参数类型和实体类型是一致的。这样类`A`中方法签名里涉及到参数类型`T`的地方，在实现类里会为实现类本身，这让类型系统更加的严谨。
	
###参考文献
1. [Java Enum definition](http://stackoverflow.com/questions/211143/java-enum-definition)
2. [Java Toturial - Enum Types](http://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
